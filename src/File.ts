import type * as Stream from 'effect/Stream'
import * as HttpClient from '@effect/platform/HttpClient'
import * as Brand from 'effect/Brand'
import * as Data from 'effect/Data'
import * as Effect from 'effect/Effect'
import * as BotApi from './BotApi.ts'
import * as BotApiUrl from './BotApiUrl.ts'

/**
 * @see https://core.telegram.org/bots/api#sending-files
 */
export type Sendable
  = | FileId
    | External
    | InputFile

export type FileId = string & Brand.Brand<'FileId'>
export const FileId = Brand.nominal<FileId>()

export type External = URL & Brand.Brand<'External'>
export const External = Brand.nominal<External>()

export class InputFile extends Data.TaggedClass('InputFile')<{
  stream: Stream.Stream<Uint8Array>
  filename: string
  mimeType?: string
}> {}

/**
 * @internal
 */
const downloadRequest = Effect.fnUntraced(
  function* (fileId: FileId) {
    const file = yield* BotApi.callMethod('getFile', { file_id: fileId })
    if (file.file_path == null) {
      return yield* Effect.die(new Error(`Bot API returned no file path for file "${fileId}".`))
    }
    const url = yield* BotApiUrl.BotApiUrl
    return yield* HttpClient.get(url.toFile(file.file_path))
  },
)

export const download = (fileId: FileId) => (
  downloadRequest(fileId).pipe(
    Effect.flatMap(request => request.arrayBuffer),
  )
)

export const downloadStream = (fileId: FileId) => (
  downloadRequest(fileId).pipe(
    Effect.andThen(request => request.stream),
  )
)
