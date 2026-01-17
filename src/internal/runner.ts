import type { Types } from '../BotApi.ts'
import type { BotApiError } from '../BotApiError.ts'
import type { BotApiTransportError } from '../BotApiTransport.ts'
import type { Runner } from '../Runner.ts'
import * as Chunk from 'effect/Chunk'
import * as Duration from 'effect/Duration'
import * as Effect from 'effect/Effect'
import * as Fiber from 'effect/Fiber'
import * as HashSet from 'effect/HashSet'
import * as Match from 'effect/Match'
import * as Option from 'effect/Option'
import * as Queue from 'effect/Queue'
import * as Ref from 'effect/Ref'
import * as Schedule from 'effect/Schedule'
import * as Stream from 'effect/Stream'
import { Update } from '../Bot.ts'
import { BotApi } from '../BotApi.ts'

interface UpdatesState {
  lastConfirmedId: number | undefined
  pending: HashSet.HashSet<number>
  finished: HashSet.HashSet<number>
}

const makeState = () => Ref.make<UpdatesState>({
  lastConfirmedId: undefined,
  pending: HashSet.empty(),
  finished: HashSet.empty(),
})

export const make = (options?: {
  allowedUpdates?: string[]
  concurrency?: number | 'unbounded'
}): Runner<BotApiError | BotApiTransportError, BotApi> => ({
  run: Effect.fnUntraced(
    function* (bot) {
      const { allowedUpdates, concurrency } = options ?? {}
      const api = yield* BotApi
      const stateRef = yield* makeState()
      const isShuttingDown = yield* Ref.make(false)

      // Queue for updates to be processed.
      // Bounded to provide backpressure.
      const queue = yield* Queue.bounded<Option.Option<Types.Update>>(1000)

      const processUpdate = (update: Types.Update) =>
        Effect.gen(function* () {
          // Run the bot logic
          yield* Effect.provideService(bot, Update, update).pipe(
            Effect.catchAll(error => Effect.logError('Error in bot:', error)),
          )
        }).pipe(
          // Ensure we track completion even if interrupted
          Effect.uninterruptible,
          Effect.ensuring(Effect.gen(function* () {
            // Update state: mark finished, remove pending, advance confirmed
            yield* Ref.update(stateRef, (state) => {
              const finished = HashSet.add(state.finished, update.update_id)
              const pending = HashSet.remove(state.pending, update.update_id)

              let nextConfirmed = state.lastConfirmedId
              let currentFinished = finished
              let changed = false

              // Try to advance confirmation
              while (true) {
                let target: number | undefined
                if (nextConfirmed === undefined) {
                  const finishedIds = Chunk.fromIterable(currentFinished)
                  const minFinished = Chunk.reduce(finishedIds, undefined as number | undefined, (min, id) =>
                    min === undefined || id < min ? id : min)
                  if (minFinished === undefined)
                    break
                  target = minFinished
                }
                else {
                  target = nextConfirmed + 1
                }

                // Check barrier
                const pendingIds = Chunk.fromIterable(pending)
                const hasSmallerPending = Chunk.some(pendingIds, p => p < target)
                if (hasSmallerPending)
                  break

                // Verify target is finished
                if (HashSet.has(currentFinished, target)) {
                  nextConfirmed = target
                  currentFinished = HashSet.remove(currentFinished, target)
                  changed = true
                }
                else {
                  break
                }
              }

              return changed
                ? {
                    lastConfirmedId: nextConfirmed,
                    pending,
                    finished: currentFinished,
                  }
                : {
                    lastConfirmedId: state.lastConfirmedId,
                    pending,
                    finished: currentFinished,
                  }
            })
          })),
        )

      const fetcher = Effect.gen(function* () {
        const state = yield* Ref.get(stateRef)
        const offset = state.lastConfirmedId !== undefined ? state.lastConfirmedId + 1 : undefined

        const updates = yield* api
          .getUpdates({
            offset,
            allowed_updates: allowedUpdates,
            timeout: 30, // Long polling
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
          // Filter and add to pending
          const validUpdates = yield* Ref.modify(stateRef, (currentState) => {
            const updatesToProcess: Types.Update[] = []
            let newPending = currentState.pending

            for (const u of updates) {
              if (currentState.lastConfirmedId !== undefined && u.update_id <= currentState.lastConfirmedId)
                continue
              if (HashSet.has(currentState.finished, u.update_id))
                continue
              if (HashSet.has(newPending, u.update_id))
                continue

              newPending = HashSet.add(newPending, u.update_id)
              updatesToProcess.push(u)
            }

            return [updatesToProcess, { ...currentState, pending: newPending }]
          })

          for (const u of validUpdates) {
            yield* Queue.offer(queue, Option.some(u))
          }
        }
      })

      const fetcherLoop = Effect.gen(function* () {
        while (true) {
          const shutdown = yield* Ref.get(isShuttingDown)
          if (shutdown)
            break
          yield* fetcher
        }
      })

      // Worker Stream
      const worker = Stream.fromQueue(queue).pipe(
        Stream.mapEffect((optUpdate) => {
          if (Option.isNone(optUpdate)) {
            return Effect.fail('TERMINATE_WORKER')
          }
          return processUpdate(optUpdate.value)
        }, { concurrency: concurrency ?? 10 }),
        Stream.runDrain,
        Effect.catchAll(e => e === 'TERMINATE_WORKER' ? Effect.void : Effect.die(e)),
      )

      return yield* Effect.acquireRelease(
        Effect.fork(fetcherLoop),
        fetcherFiber => Effect.gen(function* () {
          // Graceful shutdown
          yield* Ref.set(isShuttingDown, true)
          yield* Fiber.interrupt(fetcherFiber)
          yield* Queue.offer(queue, Option.none())

          const finalState = yield* Ref.get(stateRef)
          if (finalState.lastConfirmedId !== undefined) {
            const finalApi = yield* BotApi
            yield* finalApi.getUpdates({
              offset: finalState.lastConfirmedId + 1,
              limit: 1,
              timeout: 0,
            }).pipe(Effect.ignore)
          }
        }),
      ).pipe(
        Effect.flatMap(fetcherFiber =>
          Effect.all([
            Fiber.join(fetcherFiber).pipe(Effect.fork), // Wait for fetcher
            worker,
          ], { concurrency: 'unbounded' }),
        ),
        Effect.andThen(Effect.never),
        Effect.scoped, // Provide the Scope required by acquireRelease
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
