// TODO: refactor this to utility that given a bot, path, and secret,
//       creates an HttpApiEndpoint and helper to call `setWebhook`

import type * as HttpServerError from '@effect/platform/HttpServerError'
import type * as BotApi from './BotApi.ts'
import * as HttpApiMiddleware from '@effect/platform/HttpApiMiddleware'
import * as HttpApiSchema from '@effect/platform/HttpApiSchema'
import * as HttpServerRequest from '@effect/platform/HttpServerRequest'
import * as $Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Redacted from 'effect/Redacted'
import * as Schema from 'effect/Schema'

export const SECRET_HEADER = 'x-telegram-bot-api-secret-token'

// eslint-disable-next-line unicorn/throw-new-error
export class VerificationFailedError extends Schema.TaggedError<VerificationFailedError>()(
  '@grom.js/effect-tg/BotApiWebhook/VerificationFailedError',
  {},
  HttpApiSchema.annotations({
    status: 401,
    description: 'Missing or invalid webhook secret.',
  }),
) {}

export class Context extends $Context.Tag('@grom.js/effect-tg/BotApiWebhook/Context')<
  Context,
  { update: Effect.Effect<BotApi.Types.Update, HttpServerError.RequestError> }
>() {}

export class VerifyMiddleware extends HttpApiMiddleware.Tag<VerifyMiddleware>()(
  '@grom.js/effect-tg/BotApiWebhook/VerifyMiddleware',
  {
    optional: false,
    failure: VerificationFailedError,
    provides: Context,
  },
) {
  public static layer(options: {
    /**
     * Telegram webhook secret token.
     */
    secret: Redacted.Redacted<string>
  }) {
    return Layer.succeed(
      VerifyMiddleware,
      Effect.gen(function* () {
        const request = yield* HttpServerRequest.HttpServerRequest
        const actual = request.headers[SECRET_HEADER]
        if (actual == null) {
          return yield* new VerificationFailedError()
        }
        if (actual !== Redacted.value(options.secret)) {
          return yield* new VerificationFailedError()
        }
        return {
          update: Effect.map(request.json, update => update as BotApi.Types.Update),
        }
      }),
    )
  }
}
