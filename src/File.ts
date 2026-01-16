import type * as HttpClient from '@effect/platform/HttpClient'
import type * as HttpClientError from '@effect/platform/HttpClientError'
import type * as HttpClientResponse from '@effect/platform/HttpClientResponse'
import type * as Effect from 'effect/Effect'
import type * as Stream from 'effect/Stream'
import type * as BotApi from './BotApi.ts'
import type * as BotApiError from './BotApiError.ts'
import type * as BotApiTransport from './BotApiTransport.ts'
import type * as BotApiUrl from './BotApiUrl.ts'
import * as Brand from 'effect/Brand'
import * as Data from 'effect/Data'
import * as internal from './internal/file.ts'

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
 * Downloads a file from the Bot API server.
 *
 * @see {@link https://core.telegram.org/bots/api#getfile Bot API • getFile}
 */
export const get: (fileId: FileId) => Effect.Effect<
  HttpClientResponse.HttpClientResponse,
  BotApiError.BotApiError | BotApiTransport.BotApiTransportError | HttpClientError.HttpClientError,
  BotApi.BotApi | BotApiUrl.BotApiUrl | HttpClient.HttpClient
> = internal.get
