import type { MethodParams, MethodResults } from './internal/botApiMethods.gen.ts'
import type { BotApiShape } from './internal/botApiShape.gen.ts'
import type * as Types from './internal/botApiTypes.gen.ts'
import * as Context from 'effect/Context'
import * as Data from 'effect/Data'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import { BotApiTransport } from './BotApiTransport.ts'
import * as internal from './internal/botApi.ts'

export type { MethodParams, MethodResults, Types }

export class BotApi extends Context.Tag('@grom.js/effect-tg/BotApi')<
  BotApi,
  BotApi.Service
>() {}

export declare namespace BotApi {
  export type Service = BotApiShape
}

/**
 * Error returned from the Bot API server in case of unsuccessful method call.
 */
export class BotApiError extends Data.TaggedError('@grom.js/effect-tg/BotApiError')<{
  code: number
  description: string
  parameters?: Types.ResponseParameters
}> {
  override get message() {
    return `(${this.code}) ${this.description}`
  }
}

export const make: (
  transport: BotApiTransport.Service,
) => BotApiShape = internal.make

export const layer: Layer.Layer<
  BotApi,
  never,
  BotApiTransport
> = Layer.effect(
  BotApi,
  Effect.andThen(BotApiTransport, internal.make),
)
