import type { BotApiError } from '../BotApiError.ts'
import type { BotApiTransportError } from '../BotApiTransport.ts'
import type { Runner } from '../Runner.ts'
import * as Chunk from 'effect/Chunk'
import * as Duration from 'effect/Duration'
import * as Effect from 'effect/Effect'
import * as Match from 'effect/Match'
import * as Ref from 'effect/Ref'
import * as Schedule from 'effect/Schedule'
import * as Stream from 'effect/Stream'
import { Update } from '../Bot.ts'
import { BotApi } from '../BotApi.ts'

export const make = (options?: {
  allowedUpdates?: string[]
  concurrency?: number | 'unbounded'
}): Runner<BotApiError | BotApiTransportError, BotApi> => ({
  run: Effect.fnUntraced(
    function* (bot) {
      const { allowedUpdates, concurrency } = options ?? {}
      const api = yield* BotApi
      const offset = yield* Ref.make<number | undefined>(undefined)

      const getUpdates = Effect.gen(function* () {
        const lastUpdateId = yield* Ref.get(offset)
        const updates = yield* api
          .getUpdates({
            offset: lastUpdateId,
            allowed_updates: allowedUpdates,
            timeout: 30,
            limit: 100,
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
                  '@grom.js/effect-tg/BotApiTransport/BotApiTransportError': () => Effect.succeed(true),
                }),
              ),
            }),
          )

        if (updates.length > 0) {
          const lastId = updates[updates.length - 1]!.update_id
          yield* Ref.set(offset, lastId + 1)
        }

        return Chunk.fromIterable(updates)
      })

      return yield* Stream.repeatEffect(getUpdates).pipe(
        Stream.mapConcatChunk(chunk => chunk),
        Stream.mapEffect(
          update => Effect
            .provideService(bot, Update, update)
            .pipe(
              Effect.catchAll(error => (
                Effect.logError('Error in bot:', error)
              )),
            ),
          { concurrency: concurrency ?? 10 },
        ),
        Stream.runDrain,
        Effect.andThen(Effect.never),
      )
    },
  ),
})

export const makeSimple = (options?: {
  allowedUpdates?: string[]
}): Runner<BotApiError | BotApiTransportError, BotApi> => make({
  ...options,
  concurrency: 1,
})
