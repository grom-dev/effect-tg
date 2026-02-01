import type * as BotApiError from '../BotApiError.ts'
import type * as Runner from '../Runner.ts'
import * as Duration from 'effect/Duration'
import * as Effect from 'effect/Effect'
import * as Match from 'effect/Match'
import * as Schedule from 'effect/Schedule'
import * as Bot from '../Bot.ts'
import * as BotApi from '../BotApi.ts'

export const makeSimple = (options?: {
  allowedUpdates?: string[]
}): Runner.Runner<BotApiError.BotApiError, BotApi.BotApi> => ({
  run: Effect.fnUntraced(
    function* (bot) {
      const { allowedUpdates } = options ?? {}
      const api = yield* BotApi.BotApi
      let lastUpdateId: undefined | number
      while (true) {
        const updates = yield* api.getUpdates({
          offset: lastUpdateId == null ? undefined : lastUpdateId + 1,
          allowed_updates: allowedUpdates,
          timeout: 30,
          limit: 1,
        }).pipe(
          Effect.retry({
            schedule: Schedule.exponential(Duration.millis(100)),
            while: e => Match.value(e).pipe(
              Match.tag('InternalServerError', () => true),
              Match.tag('TransportError', e => Match.value(e.cause).pipe(
                Match.tag('RequestError', e => e.reason === 'Transport'),
                Match.orElse(() => false),
              )),
              Match.orElse(() => false),
            ),
          }),
          Effect.catchTag('RateLimited', e => Effect.gen(function* () {
            yield* Effect.sleep(e.retryAfter)
            return []
          })),
        )
        if (updates.length > 0) {
          const update = updates[0]!
          yield* Effect.provideService(bot, Bot.Update, update).pipe(
            Effect.catchAll(error => (
              Effect.logError('Error in bot:', error)
            )),
          )
          lastUpdateId = update.update_id
        }
      }
    },
  ),
})
