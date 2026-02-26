import type * as HttpClient from '@effect/platform/HttpClient'
import type * as HttpClientError from '@effect/platform/HttpClientError'
import type * as HttpClientResponse from '@effect/platform/HttpClientResponse'
import type * as Effect from 'effect/Effect'
import type * as Stream from 'effect/Stream'
import type * as BotApi from './BotApi.ts'
import type * as BotApiError from './BotApiError.ts'
import type * as BotApiUrl from './BotApiUrl.ts'
import * as Brand from 'effect/Brand'
import * as Data from 'effect/Data'
import * as internal from './internal/file.ts'

export type FileId = string & Brand.Brand<'FileId'>
export const FileId: Brand.Brand.Constructor<FileId> = Brand.nominal<FileId>()

export type External = URL & Brand.Brand<'External'>
export const External: Brand.Brand.Constructor<External> = Brand.nominal<External>()

export interface InputFile {
  readonly _tag: 'InputFile'
  readonly stream: Stream.Stream<Uint8Array>
  readonly filename: string
  readonly mimeType?: string
}
export const InputFile: Data.Case.Constructor<InputFile, '_tag'> = Data.tagged<InputFile>('InputFile')

export const isInputFile = (u: unknown): u is InputFile =>
  typeof u === 'object' && u !== null && '_tag' in u && (u as { _tag: unknown })._tag === 'InputFile'

/**
 * Downloads a file from the Bot API server.
 *
 * @see {@link https://core.telegram.org/bots/api#getfile Bot API • getFile}
 */
export const download: (fileId: FileId) => Effect.Effect<
  HttpClientResponse.HttpClientResponse,
  BotApiError.BotApiError | HttpClientError.HttpClientError,
  BotApi.BotApi | BotApiUrl.BotApiUrl | HttpClient.HttpClient
> = internal.download
