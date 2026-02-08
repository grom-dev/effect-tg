# effect-tg

[![Effectful](https://img.shields.io/badge/Effectful-%23fff?style=flat&logo=effect&logoColor=%23fff&logoSize=auto&color=%23000)](https://effect.website/)
[![npm](https://img.shields.io/npm/v/%40grom.js%2Feffect-tg?style=flat&logo=npm&logoColor=%23BB443E&logoSize=auto&label=Latest&labelColor=%23fff&color=%23BB443E)](https://www.npmjs.com/package/@grom.js/effect-tg)
[![codecov](https://img.shields.io/codecov/c/github/grom-dev/effect-tg?style=flat&logo=codecov&logoColor=%23fff&logoSize=auto&label=Coverage&labelColor=%23f07&color=%23fff)](https://codecov.io/gh/grom-dev/effect-tg)

Effectful library for crafting Telegram bots.

## Features

- Modular design to build with [Effect](https://effect.website).
- Complete type definitions for [Bot API](https://core.telegram.org/bots/api) methods and types.
- Composable API for [sending messages](#sending-messages).
- [JSX syntax](#jsx-syntax) support for creating formatted text.

## Installation

```sh
# Install the library
npm install @grom.js/effect-tg

# Install Effect dependencies
npm install effect @effect/platform

# Install JSX runtime for formatted text
npm install @grom.js/tgx
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
┌• BotApi — typed interface that delegates calls to BotApiTransport.
└─┬• BotApiTransport — serializes parameters, sends HTTP requests, parses responses.
  ├──• BotApiUrl — constructs endpoint URLs to methods and files.
  └──• HttpClient — performs HTTP requests.
```

This design enables:

- **Extensibility**: Extend `BotApiTransport` to implement logging, retrying, etc.
- **Testability**: Mock implementation of `BotApiTransport` or `HttpClient` to test your bot.
- **Portability:** Provide different `BotApiUrl` to run a bot on test environment or with local Bot API server.

**Example:** Constructing `BotApi` layer with method call tracing.

```ts
import { FetchHttpClient } from '@effect/platform'
import { BotApi } from '@grom.js/effect-tg'
import { Config, Effect, Layer } from 'effect'

const BotApiLive = Layer.provide(
  BotApi.layerConfig({
    token: Config.redacted('BOT_TOKEN'),
    environment: 'prod',
    transformTransport: transport => ({
      sendRequest: (method, params) =>
        transport.sendRequest(method, params).pipe(
          Effect.withSpan(method),
        ),
    }),
  }),
  FetchHttpClient.layer
)
```

### Error handling

Failed `BotApi` method calls result in `BotApiError`, which is a union of tagged errors with additional information:

- `TransportError` — HTTP or network failure.
  - `cause` — original error from `HttpClient`.
- `RateLimited` — bot has exceeded the flood limit.
  - `retryAfter` — duration to wait before the next attempt.
- `GroupUpgraded` — group has been migrated to a supergroup.
  - `supergroup` — object containing the ID of the new supergroup.
- `MethodFailed` — response was unsuccessful, but the exact reason could not be determined.
  - `possibleReason` — string literal representing one of the common failure reasons. It is determined by the error code and description of the Bot API response, which are subject to change.
- `InternalServerError` — Bot API server failed with a 5xx error code.

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

## Sending messages

One of the most common tasks for a messenger bot is sending messages.

Bot API exposes multiple methods for sending a message, each corresponding to a different content type:

- `sendMessage` for text;
- `sendPhoto` for photos;
- `sendVideo` for videos;
- and so on.

`Send` module provides a unified, more composable way to send messages of all kinds.

### Basic usage

To send a message, you need:

- **Content** — content of the message to be sent.
- **Dialog** — target chat and thread where the message will be sent.
- **Reply** — (optional) information about the message being replied to.
- **Markup** — (optional) markup for replying to the message.
- **Options** — (optional) additional options for sending the message.

_TODO: add subsections explaining each of these parts_

`Send.sendMessage` function accepts mentioned parameters and returns an `Effect` that sends a message, automatically choosing the appropriate method based on the content type.

**Example:** Sending messages using `Send.sendMessage`.

```ts
// TODO: come up with a couple of short examples using different feautes;
```

### Prepared messages

_TODO: explain that it contains content, markup, and options, but dialog should be provided; explain benefits_
_TODO: explain that it's pipeable_

Create reusable message templates with `Send.message`:

```ts
// TODO: more interesting and useful examples

import { Content, Send, Text } from '@grom.js/effect-tg'
import { Effect } from 'effect'

// Create a prepared message
const welcomeMessage = Send.message(
  Content.text(Text.html('<b>Welcome!</b> Thanks for joining.')),
)

// Send to a specific dialog
const program = welcomeMessage.pipe(
  Send.to(Dialog.user(123456789)),
)
```

### Composing options

_TODO: refine this section_

Chain modifiers to customize message behavior:

```ts
import { Content, Send, Text } from '@grom.js/effect-tg'
import { pipe } from 'effect'

const content = Content.text(Text.plain('Secret message! 🤫'))

const silentProtectedMessage = pipe(
  Send.message(),
  Send.withoutNotification,
  Send.withContentProtection,
)
```

Available modifiers:

- `withMarkup` / `withoutMarkup` — reply keyboard or inline buttons
- `withNotification` / `withoutNotification` — enable/disable notification
- `withContentProtection` / `withoutContentProtection` — prevent forwarding/saving
- `withPaidBroadcast` / `withoutPaidBroadcast` — paid broadcast mode

### Text formatting

`Text` module provides all [formatting options](https://core.telegram.org/bots/api#formatting-options) supported by the Bot API.

**Example:** Formatting text with `Text` module.

```tsx
import { Text } from '@grom.js/effect-tg'

// Plain text — sent as is
Text.plain('*Not bold*. _Not italic_.')

// HTML — sent with 'HTML' parse mode
Text.html('<b>Bold</b> and <i>italic</i>.')

// Markdown — sent with 'MarkdownV2' parse mode
Text.markdown('*Bold* and _italic_.')
```

#### JSX syntax

`Text` module also allows to compose formatted text using JSX syntax, with JSX runtime implemented by [`@grom.js/tgx`](https://github.com/grom-dev/tgx).

Benefits of using JSX:

- **Validation**: JSX is validated during compilation, so you can't specify invalid HTML or Markdown.
- **Composability**: JSX allows composing formatted text with custom components.
- **Auto-escaping**: JSX escapes special characters, saving you from \<s\>B@d\</s\> \_iNpUtS\_.
- **Type safety**: Free LSP hints and type checking for text entities and custom components.

`Text.tgx` function accepts a JSX element and returns an instance of `Text.Tgx`, which can then be used as a content of a message.

**Example:** Using JSX to created formatted text.

```tsx
// TODO: come up with some interesting example to showcase JSX benefits
```

<details>
<summary>How it works?</summary>

JSX is just syntactic sugar transformed by the compiler.
Result of transformation depends on the JSX runtime.
`effect-tg` relies on JSX runtime from `@grom.js/tgx`, which transforms JSX elements to `TgxElement` instances.
When `Send.sendMessage` encounters an instance of `Text.Tgx`, it converts inner `TgxElement`s to the parameters for a `send*` method.

</details>

To enable JSX support:

1. Install `@grom.js/tgx` package:
   ```sh
   npm install @grom.js/tgx
   ```
2. Update your `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "jsx": "react-jsx",
       "jsxImportSource": "@grom.js/tgx"
     }
   }
   ```
