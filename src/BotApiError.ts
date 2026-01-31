import type * as Duration from 'effect/Duration'
import type * as BotApi from './BotApi.ts'
import * as Data from 'effect/Data'
import * as internal from './internal/botApiError.ts'

/**
 * Error returned from the Bot API server in case of unsuccessful method call.
 */
export class BotApiError extends Data.TaggedError('@grom.js/effect-tg/BotApiError')<{
  code: number
  description: string
  parameters?: BotApi.Types.ResponseParameters
}> {
  override get message() {
    return `(${this.code}) ${this.description}`
  }
}

/**
 * Attempts to narrow a {@link BotApiError} to a more specific {@link KnownError}.
 *
 * **Warning!** Error types are detected based on the error code and message
 * returned from the Bot API, which are not guaranteed to be the same in
 * the future. If they change, this function may not determine error type
 * correctly.
 *
 * @see {@link https://github.com/tdlib/telegram-bot-api telegram-bot-api source code}
 */
export const narrow: (error: BotApiError) => KnownError | BotApiError = internal.narrow

export type KnownError =
  | TooManyRequests
  | BotBlockedByUser
  | MessageNotModified
  | ReplyMarkupTooLong
  | QueryIdInvalid
  | MediaGroupedInvalid

/**
 * Flood limit exceeded. Need to wait `retryAfter` before retrying.
 */
export class TooManyRequests extends Data.TaggedError('@grom.js/effect-tg/BotApiError/TooManyRequests')<{
  cause: BotApiError
  retryAfter: Duration.Duration
}> {}

/**
 * Bot was blocked by the user.
 */
export class BotBlockedByUser extends Data.TaggedError('@grom.js/effect-tg/BotApiError/BotBlockedByUser')<{
  cause: BotApiError
}> {}

/**
 * Message was not modified as its content and reply markup
 * are exactly the same as the current one.
 */
export class MessageNotModified extends Data.TaggedError('@grom.js/effect-tg/BotApiError/MessageNotModified')<{
  cause: BotApiError
}> {}

/**
 * Message reply markup is too long.
 */
export class ReplyMarkupTooLong extends Data.TaggedError('@grom.js/effect-tg/BotApiError/ReplyMarkupTooLong')<{
  cause: BotApiError
}> {}

/**
 * Query has expired, or ID is invalid.
 */
export class QueryIdInvalid extends Data.TaggedError('@grom.js/effect-tg/BotApiError/QueryIdInvalid')<{
  cause: BotApiError
}> {}

/**
 * Invalid combination of media types in the media group.
 */
export class MediaGroupedInvalid extends Data.TaggedError('@grom.js/effect-tg/BotApiError/MediaGroupedInvalid')<{
  cause: BotApiError
}> {}
