import * as Context from 'effect/Context'

const _BotApiUrl: Context.TagClass<BotApiUrl, '@grom.js/effect-tg/BotApiUrl', Service> = Context.Tag('@grom.js/effect-tg/BotApiUrl')<BotApiUrl, Service>()
export class BotApiUrl extends _BotApiUrl {}

export interface Service {
  toMethod: (method: string) => URL
  toFile: (filePath: string) => URL
}

export const makeProd = (token: string): Service => (
  {
    toMethod: (method: string) => new URL(`https://api.telegram.org/bot${token}/${method}`),
    toFile: (filePath: string) => new URL(`https://api.telegram.org/file/bot${token}/${filePath}`),
  }
)

export const makeTest = (token: string): Service => (
  {
    toMethod: (method: string) => new URL(`https://api.telegram.org/bot${token}/test/${method}`),
    // TODO: make sure this works in test environment
    toFile: (filePath: string) => new URL(`https://api.telegram.org/file/bot${token}/${filePath}`),
  }
)
