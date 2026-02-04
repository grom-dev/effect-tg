import type * as HttpClientRequest from '@effect/platform/HttpClientRequest'
import * as HttpClient from '@effect/platform/HttpClient'
import * as HttpClientResponse from '@effect/platform/HttpClientResponse'
import * as Config from 'effect/Config'
import * as ConfigProvider from 'effect/ConfigProvider'
import * as Effect from 'effect/Effect'
import * as Exit from 'effect/Exit'
import * as Layer from 'effect/Layer'
import * as Redacted from 'effect/Redacted'
import { describe, expect, it } from 'vitest'
import { BotApi } from '../src/index.ts'

describe('BotApi.layerConfig', () => {
  describe('layerConfig', () => {
    const mockResponse = (body: unknown) =>
      HttpClientResponse.fromWeb(
        {} as any,
        new Response(JSON.stringify(body)),
      )

    const makeTestClient = (
      handler: (request: HttpClientRequest.HttpClientRequest) => Effect.Effect<HttpClientResponse.HttpClientResponse>,
    ): HttpClient.HttpClient =>
      HttpClient.make(handler)

    it('should use provided token config', async () => {
      let capturedUrl: URL | undefined
      const mockClient = makeTestClient((request) => {
        capturedUrl = new URL(request.url)
        return Effect.succeed(mockResponse({ ok: true, result: {} }))
      })
      const program = Effect.gen(function* () {
        const api = yield* BotApi.BotApi
        yield* api.getMe()
      })
      await program.pipe(
        Effect.provide(BotApi.layerConfig({ token: Config.redacted('BOT_TOKEN') })),
        Effect.provide(Layer.succeed(HttpClient.HttpClient, mockClient)),
        Effect.withConfigProvider(
          ConfigProvider.fromMap(
            new Map([['BOT_TOKEN', 'test-token-123']]),
          ),
        ),
        Effect.runPromise,
      )
      expect(capturedUrl?.href).toBe('https://api.telegram.org/bottest-token-123/getMe')
    })

    it('should fail with ConfigError when token is missing', async () => {
      const mockClient = makeTestClient(() =>
        Effect.succeed(mockResponse({ ok: true, result: {} })),
      )
      const program = Effect.gen(function* () {
        const api = yield* BotApi.BotApi
        yield* api.getMe()
      })
      const exit = await program.pipe(
        Effect.provide(BotApi.layerConfig({ token: Config.redacted('MISSING_TOKEN') })),
        Effect.provide(Layer.succeed(HttpClient.HttpClient, mockClient)),
        Effect.withConfigProvider(ConfigProvider.fromMap(new Map())),
        Effect.exit,
        Effect.runPromise,
      )
      expect(Exit.isFailure(exit)).toBe(true)
    })

    it('should use prod environment by default', async () => {
      let capturedUrl: URL | undefined
      const mockClient = makeTestClient((request) => {
        capturedUrl = new URL(request.url)
        return Effect.succeed(mockResponse({ ok: true, result: {} }))
      })
      const program = Effect.gen(function* () {
        const api = yield* BotApi.BotApi
        yield* api.getMe()
      })
      await program.pipe(
        Effect.provide(BotApi.layerConfig({ token: Config.succeed(Redacted.make('my-token')) })),
        Effect.provide(Layer.succeed(HttpClient.HttpClient, mockClient)),
        Effect.runPromise,
      )
      expect(capturedUrl?.href).toBe('https://api.telegram.org/botmy-token/getMe')
    })

    it('should use test environment when specified', async () => {
      let capturedUrl: URL | undefined
      const mockClient = makeTestClient((request) => {
        capturedUrl = new URL(request.url)
        return Effect.succeed(mockResponse({ ok: true, result: {} }))
      })
      const program = Effect.gen(function* () {
        const api = yield* BotApi.BotApi
        yield* api.getMe()
      })
      await program.pipe(
        Effect.provide(BotApi.layerConfig({
          token: Config.succeed(Redacted.make('my-token')),
          environment: 'test',
        })),
        Effect.provide(Layer.succeed(HttpClient.HttpClient, mockClient)),
        Effect.runPromise,
      )
      expect(capturedUrl?.href).toBe('https://api.telegram.org/botmy-token/test/getMe')
    })

    it('should apply transport transformation', async () => {
      const methodCalls: string[] = []
      const mockClient = makeTestClient(() =>
        Effect.succeed(mockResponse({ ok: true, result: {} })),
      )
      const program = Effect.gen(function* () {
        const api = yield* BotApi.BotApi
        yield* api.getMe()
        yield* api.getUpdates()
      })
      await program.pipe(
        Effect.provide(
          BotApi.layerConfig({
            token: Config.succeed(Redacted.make('my-token')),
            transformTransport: transport => ({
              sendRequest: (method, params) => {
                methodCalls.push(method)
                return transport.sendRequest(method, params)
              },
            }),
          }),
        ),
        Effect.provide(Layer.succeed(HttpClient.HttpClient, mockClient)),
        Effect.runPromise,
      )
      expect(methodCalls).toEqual(['getMe', 'getUpdates'])
    })

    it('should allow modifying responses', async () => {
      const mockClient = makeTestClient(() =>
        Effect.succeed(
          mockResponse({
            ok: true,
            result: { id: 123, is_bot: true, first_name: 'TestBot', username: 'test_bot' },
          }),
        ),
      )
      let interceptedResult: unknown
      const program = Effect.gen(function* () {
        const api = yield* BotApi.BotApi
        return yield* api.getMe()
      })
      await program.pipe(
        Effect.provide(
          BotApi.layerConfig({
            token: Config.succeed(Redacted.make('my-token')),
            transformTransport: transport => ({
              sendRequest: (method, params) =>
                Effect.tap(
                  transport.sendRequest(method, params),
                  (response) => {
                    interceptedResult = response
                    return Effect.void
                  },
                ),
            }),
          }),
        ),
        Effect.provide(Layer.succeed(HttpClient.HttpClient, mockClient)),
        Effect.runPromise,
      )
      expect(interceptedResult).toEqual({
        ok: true,
        result: { id: 123, is_bot: true, first_name: 'TestBot', username: 'test_bot' },
      })
    })

    it('should work with all options combined', async () => {
      let capturedUrl: URL | undefined
      const methodCalls: string[] = []
      const mockClient = makeTestClient((request) => {
        capturedUrl = new URL(request.url)
        return Effect.succeed(mockResponse({ ok: true, result: {} }))
      })
      const program = Effect.gen(function* () {
        const api = yield* BotApi.BotApi
        yield* api.getMe()
      })
      await program.pipe(
        Effect.provide(
          BotApi.layerConfig({
            token: Config.succeed(Redacted.make('explicit-token')),
            environment: 'test',
            transformTransport: transport => ({
              sendRequest: (method, params) => {
                methodCalls.push(method)
                return transport.sendRequest(method, params)
              },
            }),
          }),
        ),
        Effect.provide(Layer.succeed(HttpClient.HttpClient, mockClient)),
        Effect.runPromise,
      )
      expect(capturedUrl?.href).toBe('https://api.telegram.org/botexplicit-token/test/getMe')
      expect(methodCalls).toEqual(['getMe'])
    })
  })
})
