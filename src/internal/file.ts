import type { FileId } from '../File.ts'
import * as HttpClient from '@effect/platform/HttpClient'
import * as Effect from 'effect/Effect'
import * as BotApi from '../BotApi.ts'
import * as BotApiUrl from '../BotApiUrl.ts'

export const download = Effect.fnUntraced(
  function* (fileId: FileId) {
    const file = yield* BotApi.callMethod('getFile', { file_id: fileId })
    if (file.file_path == null) {
      return yield* Effect.die(new Error(`Bot API returned no file path for file "${fileId}".`))
    }
    const url = yield* BotApiUrl.BotApiUrl
    return yield* HttpClient.get(url.toFile(file.file_path))
  },
)
