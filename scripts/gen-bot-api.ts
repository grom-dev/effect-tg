import type { ValueType } from '@grom.js/bot-api-spec/format'
import type { SourceFile } from 'ts-morph'
import { methods, types } from '@grom.js/bot-api-spec'
import { Project, Writers } from 'ts-morph'

async function main() {
  const project = new Project()
  const file = project.createSourceFile('./src/internal/botApi.gen.ts', {}, { overwrite: true })
  genBotApi(file)
  await project.save()
}

function genBotApi(f: SourceFile): void {
  // #region imports
  f.addImportDeclarations([
    {
      isTypeOnly: true,
      namedImports: ['BotApiMethod'],
      moduleSpecifier: '../BotApi.ts',
    },
  ])
  f.addImportDeclaration({
    isTypeOnly: true,
    namedImports: ['InputFile'],
    moduleSpecifier: '../File.ts',
  })
  // #endregion imports

  // #region ValueType
  const genValueType = (t: ValueType): string => {
    switch (t.type) {
      case 'str':
        return t.literal != null
          ? `"${t.literal}"`
          : 'string'
      case 'bool':
        return t.literal != null
          ? `${t.literal}`
          : 'boolean'
      case 'int32':
        return t.literal != null
          ? `${t.literal}`
          : 'number'
      case 'int53':
      case 'float':
        return 'number'
      case 'input-file':
        return 'InputFile'
      case 'api-type':
        return `Types.${t.name}`
      case 'array':
        return `Array<${genValueType(t.of)}>`
      case 'union':
        return `${t.types.map(t => genValueType(t)).join(' | ')}`
    }
  }
  // #endregion ValueType

  // #region BotApi
  f.addInterface({
    isExported: true,
    isDefaultExport: false,
    name: 'BotApi',
    properties: Object
      .values(methods)
      .map(({ name, description }) => ({
        name,
        docs: [description.markdown],
        type: `BotApiMethod<'${name}'>`,
      })),
  })
  // #endregion BotApi

  // #region types
  const nsTypes = f.addModule({
    name: 'Types',
    hasDeclareKeyword: true,
    isExported: true,
  })

  for (const type of Object.values(types)) {
    if (type.fields) {
      nsTypes.addInterface({
        isExported: true,
        isDefaultExport: false,
        name: type.name,
        docs: [type.description.markdown],
        properties: type.fields.map(field => ({
          name: field.name,
          type: genValueType(field.type),
          hasQuestionToken: !field.required,
          docs: [field.description.markdown],
        })),
      })
    }
    else {
      nsTypes.addTypeAlias({
        isExported: true,
        isDefaultExport: false,
        name: type.name,
        docs: [type.description.markdown],
        type: genValueType({ type: 'union', types: type.oneOf }),
      })
    }
  }
  // #endregion types

  // #region methods
  const iMethodParams = f.addInterface({
    name: 'MethodParams',
    isExported: true,
    isDefaultExport: false,
  })
  const iMethodResults = f.addInterface({
    name: 'MethodResults',
    isExported: true,
    isDefaultExport: false,
  })
  for (const { name, parameters, returnType } of Object.values(methods)) {
    const paramsOptional = !(parameters.some(({ required }) => required))
    const typeSrc = parameters.length > 0
      ? Writers.objectType({
          properties: parameters
            .map(param => ({
              name: param.name,
              docs: [param.description.markdown],
              type: genValueType(param.type),
              hasQuestionToken: !param.required,
            })),
        })
      : 'Record<string, never>'
    iMethodParams.addProperty({
      name,
      type: paramsOptional ? Writers.unionType('void', typeSrc) : typeSrc,
    })
    iMethodResults.addProperty({
      name,
      hasQuestionToken: false,
      type: genValueType(returnType),
    })
  }
  // #endregion methods
}

if (import.meta.main) {
  await main()
}
