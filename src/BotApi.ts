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

/** @internal */
export type MethodArgs<M extends keyof MethodParams> = void extends MethodParams[M]
  ? [params?: MethodParams[M]]
  : [params: MethodParams[M]]

export interface BotApiMethod<
  M extends keyof MethodParams,
  E = BotApiError.BotApiError | BotApiTransport.BotApiTransportError,
  R = never,
> {
  (...args: MethodArgs<M>): Effect.Effect<MethodResults[M], E, R>
}

export const make: (
  transport: BotApiTransport.BotApiTransport.Service,
) => Service = internal.make

export const layer: Layer.Layer<
  BotApi,
  never,
  BotApiTransport.BotApiTransport
> = Layer.effect(
  BotApi,
  Effect.andThen(BotApiTransport.BotApiTransport, internal.make),
)

export const callMethod: <M extends keyof MethodParams>(
  method: M,
  ...args: MethodArgs<M>
) => Effect.Effect<
  MethodResults[M],
  BotApiError.BotApiError | BotApiTransport.BotApiTransportError,
  BotApi
> = (
  method: string,
  params: unknown = undefined,
) => BotApi.pipe(
  Effect.flatMap((api: any) => api[method](params)),
) as any
