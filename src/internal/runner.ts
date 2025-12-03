import type { BotApiError } from '../BotApi.ts'
import type { BotApiTransportError } from '../BotApiTransport.ts'
import type { Runner } from '../Runner.ts'
import * as Duration from 'effect/Duration'
import * as Effect from 'effect/Effect'
import * as Match from 'effect/Match'
import * as Schedule from 'effect/Schedule'
import { Update } from '../Bot.ts'
import { BotApi } from '../BotApi.ts'

export const makeSimple = (options?: {
  allowedUpdates?: string[]
}): Runner<BotApiError | BotApiTransportError, BotApi> => ({
  run: bot => Effect.gen(function* () {
    const { allowedUpdates } = options ?? {}
    const api = yield* BotApi
    let lastUpdateId: undefined | number
    while (true) {
      const [update] = yield* api
        .getUpdates({
          offset: lastUpdateId == null ? undefined : lastUpdateId + 1,
          allowed_updates: allowedUpdates,
          timeout: 30,
          limit: 1,
        })
        .pipe(
          Effect.retry({
            schedule: Schedule.spaced(Duration.seconds(3)),
            while: error => Match.value(error).pipe(
              Match.tagsExhaustive({
                '@grom.js/effect-tg/BotApiError': error => Effect.succeed(
                  error.code >= 500 || (
                    error.code !== 401
                    && error.code !== 403
                    && error.code !== 404
                  ),
                ),
                '@grom.js/effect-tg/BotApiTransportError': () => Effect.succeed(true),
              }),
            ),
          }),
        )
      if (update) {
        yield* Effect
          .provideService(bot, Update, update)
          .pipe(
            Effect.catchAll(error => (
              Effect.logError('Error in bot:', error)
            )),
          )
        lastUpdateId = update.update_id
      }
    }
  }),
})
