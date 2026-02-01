import type * as BotApi from './BotApi.ts'
import type * as BotApiError from './BotApiError.ts'
import * as HttpClient from '@effect/platform/HttpClient'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as BotApiUrl from './BotApiUrl.ts'
import * as internal from './internal/botApiTransport.ts'

export class BotApiTransport extends Context.Tag('@grom.js/effect-tg/BotApiTransport')<
  BotApiTransport,
  Service
>() {}

export interface Service {
  sendRequest: (
    method: string,
    params: unknown,
  ) => Effect.Effect<BotApiResponse, BotApiError.TransportError>
}

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
  botApiUrl: BotApiUrl.Service
}) => Service = internal.make

export const layer: Layer.Layer<
  BotApiTransport,
  never,
  HttpClient.HttpClient | BotApiUrl.BotApiUrl
> = Layer.effect(
  BotApiTransport,
  Effect.all([HttpClient.HttpClient, BotApiUrl.BotApiUrl]).pipe(
    Effect.andThen(([httpClient, botApiUrl]) => (
      internal.make({ httpClient, botApiUrl })),
    ),
  ),
)
