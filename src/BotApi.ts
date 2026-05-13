import type * as Config from 'effect/Config'
import type * as BotApiError from './BotApiError.ts'
import type {
  MethodParams,
  MethodResults,
  BotApi as Service,
  Types,
} from './internal/botApi.gen.ts'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Function from 'effect/Function'
import * as Layer from 'effect/Layer'
import * as Redacted from 'effect/Redacted'
import * as HttpClient from 'effect/unstable/http/HttpClient'
import * as BotApiTransport from './BotApiTransport.ts'
import * as BotApiUrl from './BotApiUrl.ts'
import * as internal from './internal/botApi.ts'

export type { MethodParams, MethodResults, Types }

export interface BotApi extends Readonly<Service> {}

export const BotApi: Context.Service<BotApi, BotApi> = Context.Service<BotApi>('@grom.js/effect-tg/BotApi')

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
) => BotApi.use(api => (api as any)[method](params)) as any

export const make: (args: {
  transport: BotApiTransport.BotApiTransport
}) => BotApi = internal.make

export const layer: Layer.Layer<
  BotApi,
  never,
  BotApiTransport.BotApiTransport
> = Layer.effect(
  BotApi,
  BotApiTransport.BotApiTransport.useSync(transport => internal.make({ transport })),
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
  readonly transformTransport?: (transport: BotApiTransport.BotApiTransport) => BotApiTransport.BotApiTransport
}): Layer.Layer<BotApi, Config.ConfigError, HttpClient.HttpClient> => {
  const {
    token,
    environment = 'prod',
    transformTransport,
  } = options
  return Layer.provide(
    layer,
    Layer.effect(
      BotApiTransport.BotApiTransport,
      Effect.gen(function* () {
        const httpClient = yield* HttpClient.HttpClient
        const tokenValue = yield* token
        const botApiUrl = environment === 'prod'
          ? BotApiUrl.makeProd(Redacted.value(tokenValue))
          : BotApiUrl.makeTest(Redacted.value(tokenValue))
        const transport = BotApiTransport.make({ httpClient, botApiUrl })
        return (transformTransport ?? Function.identity)(transport)
      }),
    ),
  )
}
