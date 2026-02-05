import type * as BotApi from '../src/BotApi.ts'
import * as HttpClientError from '@effect/platform/HttpClientError'
import * as Duration from 'effect/Duration'
import * as Effect from 'effect/Effect'
import * as Exit from 'effect/Exit'
import * as Fiber from 'effect/Fiber'
import * as Layer from 'effect/Layer'
import * as TestClock from 'effect/TestClock'
import * as TestContext from 'effect/TestContext'
import { describe, expect, it } from 'vitest'
import * as Bot from '../src/Bot.ts'
import { BotApi as BotApiService } from '../src/BotApi.ts'
import * as BotApiError from '../src/BotApiError.ts'
import * as Dialog from '../src/Dialog.ts'
import * as Runner from '../src/Runner.ts'

describe('Runner', () => {
  describe('makeSimple', () => {
    const makeMockApi = (
      getUpdates: BotApi.Service['getUpdates'],
    ): BotApi.Service => ({
      getUpdates,
    }) as BotApi.Service

    const dummyBot: Bot.Bot = Effect.void

    describe('unrecoverable errors (issue #11)', () => {
      it('should fail immediately on 409 Conflict (webhook is set up)', async () => {
        const callCount = { value: 0 }
        const mockApi = makeMockApi(() => {
          callCount.value++
          return Effect.fail(
            new BotApiError.MethodFailed({
              response: {
                ok: false,
                error_code: 409,
                description: 'Conflict: can\'t use getUpdates method while webhook is active',
              },
              possibleReason: 'Unknown',
            }),
          )
        })

        const runner = Runner.makeSimple()
        const exit = await runner.run(dummyBot).pipe(
          Effect.provide(Layer.succeed(BotApiService, mockApi)),
          Effect.exit,
          Effect.runPromise,
        )

        expect(Exit.isFailure(exit)).toBe(true)
        expect(callCount.value).toBe(1) // Should only be called once, not retried
        if (Exit.isFailure(exit)) {
          const error = exit.cause
          expect(error._tag).toBe('Fail')
          if (error._tag === 'Fail') {
            expect(error.error._tag).toBe('MethodFailed')
          }
        }
      })

      it('should fail immediately on 400 Bad Request', async () => {
        const callCount = { value: 0 }
        const mockApi = makeMockApi(() => {
          callCount.value++
          return Effect.fail(
            new BotApiError.MethodFailed({
              response: {
                ok: false,
                error_code: 400,
                description: 'Bad Request: invalid offset',
              },
              possibleReason: 'Unknown',
            }),
          )
        })

        const runner = Runner.makeSimple()
        const exit = await runner.run(dummyBot).pipe(
          Effect.provide(Layer.succeed(BotApiService, mockApi)),
          Effect.exit,
          Effect.runPromise,
        )

        expect(Exit.isFailure(exit)).toBe(true)
        expect(callCount.value).toBe(1)
      })

      it('should fail immediately on 401 Unauthorized', async () => {
        const callCount = { value: 0 }
        const mockApi = makeMockApi(() => {
          callCount.value++
          return Effect.fail(
            new BotApiError.MethodFailed({
              response: {
                ok: false,
                error_code: 401,
                description: 'Unauthorized',
              },
              possibleReason: 'Unknown',
            }),
          )
        })

        const runner = Runner.makeSimple()
        const exit = await runner.run(dummyBot).pipe(
          Effect.provide(Layer.succeed(BotApiService, mockApi)),
          Effect.exit,
          Effect.runPromise,
        )

        expect(Exit.isFailure(exit)).toBe(true)
        expect(callCount.value).toBe(1)
      })

      it('should fail immediately on 403 Forbidden', async () => {
        const callCount = { value: 0 }
        const mockApi = makeMockApi(() => {
          callCount.value++
          return Effect.fail(
            new BotApiError.MethodFailed({
              response: {
                ok: false,
                error_code: 403,
                description: 'Forbidden: bot was blocked by the user',
              },
              possibleReason: 'BotBlockedByUser',
            }),
          )
        })

        const runner = Runner.makeSimple()
        const exit = await runner.run(dummyBot).pipe(
          Effect.provide(Layer.succeed(BotApiService, mockApi)),
          Effect.exit,
          Effect.runPromise,
        )

        expect(Exit.isFailure(exit)).toBe(true)
        expect(callCount.value).toBe(1)
      })

      it('should fail immediately on 404 Not Found', async () => {
        const callCount = { value: 0 }
        const mockApi = makeMockApi(() => {
          callCount.value++
          return Effect.fail(
            new BotApiError.MethodFailed({
              response: {
                ok: false,
                error_code: 404,
                description: 'Not Found',
              },
              possibleReason: 'Unknown',
            }),
          )
        })

        const runner = Runner.makeSimple()
        const exit = await runner.run(dummyBot).pipe(
          Effect.provide(Layer.succeed(BotApiService, mockApi)),
          Effect.exit,
          Effect.runPromise,
        )

        expect(Exit.isFailure(exit)).toBe(true)
        expect(callCount.value).toBe(1)
      })

      it('should fail immediately on GroupUpgraded error', async () => {
        const callCount = { value: 0 }
        const mockApi = makeMockApi(() => {
          callCount.value++
          return Effect.fail(
            new BotApiError.GroupUpgraded({
              response: {
                ok: false,
                error_code: 400,
                description: 'Bad Request: group chat was upgraded to a supergroup chat',
                parameters: { migrate_to_chat_id: -1001234567890 },
              },
              supergroup: Dialog.supergroup(1234567890),
            }),
          )
        })

        const runner = Runner.makeSimple()
        const exit = await runner.run(dummyBot).pipe(
          Effect.provide(Layer.succeed(BotApiService, mockApi)),
          Effect.exit,
          Effect.runPromise,
        )

        expect(Exit.isFailure(exit)).toBe(true)
        expect(callCount.value).toBe(1)
      })

      it('should fail immediately on TransportError with non-Transport reason', async () => {
        const callCount = { value: 0 }
        const mockApi = makeMockApi(() => {
          callCount.value++
          return Effect.fail(
            new BotApiError.TransportError({
              cause: new HttpClientError.ResponseError({
                request: {} as any,
                response: {} as any,
                reason: 'StatusCode',
              }),
            }),
          )
        })

        const runner = Runner.makeSimple()
        const exit = await runner.run(dummyBot).pipe(
          Effect.provide(Layer.succeed(BotApiService, mockApi)),
          Effect.exit,
          Effect.runPromise,
        )

        expect(Exit.isFailure(exit)).toBe(true)
        expect(callCount.value).toBe(1)
      })
    })

    describe('recoverable errors', () => {
      it('should retry on InternalServerError (not fail immediately)', async () => {
        // This test verifies that InternalServerError is retried, not failed immediately
        // Contrast with unrecoverable errors which fail after exactly 1 call
        const callCount = { value: 0 }

        // Important: The mock must return an Effect that increments the counter
        // when EXECUTED, not when the mock function is called.
        // Effect.retry re-runs the same Effect instance, so we need the counter
        // increment to be part of the effect execution.
        const mockApi = makeMockApi(() =>
          Effect.gen(function* () {
            callCount.value++
            return yield* Effect.fail(
              new BotApiError.InternalServerError({
                response: {
                  ok: false,
                  error_code: 500,
                  description: 'Internal Server Error',
                },
              }),
            )
          }),
        )

        const runner = Runner.makeSimple()

        // Use timeout to limit how long we wait for retries
        const program = runner.run(dummyBot).pipe(
          Effect.timeout(Duration.millis(350)),
          Effect.ignore,
          Effect.provide(Layer.succeed(BotApiService, mockApi)),
        )

        await Effect.runPromise(program)

        // Key assertion: more than 1 call means retries are happening
        // (unrecoverable errors would only have 1 call)
        expect(callCount.value).toBeGreaterThan(1)
      })

      it('should retry on TransportError with Transport reason (not fail immediately)', async () => {
        const callCount = { value: 0 }

        const mockApi = makeMockApi(() =>
          Effect.gen(function* () {
            callCount.value++
            return yield* Effect.fail(
              new BotApiError.TransportError({
                cause: new HttpClientError.RequestError({
                  request: {} as any,
                  reason: 'Transport',
                  cause: new Error('Network error'),
                }),
              }),
            )
          }),
        )

        const runner = Runner.makeSimple()

        const program = runner.run(dummyBot).pipe(
          Effect.timeout(Duration.millis(350)),
          Effect.ignore,
          Effect.provide(Layer.succeed(BotApiService, mockApi)),
        )

        await Effect.runPromise(program)

        // More than 1 call means retries are happening
        expect(callCount.value).toBeGreaterThan(1)
      })
    })

    describe('RateLimited handling', () => {
      it('should handle RateLimited by waiting and returning empty updates', async () => {
        const callCount = { value: 0 }
        const mockApi = makeMockApi(() => {
          callCount.value++
          if (callCount.value === 1) {
            return Effect.fail(
              new BotApiError.RateLimited({
                response: {
                  ok: false,
                  error_code: 429,
                  description: 'Too Many Requests: retry after 1',
                  parameters: { retry_after: 1 },
                },
                retryAfter: Duration.seconds(1),
              }),
            )
          }
          return Effect.succeed([])
        })

        const runner = Runner.makeSimple()

        const program = Effect.gen(function* () {
          const fiber = yield* Effect.fork(runner.run(dummyBot))
          // Advance time past the retry_after period
          yield* TestClock.adjust(Duration.seconds(2))
          yield* Fiber.interrupt(fiber)
        }).pipe(
          Effect.provide(Layer.succeed(BotApiService, mockApi)),
          Effect.provide(TestContext.TestContext),
        )

        await Effect.runPromise(program)

        // Should continue after rate limit
        expect(callCount.value).toBeGreaterThanOrEqual(2)
      })
    })

    describe('normal operation', () => {
      it('should process updates and increment offset', async () => {
        const receivedUpdates: number[] = []
        const callCount = { value: 0 }
        const mockApi = makeMockApi((params) => {
          callCount.value++
          const offset = (params as any)?.offset
          if (callCount.value === 1) {
            expect(offset).toBeUndefined()
            return Effect.succeed([{ update_id: 100 }])
          }
          if (callCount.value === 2) {
            expect(offset).toBe(101) // 100 + 1
            return Effect.succeed([{ update_id: 101 }])
          }
          if (callCount.value === 3) {
            expect(offset).toBe(102) // 101 + 1
            return Effect.succeed([])
          }
          return Effect.succeed([])
        })

        const testBot: Bot.Bot = Effect.gen(function* () {
          const update = yield* Bot.Update
          receivedUpdates.push(update.update_id)
        })

        const runner = Runner.makeSimple()

        const program = Effect.gen(function* () {
          const fiber = yield* Effect.fork(runner.run(testBot))
          // Give time for updates to be processed
          yield* Effect.sleep(Duration.millis(50))
          yield* Fiber.interrupt(fiber)
        }).pipe(
          Effect.provide(Layer.succeed(BotApiService, mockApi)),
        )

        await Effect.runPromise(program)

        expect(receivedUpdates).toEqual([100, 101])
        expect(callCount.value).toBeGreaterThanOrEqual(3)
      })

      it('should catch and log bot handler errors without stopping', async () => {
        const callCount = { value: 0 }
        const mockApi = makeMockApi(() => {
          callCount.value++
          if (callCount.value <= 2) {
            return Effect.succeed([{ update_id: callCount.value }])
          }
          return Effect.succeed([])
        })

        // Bot that throws an error
        const testBot: Bot.Bot<Error> = Effect.gen(function* () {
          yield* Bot.Update
          yield* Effect.fail(new Error('Bot handler error'))
        })

        const runner = Runner.makeSimple()

        const program = Effect.gen(function* () {
          const fiber = yield* Effect.fork(runner.run(testBot))
          yield* Effect.sleep(Duration.millis(50))
          yield* Fiber.interrupt(fiber)
        }).pipe(
          Effect.provide(Layer.succeed(BotApiService, mockApi)),
        )

        await Effect.runPromise(program)

        // Runner should continue despite bot errors
        expect(callCount.value).toBeGreaterThanOrEqual(2)
      })
    })

    describe('allowedUpdates option', () => {
      it('should pass allowed_updates to getUpdates', async () => {
        let capturedParams: any
        const mockApi = makeMockApi((params) => {
          capturedParams = params
          return Effect.succeed([])
        })

        const runner = Runner.makeSimple({
          allowedUpdates: ['message', 'callback_query'],
        })

        const program = Effect.gen(function* () {
          const fiber = yield* Effect.fork(runner.run(dummyBot))
          yield* Effect.sleep(Duration.millis(50))
          yield* Fiber.interrupt(fiber)
        }).pipe(
          Effect.provide(Layer.succeed(BotApiService, mockApi)),
        )

        await Effect.runPromise(program)

        expect(capturedParams?.allowed_updates).toEqual(['message', 'callback_query'])
      })
    })
  })
})
