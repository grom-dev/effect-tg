import type * as HttpClient from '@effect/platform/HttpClient'
import type * as BotApiUrl from '../BotApiUrl.ts'
import * as HttpBody from '@effect/platform/HttpBody'
import * as Chunk from 'effect/Chunk'
import * as Effect from 'effect/Effect'
import * as Stream from 'effect/Stream'
import * as BotApiTransport from '../BotApiTransport.ts'
import * as File from '../File.ts'

interface ExtractedFile {
  attachId: string
  file: File.InputFile
}

/**
 * Recursively checks whether a value contains {@linkcode File.InputFile} instances.
 */
const hasInputFile = (value: unknown): boolean => {
  if (value instanceof File.InputFile)
    return true
  if (Array.isArray(value))
    return value.some(hasInputFile)
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).some(hasInputFile)
  }
  return false
}

const cloneAndExtract = (
  value: unknown,
  files: ExtractedFile[],
): unknown => {
  if (value instanceof File.InputFile) {
    const attachId = String(files.length + 1)
    files.push({ attachId, file: value })
    return `attach://${attachId}`
  }
  if (Array.isArray(value)) {
    return value.map(item => cloneAndExtract(item, files))
  }
  if (typeof value === 'object' && value !== null) {
    const result: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      result[k] = cloneAndExtract(v, files)
    }
    return result
  }
  return value
}

/**
 * Deep clones params, replacing {@linkcode InputFile} instances with
 * `attach://{id}` strings and collecting them into the files array.
 */
const extractFiles = (params: unknown): {
  params: Record<string, unknown>
  files: ExtractedFile[]
} => {
  const files: ExtractedFile[] = []
  const cloned = cloneAndExtract(params, files)
  return { params: cloned as Record<string, unknown>, files }
}

/**
 * Creates an HTTP body for a Bot API request from the given parameters.
 *
 * If the request contains no files to upload, body is serialized as JSON.
 *
 * If the request contains files to upload, body is serialized
 * as `multipart/form-data`, according to the bot API docs and implementation.
 * (credits to {@link https://github.com/grammyjs/grammY/blob/574019752feffae9d4dbe69c0f8f97fba1d06916/src/core/payload.ts grammY}).
 *
 * @see {@link https://core.telegram.org/bots/api#sending-files Bot API • Sending Files}
 * @see {@link https://github.com/tdlib/telegram-bot-api/blob/3b6a0b769c4a7fbe064087a4ad9fe6b1dbda498f/telegram-bot-api/Client.cpp#L9339 telegram-bot-api • Client::get_input_file}
 */
const makeHttpBody = Effect.fnUntraced(function* (params: unknown) {
  // TODO: Short-circuit for methods that are known to not have files.
  if (!hasInputFile(params)) {
    return yield* HttpBody.json(params)
  }
  const { params: processedParams, files } = extractFiles(params)
  const formData = new FormData()
  for (const [key, value] of Object.entries(processedParams)) {
    if (value == null)
      continue
    const serialized = typeof value === 'string' ? value : JSON.stringify(value)
    formData.append(key, serialized)
  }
  // TODO: Support streamable multipart/form-data uploads.
  // TODO: Make sure current implementation constructs blob efficiently.
  for (const { attachId, file } of files) {
    const chunks = yield* Stream.runCollect(file.stream)
    const bytes = new Uint8Array(Chunk.toReadonlyArray(chunks).flatMap(chunk => [...chunk]))
    const blob = new Blob([bytes], { type: file.mimeType ?? 'application/octet-stream' })
    formData.append(attachId, blob, file.filename)
  }
  return HttpBody.formData(formData)
})

export const make = (
  httpClient: HttpClient.HttpClient,
  botApiUrl: BotApiUrl.BotApiUrl.Service,
): BotApiTransport.BotApiTransport.Service => ({
  sendRequest: (method, params) => (
    Effect.gen(function* () {
      const body = yield* makeHttpBody(params)
      const response = yield* httpClient.post(botApiUrl.toMethod(method), { body })
      const responseJson = yield* response.json
      // We trust Bot API and don't want to introduce overhead with validation.
      return responseJson as BotApiTransport.BotApiResponse
    })
      .pipe(
        Effect.catchAll(cause => (
          Effect.fail(new BotApiTransport.BotApiTransportError({ cause }))
        )),
      )
  ),
})
