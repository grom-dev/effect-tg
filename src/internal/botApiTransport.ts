import type * as HttpClient from '@effect/platform/HttpClient'
import type { BotApiResponse, BotApiTransport } from '../BotApiTransport.ts'
import type * as BotApiUrl from '../BotApiUrl.ts'
import * as HttpBody from '@effect/platform/HttpBody'
import * as Effect from 'effect/Effect'
import { BotApiTransportError } from '../BotApiTransport.ts'

export const make = (
  httpClient: HttpClient.HttpClient,
  botApiUrl: BotApiUrl.BotApiUrl.Service,
): BotApiTransport.Service => ({
  sendRequest: (method, params) => (
    Effect.gen(function* () {
      const url = botApiUrl.toMethod(method)
      // TODO: Serialize necessary parameters and handle file uploads.
      const body = yield* HttpBody.json(params)
      const response = yield* httpClient.post(url, { body })
      const responseJson = yield* response.json
      return responseJson as BotApiResponse
    })
      .pipe(
        Effect.catchAll(error => (
          Effect.fail(new BotApiTransportError({ cause: error }))
        )),
      )
  ),
})
