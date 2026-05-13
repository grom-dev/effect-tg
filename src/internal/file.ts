import type * as File from '../File.ts'
import * as Effect from 'effect/Effect'
import * as HttpClient from 'effect/unstable/http/HttpClient'
import * as BotApi from '../BotApi.ts'
import * as BotApiUrl from '../BotApiUrl.ts'

/**
 * @internal
 */
export const download = Effect.fnUntraced(
  function* (fileId: File.FileId) {
    const file = yield* BotApi.callMethod('getFile', { file_id: fileId })
    if (file.file_path == null) {
      return yield* Effect.die(new Error(`Bot API returned no file path for file "${fileId}".`))
    }
    const url = yield* BotApiUrl.BotApiUrl
    return yield* HttpClient.get(url.toFile(file.file_path))
  },
)
