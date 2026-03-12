import type * as HttpClient from '@effect/platform/HttpClient'
import type * as HttpClientError from '@effect/platform/HttpClientError'
import type * as HttpClientResponse from '@effect/platform/HttpClientResponse'
import type * as Effect from 'effect/Effect'
import type * as Stream from 'effect/Stream'
import type * as BotApi from './BotApi.ts'
import type * as BotApiError from './BotApiError.ts'
import type * as BotApiUrl from './BotApiUrl.ts'
import * as Brand from 'effect/Brand'
import * as Predicate from 'effect/Predicate'
import * as internal from './internal/file.ts'

export type FileId = string & Brand.Brand<'FileId'>
export const FileId: Brand.Brand.Constructor<FileId> = Brand.nominal<FileId>()

export type External = URL & Brand.Brand<'External'>
export const External: Brand.Brand.Constructor<External> = Brand.nominal<External>()

// =============================================================================
// InputFile
// =============================================================================

const InputFileTypeId: unique symbol = Symbol.for('effect-tg/InputFile')

export type InputFileTypeId = typeof InputFileTypeId

export interface InputFile {
  readonly [InputFileTypeId]: InputFileTypeId
  readonly stream: Stream.Stream<Uint8Array>
  readonly filename: string
  readonly mimeType?: string
}

const InputFileProto = {
  [InputFileTypeId]: InputFileTypeId,
}

export const make: (args: {
  stream: Stream.Stream<Uint8Array>
  filename: string
  mimeType?: string
}) => InputFile = ({ stream, filename, mimeType }) => {
  const file = Object.create(InputFileProto)
  file.stream = stream
  file.filename = filename
  file.mimeType = mimeType
  return file
}

export const isInputFile = (u: unknown): u is InputFile => Predicate.hasProperty(u, InputFileTypeId)

// =============================================================================
// Utilities
// =============================================================================

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
