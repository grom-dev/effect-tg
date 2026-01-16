import * as Duration from 'effect/Duration'
import * as BotApiError from '../BotApiError.ts'

export const narrow = (
  error: BotApiError.BotApiError,
): BotApiError.KnownError | BotApiError.BotApiError => {
  const code = error.code
  const msg = error.message.toLowerCase()
  const params = error.parameters
  if (code === 429 && params?.retry_after != null) {
    return new BotApiError.TooManyRequests({
      cause: error,
      retryAfter: Duration.seconds(params.retry_after),
    })
  }
  if (code === 403) {
    if (msg.includes('bot was blocked by the user')) {
      return new BotApiError.BotBlockedByUser({ cause: error })
    }
  }
  if (code === 400) {
    if (msg.includes('message is not modified')) {
      return new BotApiError.MessageNotModified({ cause: error })
    }
    if (msg.includes('reply markup too long')) {
      return new BotApiError.ReplyMarkupTooLong({ cause: error })
    }
    if (msg.includes('query is too old') && msg.includes('query id is invalid')) {
      return new BotApiError.QueryIdInvalid({ cause: error })
    }
    if (msg.includes('can\'t use the media of the specified type in the album')) {
      return new BotApiError.MediaGroupedInvalid({ cause: error })
    }
  }
  return error
}
