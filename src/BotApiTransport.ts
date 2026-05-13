import type * as BotApi from './BotApi.ts'
import type * as BotApiError from './BotApiError.ts'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as HttpClient from 'effect/unstable/http/HttpClient'
import * as BotApiUrl from './BotApiUrl.ts'
import * as internal from './internal/botApiTransport.ts'

export interface BotApiTransport {
  readonly sendRequest: (
    method: string,
    params: unknown,
  ) => Effect.Effect<BotApiResponse, BotApiError.TransportError>
}

export const BotApiTransport: Context.Service<BotApiTransport, BotApiTransport> = Context.Service<BotApiTransport>('@grom.js/effect-tg/BotApiTransport')

/**
 * @see https://core.telegram.org/bots/api#making-requests
 */
export type BotApiResponse =
  | {
    ok: true
    result: unknown
    description?: string
  } | {
    ok: false
    error_code: number
    description: string
    parameters?: BotApi.Types.ResponseParameters
  }

export const make: (options: {
  httpClient: HttpClient.HttpClient
  botApiUrl: BotApiUrl.BotApiUrl
}) => BotApiTransport = internal.make

export const layer: Layer.Layer<
  BotApiTransport,
  never,
  HttpClient.HttpClient | BotApiUrl.BotApiUrl
> = Layer.effect(
  BotApiTransport,
  Effect.gen(function* () {
    const httpClient = yield* HttpClient.HttpClient
    const botApiUrl = yield* BotApiUrl.BotApiUrl
    return internal.make({ httpClient, botApiUrl })
  }),
)
