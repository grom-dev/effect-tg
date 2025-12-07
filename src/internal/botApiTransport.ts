import type * as HttpClient from '@effect/platform/HttpClient'
import type * as BotApiUrl from '../BotApiUrl.ts'
import * as HttpBody from '@effect/platform/HttpBody'
import * as Effect from 'effect/Effect'
import * as BotApiTransport from '../BotApiTransport.ts'

export const make = (
  httpClient: HttpClient.HttpClient,
  botApiUrl: BotApiUrl.BotApiUrl.Service,
): BotApiTransport.BotApiTransport.Service => ({
  sendRequest: (method, params) => (
    Effect.gen(function* () {
      // TODO: Serialize necessary parameters and handle file uploads.
      const body = yield* HttpBody.json(params)
      const response = yield* httpClient.post(botApiUrl.toMethod(method), { body })
      const responseJson = yield* response.json
      // We trust Bot API and don't want to introduce overhead with validation.
      return responseJson as BotApiTransport.BotApiResponse
    })
      .pipe(
        Effect.catchAll(cause => (
          Effect.fail(new BotApiTransport.BotApiTransportError({ cause }))
        )),
      )
  ),
})
