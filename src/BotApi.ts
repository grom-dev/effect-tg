import type * as ConfigError from 'effect/ConfigError'
import type * as BotApiError from './BotApiError.ts'
import type {
  MethodParams,
  MethodResults,
  BotApi as Service,
  Types,
} from './internal/botApi.gen.ts'
import * as HttpClient from '@effect/platform/HttpClient'
import * as Config from 'effect/Config'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
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
 * Options for configuring `BotApi` via {@link layerConfig}.
 */
export interface LayerConfigOptions {
  /**
   * Bot token configuration.
   *
   * @default Config.redacted('TELEGRAM_BOT_TOKEN')
   */
  readonly token?: Config.Config<Redacted.Redacted>

  /**
   * The environment to use for constructing Bot API URLs.
   *
   * - `'prod'` — production environment (default).
   * - `'test'` — [test environment](https://core.telegram.org/bots/features#dedicated-test-environment).
   * - Custom `BotApiUrl.Service` — for local Bot API server or other custom setups.
   *
   * @default 'prod'
   */
  readonly environment?: 'prod' | 'test' | BotApiUrl.Service

  /**
   * Transforms the `BotApiTransport.Service` before it's used by `BotApi`.
   *
   * Useful for adding logging, retries, or other middleware.
   *
   * @example
   * ```ts
   * BotApi.layerConfig({
   *   transformTransport: transport => ({
   *     sendRequest: (method, params) =>
   *       Effect.tap(
   *         transport.sendRequest(method, params),
   *         () => Effect.logDebug(`Called ${method}`),
   *       ),
   *   }),
   * })
   * ```
   */
  readonly transformTransport?: (
    transport: BotApiTransport.Service,
  ) => BotApiTransport.Service
}

/**
 * Creates a `BotApi` layer from configuration.
 *
 * This is a convenience function for quickly constructing a `BotApi` layer
 * with common configuration options. For more control, use the individual
 * layers: {@link layer}, {@link BotApiTransport.layer}, and {@link BotApiUrl}.
 *
 * @example
 * ```ts
 * import { FetchHttpClient } from '@effect/platform'
 * import { BotApi } from '@grom.js/effect-tg'
 * import { Effect, Layer } from 'effect'
 *
 * // Basic usage with token from TELEGRAM_BOT_TOKEN env var
 * const BotApiLive = BotApi.layerConfig().pipe(
 *   Layer.provide(FetchHttpClient.layer),
 * )
 *
 * // Custom token and test environment
 * const BotApiTest = BotApi.layerConfig({
 *   token: Config.redacted('MY_TEST_BOT_TOKEN'),
 *   environment: 'test',
 * }).pipe(Layer.provide(FetchHttpClient.layer))
 * ```
 */
export const layerConfig: (
  options?: LayerConfigOptions,
) => Layer.Layer<BotApi, ConfigError.ConfigError, HttpClient.HttpClient> = (
  options = {},
) => {
  const {
    token = Config.redacted('TELEGRAM_BOT_TOKEN'),
    environment = 'prod',
    transformTransport,
  } = options

  return Layer.unwrapEffect(
    Effect.gen(function* () {
      const rawToken = yield* token
      const tokenString = Redacted.value(rawToken)

      const botApiUrl: BotApiUrl.Service =
        typeof environment === 'string'
          ? environment === 'prod'
            ? BotApiUrl.makeProd(tokenString)
            : BotApiUrl.makeTest(tokenString)
          : environment

      const BotApiUrlLayer = Layer.succeed(BotApiUrl.BotApiUrl, botApiUrl)

      const TransportLayer = transformTransport
        ? Layer.effect(
            BotApiTransport.BotApiTransport,
            Effect.gen(function* () {
              const httpClient = yield* HttpClient.HttpClient
              const baseTransport = BotApiTransport.make({ httpClient, botApiUrl })
              return transformTransport(baseTransport)
            }),
          )
        : BotApiTransport.layer.pipe(Layer.provide(BotApiUrlLayer))

      return layer.pipe(
        Layer.provide(TransportLayer),
        Layer.provide(BotApiUrlLayer),
      )
    }),
  )
}
