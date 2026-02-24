import type * as HttpClientError from '@effect/platform/HttpClientError'
import type * as HttpClientResponse from '@effect/platform/HttpClientResponse'
import type * as BotApiError from '../BotApiError.ts'
import type * as File from '../File.ts'
import * as HttpClient from '@effect/platform/HttpClient'
import * as Effect from 'effect/Effect'
import * as BotApi from '../BotApi.ts'
import * as BotApiUrl from '../BotApiUrl.ts'

export const download: (fileId: File.FileId) => Effect.Effect<
  HttpClientResponse.HttpClientResponse,
  BotApiError.BotApiError | HttpClientError.HttpClientError,
  BotApi.BotApi | BotApiUrl.BotApiUrl | HttpClient.HttpClient
> = Effect.fnUntraced(
  function* (fileId) {
    const file = yield* BotApi.callMethod('getFile', { file_id: fileId })
    if (file.file_path == null) {
      return yield* Effect.die(new Error(`Bot API returned no file path for file "${fileId}".`))
    }
    const url = yield* BotApiUrl.BotApiUrl
    return yield* HttpClient.get(url.toFile(file.file_path))
  },
)
