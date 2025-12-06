import type * as Effect from 'effect/Effect'
import type * as Types from './internal/botApiTypes.gen.ts'
import * as Context from 'effect/Context'
import * as Data from 'effect/Data'
import * as Layer from 'effect/Layer'
import * as internal from './internal/botApiTransport.ts'

export class BotApiTransport extends Context.Tag('@grom.js/effect-tg/BotApiTransport')<
  BotApiTransport,
  BotApiTransport.Service
>() {
}

export declare namespace BotApiTransport {
  export interface Service {
    sendRequest: (
      method: string,
      params: unknown,
    ) => Effect.Effect<BotApiResponse, BotApiTransportError>
  }
}

/**
 * @see https://core.telegram.org/bots/api#making-requests
 */
export type BotApiResponse
  = {
    ok: true
    result: unknown
    description?: string
  } | {
    ok: false
    error_code: number
    description: string
    parameters?: Types.ResponseParameters
  }

/**
 * Error caused by the transport when accessing Bot API.
 */
export class BotApiTransportError extends Data.TaggedError('@grom.js/effect-tg/BotApiTransportError')<{
  cause: unknown
}> {}

export const layerWith = (options: {
  makeUrl: (method: string) => URL
}) => Layer.effect(BotApiTransport, internal.makeWith(options))

export const layerProd = (token: string) => (
  layerWith({
    makeUrl: method => new URL(`https://api.telegram.org/bot${token}/${method}`),
  })
)

export const layerTest = (token: string) => (
  layerWith({
    makeUrl: method => new URL(`https://api.telegram.org/bot${token}/test/${method}`),
  })
)
