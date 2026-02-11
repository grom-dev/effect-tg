# effect-tg

[![Effectful](https://img.shields.io/badge/Yes.-%23fff?style=flat&logo=effect&logoColor=%23000&logoSize=auto&label=Effect%3F&labelColor=%23fff&color=%23000)](https://effect.website/)
[![Bot API](https://img.shields.io/badge/v9.4-%23fff?style=flat&logo=telegram&logoColor=%2325A3E1&logoSize=auto&label=Bot%20API&labelColor=%23fff&color=%2325A3E1)](https://core.telegram.org/bots/api)
[![npm](https://img.shields.io/npm/v/%40grom.js%2Feffect-tg?style=flat&logo=npm&logoColor=%23BB443E&logoSize=auto&label=Latest&labelColor=%23fff&color=%23BB443E)](https://www.npmjs.com/package/@grom.js/effect-tg)
[![codecov](https://img.shields.io/codecov/c/github/grom-dev/effect-tg?style=flat&logo=codecov&logoColor=%23f07&label=Coverage&labelColor=%23fff&color=%23f07)](https://codecov.io/gh/grom-dev/effect-tg)

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

- **`TransportError`** — HTTP or network failure. The `cause` property contains the original error from `HttpClient`.
- **`RateLimited`** — bot has exceeded the flood limit. The `retryAfter` property contains the duration to wait before the next attempt.
- **`GroupUpgraded`** — group has been migrated to a supergroup. The `supergroup` property contains an object with the ID of the new supergroup.
- **`MethodFailed`** — response was unsuccessful, but the exact reason could not be determined. The `possibleReason` property contains a string literal representing one of the common failure reasons. It is determined by the error code and description of the Bot API response, which are subject to change.
- **`InternalServerError`** — Bot API server failed with a 5xx error code.

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
- **Dialog** — target chat and topic where the message will be sent.
- **Markup** — (optional) markup for replying to the message.
- **Reply** — (optional) information about the message being replied to.
- **Options** — (optional) additional options for sending the message.

`Send.sendMessage` function accepts mentioned parameters and returns an `Effect` that sends a message, automatically choosing the appropriate method based on the content type.

**Example:** Sending messages using `Send.sendMessage`.

```ts
// TODO: variety of examples
```

#### Content

`Content` module provides constructors for every supported content type:

| Constructor            | Bot API method  | Description                                         |
| ---------------------- | --------------- | --------------------------------------------------- |
| `Content.text`         | `sendMessage`   | Text with optional link preview                     |
| `Content.photo`        | `sendPhoto`     | Photo with optional caption and spoiler             |
| `Content.video`        | `sendVideo`     | Video with optional caption, spoiler, and streaming |
| `Content.animation`    | `sendAnimation` | GIF or video without sound                          |
| `Content.audio`        | `sendAudio`     | Audio file with optional metadata                   |
| `Content.voice`        | `sendVoice`     | Voice note                                          |
| `Content.videoNote`    | `sendVideoNote` | Round video                                         |
| `Content.document`     | `sendDocument`  | File of any type                                    |
| `Content.sticker`      | `sendSticker`   | Sticker                                             |
| `Content.location`     | `sendLocation`  | Static location                                     |
| `Content.liveLocation` | `sendLocation`  | Live location with updates                          |
| `Content.venue`        | `sendVenue`     | Venue with address                                  |
| `Content.contact`      | `sendContact`   | Phone contact                                       |
| `Content.dice`         | `sendDice`      | Animated emoji                                      |

#### Dialog

`Dialog` module provides constructors for all target chats:

- `Dialog.user(id)` — private chat with a user.
- `Dialog.group(id)` — group chat.
- `Dialog.supergroup(id)` — supergroup chat.
- `Dialog.channel(id)` — channel.

To target a specific topic, chain a method on the peer:

- `Dialog.user(id).topic(topicId)` — topic in a private chat.
- `Dialog.supergroup(id).topic(topicId)` — topic in a forum supergroup.
- `Dialog.channel(id).directMessages(topicId)` — channel direct messages.

`Dialog.ofMessage` extracts the dialog from an incoming `Message` object.

**Dialog ID vs peer ID**

Bot API uses a single integer (`chat_id`) that [encodes both peer type and ID](https://core.telegram.org/api/bots/ids): user 1:1; group = `-id`; supergroup/channel = `-(id + 1000000000000)`. Some responses return dialog IDs, others peer IDs — wrong format causes errors.

**Branded types**

`UserId`, `GroupId`, `SupergroupId`, `ChannelId`, `DialogId` prevent mixing. `SupergroupId` and `ChannelId` are the same type (supergroups are a special kind of channel; both share the same ID space). Use `Dialog.decodePeerId`, `Dialog.encodePeerId`, `Dialog.decodeDialogId` to convert.

#### Reply

`Reply` module provides two ways to create a reply reference:

- `Reply.make({ dialog, messageId })` — reply to a message by ID in a specific dialog.
- `Reply.toMessage(message)` — reply to a `Message` object, extracting the dialog and ID automatically.

Both accept an optional `optional` flag — when `true`, the message will be sent even if the referenced message is not found.

#### Markup

`Markup` module provides reply markup types and constructors:

- `inlineKeyboard(rows)` — buttons attached to the message (callback, URL, web app, etc.).
- `replyKeyboard(rows, options?)` — custom keyboard replacing the default; options include `oneTime`, `resizable`, `selective`, `inputPlaceholder`.
- `replyKeyboardRemove` — hide a reply keyboard.
- `forceReply` — show a reply input field.

Use `InlineButton` and `ReplyButton` builders to create button rows. Example:

```ts
import { InlineButton, inlineKeyboard, ReplyButton, replyKeyboard } from '@grom.js/effect-tg'

// Inline keyboard: URL and callback buttons
const inline = inlineKeyboard([
  [InlineButton.url('Open', 'https://example.com'), InlineButton.callback('Tap me', 'action_1')],
])

// Reply keyboard: simple buttons
const reply = replyKeyboard([
  ['Option A', 'Option B'],
  [ReplyButton.requestContact('Share phone')],
], { oneTime: true })
```

### Prepared messages

`Send.message` creates a `MessageToSend` — a reusable Effect that bundles content, markup, reply, and options. It does not send until you run it.

Flow:

1. `Send.message(content)` creates a `MessageToSend` (an Effect that requires `TargetDialog`).
2. Chain modifiers (`Send.withMarkup`, `Send.withoutNotification`, etc.) to customize.
3. `Send.to(dialog)` provides the target and returns a plain Effect; the message sends when that Effect runs (e.g. `yield*` in a generator, `Effect.runPromise`, or as part of a larger program).

**Example:** Creating and sending prepared messages.

```ts
import { Content, Dialog, Send, Text } from '@grom.js/effect-tg'
import { Effect, pipe } from 'effect'

// Reusable template
const welcomeMessage = Send.message(
  Content.text(Text.html('<b>Welcome!</b> Thanks for joining.')),
)

// Send to different dialogs — runs the Effect to perform the API call
const program = Effect.gen(function* () {
  yield* welcomeMessage.pipe(Send.to(Dialog.user(123456789)))
  yield* welcomeMessage.pipe(Send.to(Dialog.user(987654321)))
})

// With modifiers: silent, protected
const secretMessage = pipe(
  Send.message(Content.text(Text.plain('Secret message!'))),
  Send.withoutNotification,
  Send.withContentProtection,
  Send.to(Dialog.user(123456789)),
)
// Use yield* secretMessage or Effect.runPromise(secretMessage) to send
```

### Composing options

Chain modifiers on a `MessageToSend` to customize its behavior:

- `Send.withMarkup` / `Send.withoutMarkup` — set or remove reply keyboard / inline buttons.
- `Send.withReply` / `Send.withoutReply` — set or remove the message being replied to.
- `Send.withNotification` / `Send.withoutNotification` — enable or disable notification sound.
- `Send.withContentProtection` / `Send.withoutContentProtection` — prevent or allow forwarding and saving.
- `Send.withPaidBroadcast` / `Send.withoutPaidBroadcast` — enable or disable paid broadcast mode.
- `Send.withOptions` — merge arbitrary options at once.

All dual modifiers (`withMarkup`, `withReply`, `withOptions`) support both data-first and data-last calling conventions.

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

`Text` module also allows to compose formatted text with JSX.

Benefits of using JSX:

- **Validation**: JSX is validated during compilation, so you can't specify invalid HTML or Markdown.
- **Composability**: JSX allows composing formatted text with custom components.
- **Auto-escaping**: JSX escapes special characters, saving you from \<s\>B@d\</s\> \_iNpUtS\_.
- **Type safety**: Free LSP hints and type checking for text entities and custom components.

`Text.tgx` function accepts a JSX element and returns an instance of `Text.Tgx`, which can then be used as a content of a message.

**Example:** Composing reusable messages with JSX.

```tsx
import type { PropsWithChildren } from '@grom.js/tgx/types'
import { Content, Dialog, Send, Text } from '@grom.js/effect-tg'
import { pipe } from 'effect'

// Reusable component for a key-value field
const Field = (props: PropsWithChildren<{ label: string }>) => (
  <><b>{props.label}:</b> {props.children}{'\n'}</>
)

// Component that renders a deploy summary
const DeploySummary = (props: {
  service: string
  version: string
  env: string
  author: string
  url: string
}) => (
  <>
    <emoji id="5445284980978621387" alt="🚀" /> <b>Deploy to <i>{props.env}</i></b>
    {'\n\n'}
    <Field label="Service"><code>{props.service}</code></Field>
    <Field label="Version"><code>{props.version}</code></Field>
    <Field label="Author">{props.author}</Field>
    {'\n'}
    <a href={props.url}>View in dashboard</a>
    {'\n\n'}
    <blockquote expandable>
      Changelog:{'\n'}
      - Fix rate limiting on /api/submit{'\n'}
      - Add retry logic for webhook delivery{'\n'}
      - Update dependencies
    </blockquote>
  </>
)

// Compose the final message
const deployNotification = pipe(
  Send.message(Content.text(Text.tgx(
    <DeploySummary
      service="billing-api"
      version="2.14.0"
      env="production"
      author="Alice"
      url="https://deploy.example.com/runs/4821"
    />,
  ))),
  Send.withoutNotification,
  Send.to(Dialog.channel(123456789)),
)
```

<details>
<summary>How it works?</summary>

JSX is just syntactic sugar transformed by the compiler.
Result of transformation depends on the JSX runtime.
`effect-tg` relies on JSX runtime from [`@grom.js/tgx`](https://github.com/grom-dev/tgx), which transforms JSX elements to `TgxElement` instances.
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
