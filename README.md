# effect-tg

[![Effectful](https://img.shields.io/badge/Effectful-%23fff?style=flat&logo=effect&logoColor=%23fff&logoSize=auto&color=%23000)](https://effect.website/)
[![npm](https://img.shields.io/npm/v/%40grom.js%2Feffect-tg?style=flat&logo=npm&logoColor=%23BB443E&logoSize=auto&label=Latest&labelColor=%23fff&color=%23BB443E)](https://www.npmjs.com/package/@grom.js/effect-tg)
[![codecov](https://img.shields.io/codecov/c/github/grom-dev/effect-tg?style=flat&logo=codecov&logoColor=%23fff&logoSize=auto&label=Coverage&labelColor=%23f07&color=%23fff)](https://codecov.io/gh/grom-dev/effect-tg)

Effectful library for crafting Telegram bots.

## Features

- Modular design to build with [Effect](https://effect.website).
- Complete type definitions for [Bot API](https://core.telegram.org/bots/api) methods and types.

## Installation

```sh
# Install the library
npm install @grom.js/effect-tg

# Install Effect dependencies
npm install effect @effect/platform
```

## Working with Bot API

### Calling methods

`BotApi` service provides access to Telegram's Bot API.
Each method on `BotApi` corresponds to the Bot API method with typed parameters and results.
Methods return an `Effect` that succeeds with the method result or fails with `BotApiError` (see ["Error handling"](#error-handling)).

**Example:** Calling Bot API methods using `BotApi`.

```ts
import { BotApi } from '@grom.js/effect-tg'
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  const api = yield* BotApi.BotApi
  const me = yield* api.getMe()
  yield* api.sendMessage({
    chat_id: 123456789,
    text: `Hello from ${me.username}!`,
  })
})
```

Alternatively, you can use `BotApi.callMethod` function to call any method by name.

**Example:** Calling Bot API methods using `BotApi.callMethod`.

```ts
import { BotApi } from '@grom.js/effect-tg'
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  const me = yield* BotApi.callMethod('getMe')
  yield* BotApi.callMethod('sendMessage', {
    chat_id: 123456789,
    text: `Hello from ${me.username}!`,
  })
})
```

### Configuration

`BotApi` has a layered architecture:

```
┌• BotApi — typed interface that delegates calls to `BotApiTransport`.
└─┬• BotApiTransport — serializes parameters, sends HTTP requests, parses responses.
  ├──• BotApiUrl — constructs endpoint URLs to methods and files.
  └──• HttpClient — performs HTTP requests.
```

This design enables:

- **Extensibility**: Extend `BotApiTransport` to implement logging, retrying, etc.
- **Testability**: Mock implementation of `BotApiTransport` or `HttpClient` to test your bot.
- **Portability:** Provide different `BotApiUrl` to run a bot on test environment or with local Bot API server.

**Example:** Constructing `BotApi` layer.

```ts
import { FetchHttpClient } from '@effect/platform'
import { BotApi, BotApiTransport, BotApiUrl } from '@grom.js/effect-tg'
import { Config, Effect, Layer } from 'effect'

// Use a shortcut to construct BotApi
const BotApiLive = Layer.provide(
  BotApi.layerConfig({ token: Config.redacted('BOT_TOKEN') }),
  FetchHttpClient.layer
)

// Or provide all layers manually
const BotApiLive = BotApi.layer.pipe(
  Layer.provide(BotApiTransport.layer),
  Layer.provide(
    Layer.effect(
      BotApiUrl.BotApiUrl,
      Effect.map(Config.string('BOT_API_TOKEN'), BotApiUrl.makeProd)
    ),
  ),
  Layer.provide(FetchHttpClient.layer),
)
```

### Error handling

Failed `BotApi` method calls result in `BotApiError`, which is a union of tagged errors with additional information:

- `TransportError` — HTTP or network failure. `cause` property contains the original error from `HttpClient`.
- `RateLimited` — bot has exceeded flood limit. `retryAfter` property contains the duration to wait before retry.
- `GroupUpgraded` — group has been migrated to supergroup. `supergroup` property contains an object with the new ID.
- `MethodFailed` — response was unsuccessful, but the exact reason could not be determined. `possibleReason` property contains common failure reasons as string literals, determined by error code and description, which are subject to change.
- `InternalServerError` — Bot API server failed with 5xx error code.

All errors except `TransportError` also have `response` property that contains the original response from Bot API.

**Example:** Handling Bot API failures.

```ts
import { BotApi } from '@grom.js/effect-tg'
import { Duration, Effect, Match } from 'effect'

const program = BotApi.callMethod('doSomething').pipe(
  Effect.matchEffect({
    onSuccess: result => Effect.logInfo('Got result:', result),
    onFailure: e => Match.value(e).pipe(
      Match.tagsExhaustive({
        TransportError: ({ message }) =>
          Effect.logError(`Probably network issue: ${message}`),
        RateLimited: ({ retryAfter }) =>
          Effect.logError(`Try again in ${Duration.format(retryAfter)}`),
        GroupUpgraded: ({ supergroup }) =>
          Effect.logError(`Group now has a new ID: ${supergroup.id}`),
        MethodFailed: ({ possibleReason, response }) =>
          Match.value(possibleReason).pipe(
            Match.when('BotBlockedByUser', () =>
              Effect.logError('I was blocked...')),
            Match.orElse(() =>
              Effect.logError(`Unsuccessful response: ${response.description}`)),
          ),
        InternalServerError: () =>
          Effect.logError('Not much we can do about it.'),
      }),
    ),
  }),
)
```

### Types

`BotApi` module exports type definitions for all Bot API types, method parameters and results.

**Example:** Creating custom types from Bot API types.

```ts
import { BotApi, BotApiError } from '@grom.js/effect-tg'
import { Effect } from 'effect'

// Union of all possible updates
type UpdateType = Exclude<keyof BotApi.Types.Update, 'update_id'>

// Function to get gifts of multiple chats
type GiftsCollector = (
  chatIds: Array<BotApi.MethodParams['getChatGifts']['chat_id']>,
  params: Omit<BotApi.MethodParams['getChatGifts'], 'chat_id'>,
) => Effect.Effect<
  Array<BotApi.MethodResults['getChatGifts']>,
  BotApiError.BotApiError,
  BotApi.BotApi
>
```
