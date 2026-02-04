import type * as Config from 'effect/Config'
import type * as ConfigError from 'effect/ConfigError'
import type * as BotApiError from './BotApiError.ts'
import type {
  MethodParams,
  MethodResults,
  BotApi as Service,
  Types,
} from './internal/botApi.gen.ts'
import * as HttpClient from '@effect/platform/HttpClient'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Function from 'effect/Function'
import * as Layer from 'effect/Layer'
import * as Redacted from 'effect/Redacted'
import * as BotApiTransport from './BotApiTransport.ts'
import * as BotApiUrl from './BotApiUrl.ts'
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

/**
 * Constructs a `BotApi` layer from the given configuration.
 */
export const layerConfig = (options: {
  /**
   * Bot API token from [@BotFather](https://t.me/BotFather).
   */
  readonly token: Config.Config<Redacted.Redacted>

  /**
   * Target Bot API environment:
   *
   * - `prod` — production environment
   * - `test` — [test environment](https://core.telegram.org/bots/features#dedicated-test-environment)
   *
   * @default 'prod'
   */
  readonly environment?: 'prod' | 'test'

  /**
   * A function to transform the underlying `BotApiTransport` before
   * it's used to call Bot API methods.
   *
   * Useful for:
   * - Adding custom middleware (logging, metrics, caching)
   * - Adding custom retry logic or error handling
   * - Integrating with monitoring or debugging tools
   */
  readonly transformTransport?: (transport: BotApiTransport.Service) => BotApiTransport.Service
}): Layer.Layer<BotApi, ConfigError.ConfigError, HttpClient.HttpClient> => {
  const {
    token,
    environment = 'prod',
    transformTransport,
  } = options
  return Layer.provide(
    layer,
    Layer.effect(
      BotApiTransport.BotApiTransport,
      Effect.all([
        HttpClient.HttpClient,
        token.pipe(
          Effect.map(token => (
            environment === 'prod'
              ? BotApiUrl.makeProd(Redacted.value(token))
              : BotApiUrl.makeTest(Redacted.value(token))
          )),
        ),
      ]).pipe(
        Effect.map(([httpClient, botApiUrl]) => BotApiTransport.make({ httpClient, botApiUrl })),
        Effect.map(transformTransport ?? Function.identity),
      ),
    ),
  )
}
