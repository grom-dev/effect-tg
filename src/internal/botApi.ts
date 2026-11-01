import type * as BotApi from '../BotApi.ts'
import type * as BotApiTransport from '../BotApiTransport.ts'
import * as Effect from 'effect/Effect'
import * as BotApiError from '../BotApiError.ts'

export const make = ({ transport }: {
  transport: BotApiTransport.BotApiTransport
}): BotApi.BotApi => (
  new Proxy({}, {
    get: (_target, prop) => {
      if (typeof prop !== 'string') {
        return
      }
      const method = prop
      // TODO: Shouldn't we cache effects not to create them on each call?
      return Effect.fnUntraced(
        function* (params: void | Record<string, unknown> = {}) {
          const response = yield* transport.sendRequest(method, params)
          if (response.ok) {
            return response.result
          }
          return yield* BotApiError.fromResponse(response)
        },
      )
    },
  }) as BotApi.BotApi
)
