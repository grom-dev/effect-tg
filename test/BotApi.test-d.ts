import type { HttpClient } from '@effect/platform'
import type { ConfigError, Effect, Layer } from 'effect'
import type { BotApiError } from '../src/index.ts'
import { describe, expectTypeOf, it } from 'vitest'
import { BotApi } from '../src/index.ts'

describe('BotApi', () => {
  describe('callMethod', () => {
    it('should not typecheck if no params passed for methods with required params', () => {
      // @ts-expect-error sendMessage requires parameters
      BotApi.callMethod('sendMessage')
    })
    it('should typecheck if no params passed for methods with all params optional', () => {
      BotApi.callMethod('getMe')
      BotApi.callMethod('getAvailableGifts')
      BotApi.callMethod('getUpdates')
    })
    it('should infer result types correctly', () => {
      expectTypeOf(BotApi.callMethod('getUpdates'))
        .toEqualTypeOf<Effect.Effect<Array<BotApi.Types.Update>, BotApiError.BotApiError, BotApi.BotApi>>()
      expectTypeOf(BotApi.callMethod('sendMessage', { chat_id: 123, text: 'hi' }))
        .toEqualTypeOf<Effect.Effect<BotApi.Types.Message, BotApiError.BotApiError, BotApi.BotApi>>()
    })
  })

  describe('layerConfig', () => {
    it('should return Layer with correct types', () => {
      expectTypeOf(BotApi.layerConfig()).toEqualTypeOf<
        Layer.Layer<BotApi.BotApi, ConfigError.ConfigError, HttpClient.HttpClient>
      >()
    })
    it('should accept empty options', () => {
      BotApi.layerConfig()
      BotApi.layerConfig({})
    })
    it('should accept all options', () => {
      // Just checking it compiles with all options
      BotApi.layerConfig({
        token: undefined,
        environment: 'prod',
        transformTransport: t => t,
      })
    })
  })
})
