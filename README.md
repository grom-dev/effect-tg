# effect-tg

[![Effectful](https://img.shields.io/badge/Yes.-%23fff?style=flat&logo=effect&logoColor=%23000&logoSize=auto&label=Effect%3F&labelColor=%23fff&color=%23000)](https://effect.website/)
[![Bot API](https://img.shields.io/badge/v9.6-%23fff?style=flat&logo=telegram&logoColor=%2325A3E1&logoSize=auto&label=Bot%20API&labelColor=%23fff&color=%2325A3E1)](https://core.telegram.org/bots/api)
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

```text
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
          Effect.logError(`Group is now a supergroup with ID: ${supergroup.id}`),
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

`Send.sendMessage` function accepts mentioned parameters and returns an `Effect` that sends a message, automatically choosing the appropriate Bot API method based on the content type.

**Example:** Sending messages using `Send.sendMessage`.

```ts
import { Content, Dialog, File, Markup, Reply, Send, Text } from '@grom.js/effect-tg'
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  // Plain text to a user
  const greeting = yield* Send.sendMessage({
    content: Content.text(Text.plain('Hey! Wanna roll a dice?')),
    dialog: Dialog.user(382713),
  })

  // Photo with formatted caption and inline keyboard
  yield* Send.sendMessage({
    content: Content.photo(
      File.External(new URL('https://cataas.com/cat')),
      { caption: Text.html('<b>Cat of the day</b>\n<i>Rate this cat:</i>') },
    ),
    dialog: Dialog.user(382713),
    markup: Markup.inlineKeyboard([
      [Markup.InlineButton.callback('❤️', 'rate_love')],
      [Markup.InlineButton.callback('👎', 'rate_nope')],
    ]),
  })

  // Reply with a dice
  const roll = yield* Send.sendMessage({
    content: Content.dice('🎲'),
    dialog: Dialog.user(382713),
    reply: Reply.toMessage(greeting),
  })

  const rolled = roll.dice!.value
  if (rolled === 6) {
    // DM channel
    yield* Send.sendMessage({
      content: Content.text(Text.plain(`User 382713 rolled ${rolled}.`)),
      dialog: Dialog.channelDm(Dialog.channel(100200), 42),
    })
  }
  else {
    // Send silently
    yield* Send.sendMessage({
      content: Content.text(Text.plain(`You rolled ${rolled}. Disappointing.`)),
      dialog: Dialog.user(382713),
      options: Send.options({ disableNotification: true })
    })
  }
})
```

#### Content

`Content` module provides constructors for creating objects that represent the content of a message. `Send.sendMessage` uses the content type to choose the appropriate Bot API method automatically.

| Constructor            | Bot API method  | Description            |
| ---------------------- | --------------- | ---------------------- |
| `Content.text`         | `sendMessage`   | Text                   |
| `Content.photo`        | `sendPhoto`     | Photo                  |
| `Content.video`        | `sendVideo`     | Video                  |
| `Content.animation`    | `sendAnimation` | GIF or video w/o sound |
| `Content.audio`        | `sendAudio`     | Audio file             |
| `Content.voice`        | `sendVoice`     | Voice note             |
| `Content.videoNote`    | `sendVideoNote` | Round video note       |
| `Content.document`     | `sendDocument`  | File of any type       |
| `Content.sticker`      | `sendSticker`   | Sticker                |
| `Content.location`     | `sendLocation`  | Static location        |
| `Content.liveLocation` | `sendLocation`  | Live location          |
| `Content.venue`        | `sendVenue`     | Venue with address     |
| `Content.contact`      | `sendContact`   | Phone contact          |
| `Content.dice`         | `sendDice`      | Random dice            |

#### Dialog

`Dialog` module provides utilities for creating target chats:

- `Dialog.user(id)` — private chat with a user.
- `Dialog.group(id)` — chat of a (basic) group.
- `Dialog.supergroup(id)` — supergroup chat.
- `Dialog.channel(id)` — channel.

Targeting a specific topic:

- `Dialog.privateTopic(user, topicId)` — topic in a private chat.
- `Dialog.forumTopic(supergroup, topicId)` — topic in a forum supergroup.
- `Dialog.channelDm(channel, topicId)` — channel direct messages.

`Dialog.ofMessage` helper extracts the dialog from an incoming `Message` object.

##### Dialog and peer IDs

Bot API uses a single integer to encode peer type with its ID — [dialog ID](https://core.telegram.org/api/bots/ids).

This may not be a problem for user IDs, since user IDs map to the same dialog IDs.
However, this may cause some defects when working with other peers.
For example, to send a message to a channel with ID `3011378744`, you need to set `chat_id` parameter to `-1003011378744`.

To prevent this confusion, `Dialog` module defines **branded types** that distinguish peer IDs from dialog IDs at the type level:

- `UserId` — number representing a user ID.
- `GroupId` — number representing a group ID.
- `ChannelId` — number representing a channel ID.
- `SupergroupId` — alias to `ChannelId`, since supergroups share ID space with channels.
- `DialogId` — number encoding peer type and peer ID.

Constructors like `Dialog.user`, `Dialog.channel`, etc. validate and encode IDs internally, so you rarely need to convert manually. When you do, `Dialog` module exports conversion utilities:

- `Dialog.decodeDialogId(dialogId)` — decodes a dialog ID into peer type and peer ID.
- `Dialog.decodePeerId(peer, dialogId)` — extracts a typed peer ID from a dialog ID.
- `Dialog.encodePeerId(peer, id)` — encodes a peer type and ID into a dialog ID.

#### Markup

`Markup` module provides reply markup types and constructors:

- `Markup.inlineKeyboard(rows)` — inline keyboard attached to the message.
- `Markup.replyKeyboard(rows, options?)` — custom keyboard for quick reply or other action.
- `Markup.replyKeyboardRemove()` — hide a previously shown reply keyboard.
- `Markup.forceReply()` — forces Telegram client to reply to the message.

**Example:** Creating reply markups.

```ts
import { Markup } from '@grom.js/effect-tg'

const inline = Markup.inlineKeyboard([
  [Markup.InlineButton.callback('Like', 'liked')],
  [Markup.InlineButton.url('Source code', 'https://github.com/grom-dev/effect-tg')],
])

const reply = Markup.replyKeyboard(
  [
    ['Option A', 'Option B'],
    [Markup.ReplyButton.requestContact('Share phone')],
  ],
  { oneTime: true, resizable: true }
)
```

### Prepared messages

`Send.message` creates a `MessageToSend` — prepared message that bundles content, markup, reply, and options.

`MessageToSend` is also an `Effect`, which means:

- It can be piped to chain modifiers that customize markup, reply, and options.
- It can be executed to send the message. To be sent, `Send.TargetDialog` service should be provided.

**Example:** Creating and sending prepared messages.

```ts
import { Content, Dialog, Markup, Send, Text } from '@grom.js/effect-tg'
import { Effect } from 'effect'

// Reusable template
const welcomeMessage = Send.message(
  Content.text(Text.html('<b>Welcome!</b> Thanks for joining.'))
).pipe(
  Send.withMarkup(
    Markup.replyKeyboard([
      [Markup.ReplyButton.text('Effect?')],
      [Markup.ReplyButton.text('Die.')],
    ]),
  ),
)

// Send to different dialogs
const greet1 = Effect.gen(function* () {
  yield* welcomeMessage.pipe(Send.to(Dialog.user(123)))
  yield* welcomeMessage.pipe(Send.to(Dialog.channel(321)))
})

// Send to the same dialog with different options
const greet2 = Effect.gen(function* () {
  yield* welcomeMessage.pipe(Send.withoutNotification)
  yield* welcomeMessage.pipe(Send.withContentProtection)
}).pipe(
  Send.to(Dialog.forumTopic(Dialog.supergroup(4), 2)),
)
```

### Composing options

Chain modifiers on a `MessageToSend` to customize its behavior:

- `withMarkup`/`withoutMarkup` — set/remove reply markup.
- `withReply`/`withoutReply` — set/remove reply options.
- `withNotification`/`withoutNotification` — enable/disable notification sound.
- `withContentProtection`/`withoutContentProtection` — prevent/allow forwarding and saving.
- `withPaidBroadcast`/`withoutPaidBroadcast` — enable/disable paid broadcast.
- `withOptions` — merge with the new send options.

**Example:** Chaining modifiers on a prepared message.

```ts
import { Content, Markup, Send, Text } from '@grom.js/effect-tg'

const secretPromo = Send.message(Content.text(Text.plain('Shh!'))).pipe(
  Send.withMarkup(
    Markup.inlineKeyboard([
      [Markup.InlineButton.copyText('Copy promo', 'EFFECT_TG')],
    ]),
  ),
  Send.withoutNotification,
  Send.withContentProtection,
)
```

### Text formatting

`Text` module provides utilities for creating [formatted text](https://core.telegram.org/bots/api#formatting-options) to be used in text messages and captions.

**Example:** Formatting text with `Text` module.

```tsx
import { Text } from '@grom.js/effect-tg'

// Plain text — sent as is
Text.plain('*Not bold*. _Not italic_.')

// Markdown — sent with 'MarkdownV2' parse mode
Text.markdown('*Bold* and _italic_.')

// HTML — sent with 'HTML' parse mode
Text.html('<b>Bold</b> and <i>italic</i>.')
```

#### JSX syntax

`Text` module also allows to compose formatted text with JSX.

Benefits of using JSX:

- **Validation**: JSX is validated during compilation, so you can't specify invalid HTML or Markdown.
- **Composability**: JSX allows composing formatted text with custom components.
- **Auto-escaping**: JSX escapes special characters, saving you from \<s\>bAd\</s\> \_iNpUtS\_.
- **Type safety**: LSP hints and type checking for text entities and custom components.

`Text.tgx` function accepts a JSX element and returns an instance of `Text.Tgx`, which can then be used as a content of a message.

<details>
<summary>How to enable?</summary>

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

</details>

<details>
<summary>How it works?</summary>

JSX is just syntactic sugar transformed by the compiler.
Result of transformation depends on the JSX runtime.
`effect-tg` relies on JSX runtime from [`@grom.js/tgx`](https://github.com/grom-dev/tgx), which transforms JSX elements to `TgxElement` instances.
When `Send.sendMessage` encounters an instance of `Text.Tgx`, it converts inner `TgxElement`s to the parameters for a `send*` method.

</details>

**Example:** Composing reusable messages with JSX.

```tsx
import type { PropsWithChildren } from '@grom.js/tgx'
import { Content, Dialog, Send, Text } from '@grom.js/effect-tg'

// Reusable component for a key-value field
const Field = (props: PropsWithChildren<{ label: string }>) => (
  <><b>{props.label}:</b> {props.children}{'\n'}</>
)

// Simple component for convenience
const RocketEmoji = () => (
  <emoji id="5445284980978621387" alt="🚀" />
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
    <RocketEmoji /> <b>Deploy to <i>{props.env}</i></b>
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

// Create summary text
const summary = Text.tgx(
  <DeploySummary
    service="billing-api"
    version="2.14.0"
    env="production"
    author="Alice"
    url="https://deploy.example.com/runs/4821"
  />
)

// Publish a new post
const publish = Send.message(Content.text(summary)).pipe(
  Send.to(Dialog.channel(3011378744)),
)
```
