import type * as BotApiError from './BotApiError.ts'
import type {
  MethodParams,
  MethodResults,
  BotApi as Service,
  Types,
} from './internal/botApi.gen.ts'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as BotApiTransport from './BotApiTransport.ts'
import * as internal from './internal/botApi.ts'

export type { MethodParams, MethodResults, Service, Types }

export class BotApi extends Context.Tag('@grom.js/effect-tg/BotApi')<
  BotApi,
  Service
>() {}

export interface BotApiMethod<TMethod extends keyof MethodParams> {
  (...args: MethodArgs<TMethod>): Effect.Effect<
    MethodResults[TMethod],
    BotApiError.BotApiError,
    never
  >
}

export const callMethod: <TMethod extends keyof MethodParams>(
  method: TMethod,
  ...args: MethodArgs<TMethod>
) => Effect.Effect<
  MethodResults[TMethod],
  BotApiError.BotApiError,
  BotApi
> = (
  method: string,
  params: unknown = undefined,
) => BotApi.pipe(
  Effect.flatMap(api => (api as any)[method](params)),
) as any

export const make: (args: {
  transport: BotApiTransport.Service
}) => Service = internal.make

export const layer: Layer.Layer<
  BotApi,
  never,
  BotApiTransport.BotApiTransport
> = Layer.effect(
  BotApi,
  Effect.andThen(
    BotApiTransport.BotApiTransport,
    transport => internal.make({ transport }),
  ),
)

type MethodArgs<TMethod extends keyof MethodParams> =
  void extends MethodParams[TMethod]
    ? [params?: MethodParams[TMethod]]
    : [params: MethodParams[TMethod]]
