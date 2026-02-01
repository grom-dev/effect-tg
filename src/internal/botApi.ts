import type * as BotApi from '../BotApi.ts'
import type * as BotApiTransport from '../BotApiTransport.ts'
import * as Effect from 'effect/Effect'
import * as BotApiError from '../BotApiError.ts'

export const make = ({
  transport,
}: {
  transport: BotApiTransport.Service
}): BotApi.Service => (
  new Proxy({}, {
    get: (_target, prop) => {
      if (typeof prop !== 'string') {
        return
      }
      const method = prop
      return Effect.fnUntraced(
        function* (params: void | Record<string, unknown> = {}) {
          const response = yield* transport.sendRequest(method, params)
          if (response.ok) {
            return response.result
          }
          return yield* Effect.fail(BotApiError.fromResponse(response))
        },
      )
    },
  }) as BotApi.Service
)
