import type * as File from '../File.ts'
import type * as Types from './botApiTypes.gen.ts'

export interface MethodParams {
  getUpdates: void | {
    /** Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as [getUpdates](https://core.telegram.org/bots/api#getupdates) is called with an _offset_ higher than its _update\_id_. The negative offset can be specified to retrieve updates starting from _\-offset_ update from the end of the updates queue. All previous updates will be forgotten. */
    offset?: number
    /** Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100. */
    limit?: number
    /** Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only. */
    timeout?: number
    /**
     * An array of the update types you want your bot to receive. For example, specify `["message", "edited_channel_post", "callback_query"]` to only receive updates of these types. See [Update](https://core.telegram.org/bots/api#update) for a complete list of available update types. Specify an empty list to receive all update types except _chat\_member_, _message\_reaction_, and _message\_reaction\_count_ (default). If not specified, the previous setting will be used.
     *
     * Please note that this parameter doesn't affect updates created before the call to getUpdates, so unwanted updates may be received for a short period of time.
     */
    allowed_updates?: Array<string>
  }
  setWebhook: {
    /** HTTPS URL to send updates to. Use an empty string to remove webhook integration */
    url: string
    /** Upload your public key certificate so that the root certificate in use can be checked. See our [self-signed guide](https://core.telegram.org/bots/self-signed) for details. */
    certificate?: File.InputFile
    /** The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS */
    ip_address?: string
    /** The maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to _40_. Use lower values to limit the load on your bot's server, and higher values to increase your bot's throughput. */
    max_connections?: number
    /**
     * An array of the update types you want your bot to receive. For example, specify `["message", "edited_channel_post", "callback_query"]` to only receive updates of these types. See [Update](https://core.telegram.org/bots/api#update) for a complete list of available update types. Specify an empty list to receive all update types except _chat\_member_, _message\_reaction_, and _message\_reaction\_count_ (default). If not specified, the previous setting will be used.
     *
     * Please note that this parameter doesn't affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time.
     */
    allowed_updates?: Array<string>
    /** Pass _True_ to drop all pending updates */
    drop_pending_updates?: boolean
    /** A secret token to be sent in a header “X-Telegram-Bot-Api-Secret-Token” in every webhook request, 1-256 characters. Only characters `A-Z`, `a-z`, `0-9`, `_` and `-` are allowed. The header is useful to ensure that the request comes from a webhook set by you. */
    secret_token?: string
  }
  deleteWebhook: void | {
    /** Pass _True_ to drop all pending updates */
    drop_pending_updates?: boolean
  }
  getWebhookInfo: void | Record<string, never>
  getMe: void | Record<string, never>
  logOut: void | Record<string, never>
  close: void | Record<string, never>
  sendMessage: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** Text of the message to be sent, 1-4096 characters after entities parsing */
    text: string
    /** Mode for parsing entities in the message text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** An array of special entities that appear in message text, which can be specified instead of _parse\_mode_ */
    entities?: Array<Types.MessageEntity>
    /** Link preview generation options for the message */
    link_preview_options?: Types.LinkPreviewOptions
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  forwardMessage: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be forwarded; required if the message is forwarded to a direct messages chat */
    direct_messages_topic_id?: number
    /** Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`) */
    from_chat_id: number | string
    /** New start timestamp for the forwarded video in the message */
    video_start_timestamp?: number
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the forwarded message from forwarding and saving */
    protect_content?: boolean
    /** Unique identifier of the message effect to be added to the message; only available when forwarding to private chats */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Message identifier in the chat specified in _from\_chat\_id_ */
    message_id: number
  }
  forwardMessages: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the messages will be forwarded; required if the messages are forwarded to a direct messages chat */
    direct_messages_topic_id?: number
    /** Unique identifier for the chat where the original messages were sent (or channel username in the format `@channelusername`) */
    from_chat_id: number | string
    /** An array of 1-100 identifiers of messages in the chat _from\_chat\_id_ to forward. The identifiers must be specified in a strictly increasing order. */
    message_ids: Array<number>
    /** Sends the messages [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the forwarded messages from forwarding and saving */
    protect_content?: boolean
  }
  copyMessage: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** Unique identifier for the chat where the original message was sent (or channel username in the format `@channelusername`) */
    from_chat_id: number | string
    /** Message identifier in the chat specified in _from\_chat\_id_ */
    message_id: number
    /** New start timestamp for the copied video in the message */
    video_start_timestamp?: number
    /** New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept */
    caption?: string
    /** Mode for parsing entities in the new caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** An array of special entities that appear in the new caption, which can be specified instead of _parse\_mode_ */
    caption_entities?: Array<Types.MessageEntity>
    /** Pass _True_, if the caption must be shown above the message media. Ignored if a new caption isn't specified. */
    show_caption_above_media?: boolean
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; only available when copying to private chats */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  copyMessages: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** Unique identifier for the chat where the original messages were sent (or channel username in the format `@channelusername`) */
    from_chat_id: number | string
    /** An array of 1-100 identifiers of messages in the chat _from\_chat\_id_ to copy. The identifiers must be specified in a strictly increasing order. */
    message_ids: Array<number>
    /** Sends the messages [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent messages from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to copy the messages without their captions */
    remove_caption?: boolean
  }
  sendPhoto: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** Photo to send. Pass a file\_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    photo: File.InputFile | string
    /** Photo caption (may also be used when resending photos by _file\_id_), 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the photo caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** An array of special entities that appear in the caption, which can be specified instead of _parse\_mode_ */
    caption_entities?: Array<Types.MessageEntity>
    /** Pass _True_, if the caption must be shown above the message media */
    show_caption_above_media?: boolean
    /** Pass _True_ if the photo needs to be covered with a spoiler animation */
    has_spoiler?: boolean
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  sendAudio: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** Audio file to send. Pass a file\_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    audio: File.InputFile | string
    /** Audio caption, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the audio caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** An array of special entities that appear in the caption, which can be specified instead of _parse\_mode_ */
    caption_entities?: Array<Types.MessageEntity>
    /** Duration of the audio in seconds */
    duration?: number
    /** Performer */
    performer?: string
    /** Track name */
    title?: string
    /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file\_attach\_name>” if the thumbnail was uploaded using multipart/form-data under <file\_attach\_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    thumbnail?: File.InputFile | string
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  sendDocument: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** File to send. Pass a file\_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    document: File.InputFile | string
    /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file\_attach\_name>” if the thumbnail was uploaded using multipart/form-data under <file\_attach\_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    thumbnail?: File.InputFile | string
    /** Document caption (may also be used when resending documents by _file\_id_), 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the document caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** An array of special entities that appear in the caption, which can be specified instead of _parse\_mode_ */
    caption_entities?: Array<Types.MessageEntity>
    /** Disables automatic server-side content type detection for files uploaded using multipart/form-data */
    disable_content_type_detection?: boolean
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  sendVideo: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** Video to send. Pass a file\_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    video: File.InputFile | string
    /** Duration of sent video in seconds */
    duration?: number
    /** Video width */
    width?: number
    /** Video height */
    height?: number
    /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file\_attach\_name>” if the thumbnail was uploaded using multipart/form-data under <file\_attach\_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    thumbnail?: File.InputFile | string
    /** Cover for the video in the message. Pass a file\_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://<file\_attach\_name>” to upload a new one using multipart/form-data under <file\_attach\_name> name. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    cover?: File.InputFile | string
    /** Start timestamp for the video in the message */
    start_timestamp?: number
    /** Video caption (may also be used when resending videos by _file\_id_), 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the video caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** An array of special entities that appear in the caption, which can be specified instead of _parse\_mode_ */
    caption_entities?: Array<Types.MessageEntity>
    /** Pass _True_, if the caption must be shown above the message media */
    show_caption_above_media?: boolean
    /** Pass _True_ if the video needs to be covered with a spoiler animation */
    has_spoiler?: boolean
    /** Pass _True_ if the uploaded video is suitable for streaming */
    supports_streaming?: boolean
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  sendAnimation: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** Animation to send. Pass a file\_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    animation: File.InputFile | string
    /** Duration of sent animation in seconds */
    duration?: number
    /** Animation width */
    width?: number
    /** Animation height */
    height?: number
    /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file\_attach\_name>” if the thumbnail was uploaded using multipart/form-data under <file\_attach\_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    thumbnail?: File.InputFile | string
    /** Animation caption (may also be used when resending animation by _file\_id_), 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the animation caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** An array of special entities that appear in the caption, which can be specified instead of _parse\_mode_ */
    caption_entities?: Array<Types.MessageEntity>
    /** Pass _True_, if the caption must be shown above the message media */
    show_caption_above_media?: boolean
    /** Pass _True_ if the animation needs to be covered with a spoiler animation */
    has_spoiler?: boolean
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  sendVoice: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** Audio file to send. Pass a file\_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    voice: File.InputFile | string
    /** Voice message caption, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the voice message caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** An array of special entities that appear in the caption, which can be specified instead of _parse\_mode_ */
    caption_entities?: Array<Types.MessageEntity>
    /** Duration of the voice message in seconds */
    duration?: number
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  sendVideoNote: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** Video note to send. Pass a file\_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files). Sending video notes by a URL is currently unsupported */
    video_note: File.InputFile | string
    /** Duration of sent video in seconds */
    duration?: number
    /** Video width and height, i.e. diameter of the video message */
    length?: number
    /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file\_attach\_name>” if the thumbnail was uploaded using multipart/form-data under <file\_attach\_name>. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    thumbnail?: File.InputFile | string
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  sendPaidMedia: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). If the chat is a channel, all Telegram Star proceeds from this media will be credited to the chat's balance. Otherwise, they will be credited to the bot's balance. */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** The number of Telegram Stars that must be paid to buy access to the media; 1-25000 */
    star_count: number
    /** An array describing the media to be sent; up to 10 items */
    media: Array<Types.InputPaidMedia>
    /** Bot-defined paid media payload, 0-128 bytes. This will not be displayed to the user, use it for your internal processes. */
    payload?: string
    /** Media caption, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the media caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** An array of special entities that appear in the caption, which can be specified instead of _parse\_mode_ */
    caption_entities?: Array<Types.MessageEntity>
    /** Pass _True_, if the caption must be shown above the message media */
    show_caption_above_media?: boolean
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  sendMediaGroup: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the messages will be sent; required if the messages are sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** An array describing messages to be sent, must include 2-10 items */
    media: Array<Types.InputMediaAudio | Types.InputMediaDocument | Types.InputMediaPhoto | Types.InputMediaVideo>
    /** Sends messages [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent messages from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
  }
  sendLocation: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** Latitude of the location */
    latitude: number
    /** Longitude of the location */
    longitude: number
    /** The radius of uncertainty for the location, measured in meters; 0-1500 */
    horizontal_accuracy?: number
    /** Period in seconds during which the location will be updated (see [Live Locations](https://telegram.org/blog/live-locations), should be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely. */
    live_period?: number
    /** For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. */
    heading?: number
    /** For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. */
    proximity_alert_radius?: number
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  sendVenue: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** Latitude of the venue */
    latitude: number
    /** Longitude of the venue */
    longitude: number
    /** Name of the venue */
    title: string
    /** Address of the venue */
    address: string
    /** Foursquare identifier of the venue */
    foursquare_id?: string
    /** Foursquare type of the venue, if known. (For example, “arts\_entertainment/default”, “arts\_entertainment/aquarium” or “food/icecream”.) */
    foursquare_type?: string
    /** Google Places identifier of the venue */
    google_place_id?: string
    /** Google Places type of the venue. (See [supported types](https://developers.google.com/places/web-service/supported_types).) */
    google_place_type?: string
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  sendContact: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** Contact's phone number */
    phone_number: string
    /** Contact's first name */
    first_name: string
    /** Contact's last name */
    last_name?: string
    /** Additional data about the contact in the form of a [vCard](https://en.wikipedia.org/wiki/VCard), 0-2048 bytes */
    vcard?: string
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  sendPoll: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). Polls can't be sent to channel direct messages chats. */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Poll question, 1-300 characters */
    question: string
    /** Mode for parsing entities in the question. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. Currently, only custom emoji entities are allowed */
    question_parse_mode?: string
    /** An array of special entities that appear in the poll question. It can be specified instead of _question\_parse\_mode_ */
    question_entities?: Array<Types.MessageEntity>
    /** An array of 2-12 answer options */
    options: Array<Types.InputPollOption>
    /** _True_, if the poll needs to be anonymous, defaults to _True_ */
    is_anonymous?: boolean
    /** Poll type, “quiz” or “regular”, defaults to “regular” */
    type?: string
    /** _True_, if the poll allows multiple answers, ignored for polls in quiz mode, defaults to _False_ */
    allows_multiple_answers?: boolean
    /** 0-based identifier of the correct answer option, required for polls in quiz mode */
    correct_option_id?: number
    /** Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing */
    explanation?: string
    /** Mode for parsing entities in the explanation. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    explanation_parse_mode?: string
    /** An array of special entities that appear in the poll explanation. It can be specified instead of _explanation\_parse\_mode_ */
    explanation_entities?: Array<Types.MessageEntity>
    /** Amount of time in seconds the poll will be active after creation, 5-600. Can't be used together with _close\_date_. */
    open_period?: number
    /** Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 600 seconds in the future. Can't be used together with _open\_period_. */
    close_date?: number
    /** Pass _True_ if the poll needs to be immediately closed. This can be useful for poll preview. */
    is_closed?: boolean
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  sendChecklist: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id: string
    /** Unique identifier for the target chat */
    chat_id: number
    /** An object for the checklist to send */
    checklist: Types.InputChecklist
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Unique identifier of the message effect to be added to the message */
    message_effect_id?: string
    /** An object for description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** An object for an inline keyboard */
    reply_markup?: Types.InlineKeyboardMarkup
  }
  sendDice: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** Emoji on which the dice throw animation is based. Currently, must be one of “![🎲](//telegram.org/img/emoji/40/F09F8EB2.png)”, “![🎯](//telegram.org/img/emoji/40/F09F8EAF.png)”, “![🏀](//telegram.org/img/emoji/40/F09F8F80.png)”, “![⚽](//telegram.org/img/emoji/40/E29ABD.png)”, “![🎳](//telegram.org/img/emoji/40/F09F8EB3.png)”, or “![🎰](//telegram.org/img/emoji/40/F09F8EB0.png)”. Dice can have values 1-6 for “![🎲](//telegram.org/img/emoji/40/F09F8EB2.png)”, “![🎯](//telegram.org/img/emoji/40/F09F8EAF.png)” and “![🎳](//telegram.org/img/emoji/40/F09F8EB3.png)”, values 1-5 for “![🏀](//telegram.org/img/emoji/40/F09F8F80.png)” and “![⚽](//telegram.org/img/emoji/40/E29ABD.png)”, and values 1-64 for “![🎰](//telegram.org/img/emoji/40/F09F8EB0.png)”. Defaults to “![🎲](//telegram.org/img/emoji/40/F09F8EB2.png)” */
    emoji?: string
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  sendMessageDraft: {
    /** Unique identifier for the target private chat */
    chat_id: number
    /** Unique identifier for the target message thread */
    message_thread_id?: number
    /** Unique identifier of the message draft; must be non-zero. Changes of drafts with the same identifier are animated */
    draft_id: number
    /** Text of the message to be sent, 1-4096 characters after entities parsing */
    text: string
    /** Mode for parsing entities in the message text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** An array of special entities that appear in message text, which can be specified instead of _parse\_mode_ */
    entities?: Array<Types.MessageEntity>
  }
  sendChatAction: {
    /** Unique identifier of the business connection on behalf of which the action will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`). Channel chats and channel direct messages chats aren't supported. */
    chat_id: number | string
    /** Unique identifier for the target message thread or topic of a forum; for supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Type of action to broadcast. Choose one, depending on what the user is about to receive: _typing_ for [text messages](https://core.telegram.org/bots/api#sendmessage), _upload\_photo_ for [photos](https://core.telegram.org/bots/api#sendphoto), _record\_video_ or _upload\_video_ for [videos](https://core.telegram.org/bots/api#sendvideo), _record\_voice_ or _upload\_voice_ for [voice notes](https://core.telegram.org/bots/api#sendvoice), _upload\_document_ for [general files](https://core.telegram.org/bots/api#senddocument), _choose\_sticker_ for [stickers](https://core.telegram.org/bots/api#sendsticker), _find\_location_ for [location data](https://core.telegram.org/bots/api#sendlocation), _record\_video\_note_ or _upload\_video\_note_ for [video notes](https://core.telegram.org/bots/api#sendvideonote). */
    action: string
  }
  setMessageReaction: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Identifier of the target message. If the message belongs to a media group, the reaction is set to the first non-deleted message in the group instead. */
    message_id: number
    /** An array of reaction types to set on the message. Currently, as non-premium users, bots can set up to one reaction per message. A custom emoji reaction can be used if it is either already present on the message or explicitly allowed by chat administrators. Paid reactions can't be used by bots. */
    reaction?: Array<Types.ReactionType>
    /** Pass _True_ to set the reaction with a big animation */
    is_big?: boolean
  }
  getUserProfilePhotos: {
    /** Unique identifier of the target user */
    user_id: number
    /** Sequential number of the first photo to be returned. By default, all photos are returned. */
    offset?: number
    /** Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100. */
    limit?: number
  }
  setUserEmojiStatus: {
    /** Unique identifier of the target user */
    user_id: number
    /** Custom emoji identifier of the emoji status to set. Pass an empty string to remove the status. */
    emoji_status_custom_emoji_id?: string
    /** Expiration date of the emoji status, if any */
    emoji_status_expiration_date?: number
  }
  getFile: {
    /** File identifier to get information about */
    file_id: string
  }
  banChatMember: {
    /** Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier of the target user */
    user_id: number
    /** Date when the user will be unbanned; Unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only. */
    until_date?: number
    /** Pass _True_ to delete all messages from the chat for the user that is being removed. If _False_, the user will be able to see messages in the group that were sent before the user was removed. Always _True_ for supergroups and channels. */
    revoke_messages?: boolean
  }
  unbanChatMember: {
    /** Unique identifier for the target group or username of the target supergroup or channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier of the target user */
    user_id: number
    /** Do nothing if the user is not banned */
    only_if_banned?: boolean
  }
  restrictChatMember: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
    /** Unique identifier of the target user */
    user_id: number
    /** An object for new user permissions */
    permissions: Types.ChatPermissions
    /** Pass _True_ if chat permissions are set independently. Otherwise, the _can\_send\_other\_messages_ and _can\_add\_web\_page\_previews_ permissions will imply the _can\_send\_messages_, _can\_send\_audios_, _can\_send\_documents_, _can\_send\_photos_, _can\_send\_videos_, _can\_send\_video\_notes_, and _can\_send\_voice\_notes_ permissions; the _can\_send\_polls_ permission will imply the _can\_send\_messages_ permission. */
    use_independent_chat_permissions?: boolean
    /** Date when restrictions will be lifted for the user; Unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever */
    until_date?: number
  }
  promoteChatMember: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier of the target user */
    user_id: number
    /** Pass _True_ if the administrator's presence in the chat is hidden */
    is_anonymous?: boolean
    /** Pass _True_ if the administrator can access the chat event log, get boost list, see hidden supergroup and channel members, report spam messages, ignore slow mode, and send messages to the chat without paying Telegram Stars. Implied by any other administrator privilege. */
    can_manage_chat?: boolean
    /** Pass _True_ if the administrator can delete messages of other users */
    can_delete_messages?: boolean
    /** Pass _True_ if the administrator can manage video chats */
    can_manage_video_chats?: boolean
    /** Pass _True_ if the administrator can restrict, ban or unban chat members, or access supergroup statistics. For backward compatibility, defaults to _True_ for promotions of channel administrators */
    can_restrict_members?: boolean
    /** Pass _True_ if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by him) */
    can_promote_members?: boolean
    /** Pass _True_ if the administrator can change chat title, photo and other settings */
    can_change_info?: boolean
    /** Pass _True_ if the administrator can invite new users to the chat */
    can_invite_users?: boolean
    /** Pass _True_ if the administrator can post stories to the chat */
    can_post_stories?: boolean
    /** Pass _True_ if the administrator can edit stories posted by other users, post stories to the chat page, pin chat stories, and access the chat's story archive */
    can_edit_stories?: boolean
    /** Pass _True_ if the administrator can delete stories posted by other users */
    can_delete_stories?: boolean
    /** Pass _True_ if the administrator can post messages in the channel, approve suggested posts, or access channel statistics; for channels only */
    can_post_messages?: boolean
    /** Pass _True_ if the administrator can edit messages of other users and can pin messages; for channels only */
    can_edit_messages?: boolean
    /** Pass _True_ if the administrator can pin messages; for supergroups only */
    can_pin_messages?: boolean
    /** Pass _True_ if the user is allowed to create, rename, close, and reopen forum topics; for supergroups only */
    can_manage_topics?: boolean
    /** Pass _True_ if the administrator can manage direct messages within the channel and decline suggested posts; for channels only */
    can_manage_direct_messages?: boolean
  }
  setChatAdministratorCustomTitle: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
    /** Unique identifier of the target user */
    user_id: number
    /** New custom title for the administrator; 0-16 characters, emoji are not allowed */
    custom_title: string
  }
  banChatSenderChat: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier of the target sender chat */
    sender_chat_id: number
  }
  unbanChatSenderChat: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier of the target sender chat */
    sender_chat_id: number
  }
  setChatPermissions: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
    /** An object for new default chat permissions */
    permissions: Types.ChatPermissions
    /** Pass _True_ if chat permissions are set independently. Otherwise, the _can\_send\_other\_messages_ and _can\_add\_web\_page\_previews_ permissions will imply the _can\_send\_messages_, _can\_send\_audios_, _can\_send\_documents_, _can\_send\_photos_, _can\_send\_videos_, _can\_send\_video\_notes_, and _can\_send\_voice\_notes_ permissions; the _can\_send\_polls_ permission will imply the _can\_send\_messages_ permission. */
    use_independent_chat_permissions?: boolean
  }
  exportChatInviteLink: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
  }
  createChatInviteLink: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Invite link name; 0-32 characters */
    name?: string
    /** Point in time (Unix timestamp) when the link will expire */
    expire_date?: number
    /** The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999 */
    member_limit?: number
    /** _True_, if users joining the chat via the link need to be approved by chat administrators. If _True_, _member\_limit_ can't be specified */
    creates_join_request?: boolean
  }
  editChatInviteLink: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** The invite link to edit */
    invite_link: string
    /** Invite link name; 0-32 characters */
    name?: string
    /** Point in time (Unix timestamp) when the link will expire */
    expire_date?: number
    /** The maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999 */
    member_limit?: number
    /** _True_, if users joining the chat via the link need to be approved by chat administrators. If _True_, _member\_limit_ can't be specified */
    creates_join_request?: boolean
  }
  createChatSubscriptionInviteLink: {
    /** Unique identifier for the target channel chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Invite link name; 0-32 characters */
    name?: string
    /** The number of seconds the subscription will be active for before the next payment. Currently, it must always be 2592000 (30 days). */
    subscription_period: number
    /** The amount of Telegram Stars a user must pay initially and after each subsequent subscription period to be a member of the chat; 1-10000 */
    subscription_price: number
  }
  editChatSubscriptionInviteLink: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** The invite link to edit */
    invite_link: string
    /** Invite link name; 0-32 characters */
    name?: string
  }
  revokeChatInviteLink: {
    /** Unique identifier of the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** The invite link to revoke */
    invite_link: string
  }
  approveChatJoinRequest: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier of the target user */
    user_id: number
  }
  declineChatJoinRequest: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier of the target user */
    user_id: number
  }
  setChatPhoto: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** New chat photo, uploaded using multipart/form-data */
    photo: File.InputFile
  }
  deleteChatPhoto: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
  }
  setChatTitle: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** New chat title, 1-128 characters */
    title: string
  }
  setChatDescription: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** New chat description, 0-255 characters */
    description?: string
  }
  pinChatMessage: {
    /** Unique identifier of the business connection on behalf of which the message will be pinned */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Identifier of a message to pin */
    message_id: number
    /** Pass _True_ if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats. */
    disable_notification?: boolean
  }
  unpinChatMessage: {
    /** Unique identifier of the business connection on behalf of which the message will be unpinned */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Identifier of the message to unpin. Required if _business\_connection\_id_ is specified. If not specified, the most recent pinned message (by sending date) will be unpinned. */
    message_id?: number
  }
  unpinAllChatMessages: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
  }
  leaveChat: {
    /** Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`). Channel direct messages chats aren't supported; leave the corresponding channel instead. */
    chat_id: number | string
  }
  getChat: {
    /** Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`) */
    chat_id: number | string
  }
  getChatAdministrators: {
    /** Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`) */
    chat_id: number | string
  }
  getChatMemberCount: {
    /** Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`) */
    chat_id: number | string
  }
  getChatMember: {
    /** Unique identifier for the target chat or username of the target supergroup or channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier of the target user */
    user_id: number
  }
  setChatStickerSet: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
    /** Name of the sticker set to be set as the group sticker set */
    sticker_set_name: string
  }
  deleteChatStickerSet: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
  }
  getForumTopicIconStickers: void | Record<string, never>
  createForumTopic: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
    /** Topic name, 1-128 characters */
    name: string
    /** Color of the topic icon in RGB format. Currently, must be one of 7322096 (0x6FB9F0), 16766590 (0xFFD67E), 13338331 (0xCB86DB), 9367192 (0x8EEE98), 16749490 (0xFF93B2), or 16478047 (0xFB6F5F) */
    icon_color?: number
    /** Unique identifier of the custom emoji shown as the topic icon. Use [getForumTopicIconStickers](https://core.telegram.org/bots/api#getforumtopiciconstickers) to get all allowed custom emoji identifiers. */
    icon_custom_emoji_id?: string
  }
  editForumTopic: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread of the forum topic */
    message_thread_id: number
    /** New topic name, 0-128 characters. If not specified or empty, the current name of the topic will be kept */
    name?: string
    /** New unique identifier of the custom emoji shown as the topic icon. Use [getForumTopicIconStickers](https://core.telegram.org/bots/api#getforumtopiciconstickers) to get all allowed custom emoji identifiers. Pass an empty string to remove the icon. If not specified, the current icon will be kept */
    icon_custom_emoji_id?: string
  }
  closeForumTopic: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread of the forum topic */
    message_thread_id: number
  }
  reopenForumTopic: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread of the forum topic */
    message_thread_id: number
  }
  deleteForumTopic: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread of the forum topic */
    message_thread_id: number
  }
  unpinAllForumTopicMessages: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread of the forum topic */
    message_thread_id: number
  }
  editGeneralForumTopic: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
    /** New topic name, 1-128 characters */
    name: string
  }
  closeGeneralForumTopic: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
  }
  reopenGeneralForumTopic: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
  }
  hideGeneralForumTopic: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
  }
  unhideGeneralForumTopic: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
  }
  unpinAllGeneralForumTopicMessages: {
    /** Unique identifier for the target chat or username of the target supergroup (in the format `@supergroupusername`) */
    chat_id: number | string
  }
  answerCallbackQuery: {
    /** Unique identifier for the query to be answered */
    callback_query_id: string
    /** Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters */
    text?: string
    /** If _True_, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to _false_. */
    show_alert?: boolean
    /**
     * URL that will be opened by the user's client. If you have created a [Game](https://core.telegram.org/bots/api#game) and accepted the conditions via [@BotFather](https://t.me/botfather), specify the URL that opens your game - note that this will only work if the query comes from a [_callback\_game_](https://core.telegram.org/bots/api#inlinekeyboardbutton) button.
     *
     * Otherwise, you may use links like `t.me/your_bot?start=XXXX` that open your bot with a parameter.
     */
    url?: string
    /** The maximum amount of time in seconds that the result of the callback query may be cached client-side. Telegram apps will support caching starting in version 3.14. Defaults to 0. */
    cache_time?: number
  }
  getUserChatBoosts: {
    /** Unique identifier for the chat or username of the channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier of the target user */
    user_id: number
  }
  getBusinessConnection: {
    /** Unique identifier of the business connection */
    business_connection_id: string
  }
  setMyCommands: {
    /** An array of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified. */
    commands: Array<Types.BotCommand>
    /** An object, describing scope of users for which the commands are relevant. Defaults to [BotCommandScopeDefault](https://core.telegram.org/bots/api#botcommandscopedefault). */
    scope?: Types.BotCommandScope
    /** A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands */
    language_code?: string
  }
  deleteMyCommands: void | {
    /** An object, describing scope of users for which the commands are relevant. Defaults to [BotCommandScopeDefault](https://core.telegram.org/bots/api#botcommandscopedefault). */
    scope?: Types.BotCommandScope
    /** A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands */
    language_code?: string
  }
  getMyCommands: void | {
    /** An object, describing scope of users. Defaults to [BotCommandScopeDefault](https://core.telegram.org/bots/api#botcommandscopedefault). */
    scope?: Types.BotCommandScope
    /** A two-letter ISO 639-1 language code or an empty string */
    language_code?: string
  }
  setMyName: void | {
    /** New bot name; 0-64 characters. Pass an empty string to remove the dedicated name for the given language. */
    name?: string
    /** A two-letter ISO 639-1 language code. If empty, the name will be shown to all users for whose language there is no dedicated name. */
    language_code?: string
  }
  getMyName: void | {
    /** A two-letter ISO 639-1 language code or an empty string */
    language_code?: string
  }
  setMyDescription: void | {
    /** New bot description; 0-512 characters. Pass an empty string to remove the dedicated description for the given language. */
    description?: string
    /** A two-letter ISO 639-1 language code. If empty, the description will be applied to all users for whose language there is no dedicated description. */
    language_code?: string
  }
  getMyDescription: void | {
    /** A two-letter ISO 639-1 language code or an empty string */
    language_code?: string
  }
  setMyShortDescription: void | {
    /** New short description for the bot; 0-120 characters. Pass an empty string to remove the dedicated short description for the given language. */
    short_description?: string
    /** A two-letter ISO 639-1 language code. If empty, the short description will be applied to all users for whose language there is no dedicated short description. */
    language_code?: string
  }
  getMyShortDescription: void | {
    /** A two-letter ISO 639-1 language code or an empty string */
    language_code?: string
  }
  setChatMenuButton: void | {
    /** Unique identifier for the target private chat. If not specified, default bot's menu button will be changed */
    chat_id?: number
    /** An object for the bot's new menu button. Defaults to [MenuButtonDefault](https://core.telegram.org/bots/api#menubuttondefault) */
    menu_button?: Types.MenuButton
  }
  getChatMenuButton: void | {
    /** Unique identifier for the target private chat. If not specified, default bot's menu button will be returned */
    chat_id?: number
  }
  setMyDefaultAdministratorRights: void | {
    /** An object describing new default administrator rights. If not specified, the default administrator rights will be cleared. */
    rights?: Types.ChatAdministratorRights
    /** Pass _True_ to change the default administrator rights of the bot in channels. Otherwise, the default administrator rights of the bot for groups and supergroups will be changed. */
    for_channels?: boolean
  }
  getMyDefaultAdministratorRights: void | {
    /** Pass _True_ to get default administrator rights of the bot in channels. Otherwise, default administrator rights of the bot for groups and supergroups will be returned. */
    for_channels?: boolean
  }
  getAvailableGifts: void | Record<string, never>
  sendGift: {
    /** Required if _chat\_id_ is not specified. Unique identifier of the target user who will receive the gift. */
    user_id?: number
    /** Required if _user\_id_ is not specified. Unique identifier for the chat or username of the channel (in the format `@channelusername`) that will receive the gift. */
    chat_id?: number | string
    /** Identifier of the gift; limited gifts can't be sent to channel chats */
    gift_id: string
    /** Pass _True_ to pay for the gift upgrade from the bot's balance, thereby making the upgrade free for the receiver */
    pay_for_upgrade?: boolean
    /** Text that will be shown along with the gift; 0-128 characters */
    text?: string
    /** Mode for parsing entities in the text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, and “custom\_emoji” are ignored. */
    text_parse_mode?: string
    /** An array of special entities that appear in the gift text. It can be specified instead of _text\_parse\_mode_. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, and “custom\_emoji” are ignored. */
    text_entities?: Array<Types.MessageEntity>
  }
  giftPremiumSubscription: {
    /** Unique identifier of the target user who will receive a Telegram Premium subscription */
    user_id: number
    /** Number of months the Telegram Premium subscription will be active for the user; must be one of 3, 6, or 12 */
    month_count: number
    /** Number of Telegram Stars to pay for the Telegram Premium subscription; must be 1000 for 3 months, 1500 for 6 months, and 2500 for 12 months */
    star_count: number
    /** Text that will be shown along with the service message about the subscription; 0-128 characters */
    text?: string
    /** Mode for parsing entities in the text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, and “custom\_emoji” are ignored. */
    text_parse_mode?: string
    /** An array of special entities that appear in the gift text. It can be specified instead of _text\_parse\_mode_. Entities other than “bold”, “italic”, “underline”, “strikethrough”, “spoiler”, and “custom\_emoji” are ignored. */
    text_entities?: Array<Types.MessageEntity>
  }
  verifyUser: {
    /** Unique identifier of the target user */
    user_id: number
    /** Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description. */
    custom_description?: string
  }
  verifyChat: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`). Channel direct messages chats can't be verified. */
    chat_id: number | string
    /** Custom description for the verification; 0-70 characters. Must be empty if the organization isn't allowed to provide a custom verification description. */
    custom_description?: string
  }
  removeUserVerification: {
    /** Unique identifier of the target user */
    user_id: number
  }
  removeChatVerification: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
  }
  readBusinessMessage: {
    /** Unique identifier of the business connection on behalf of which to read the message */
    business_connection_id: string
    /** Unique identifier of the chat in which the message was received. The chat must have been active in the last 24 hours. */
    chat_id: number
    /** Unique identifier of the message to mark as read */
    message_id: number
  }
  deleteBusinessMessages: {
    /** Unique identifier of the business connection on behalf of which to delete the messages */
    business_connection_id: string
    /** An array of 1-100 identifiers of messages to delete. All messages must be from the same chat. See [deleteMessage](https://core.telegram.org/bots/api#deletemessage) for limitations on which messages can be deleted */
    message_ids: Array<number>
  }
  setBusinessAccountName: {
    /** Unique identifier of the business connection */
    business_connection_id: string
    /** The new value of the first name for the business account; 1-64 characters */
    first_name: string
    /** The new value of the last name for the business account; 0-64 characters */
    last_name?: string
  }
  setBusinessAccountUsername: {
    /** Unique identifier of the business connection */
    business_connection_id: string
    /** The new value of the username for the business account; 0-32 characters */
    username?: string
  }
  setBusinessAccountBio: {
    /** Unique identifier of the business connection */
    business_connection_id: string
    /** The new value of the bio for the business account; 0-140 characters */
    bio?: string
  }
  setBusinessAccountProfilePhoto: {
    /** Unique identifier of the business connection */
    business_connection_id: string
    /** The new profile photo to set */
    photo: Types.InputProfilePhoto
    /** Pass _True_ to set the public photo, which will be visible even if the main photo is hidden by the business account's privacy settings. An account can have only one public photo. */
    is_public?: boolean
  }
  removeBusinessAccountProfilePhoto: {
    /** Unique identifier of the business connection */
    business_connection_id: string
    /** Pass _True_ to remove the public photo, which is visible even if the main photo is hidden by the business account's privacy settings. After the main photo is removed, the previous profile photo (if present) becomes the main photo. */
    is_public?: boolean
  }
  setBusinessAccountGiftSettings: {
    /** Unique identifier of the business connection */
    business_connection_id: string
    /** Pass _True_, if a button for sending a gift to the user or by the business account must always be shown in the input field */
    show_gift_button: boolean
    /** Types of gifts accepted by the business account */
    accepted_gift_types: Types.AcceptedGiftTypes
  }
  getBusinessAccountStarBalance: {
    /** Unique identifier of the business connection */
    business_connection_id: string
  }
  transferBusinessAccountStars: {
    /** Unique identifier of the business connection */
    business_connection_id: string
    /** Number of Telegram Stars to transfer; 1-10000 */
    star_count: number
  }
  getBusinessAccountGifts: {
    /** Unique identifier of the business connection */
    business_connection_id: string
    /** Pass _True_ to exclude gifts that aren't saved to the account's profile page */
    exclude_unsaved?: boolean
    /** Pass _True_ to exclude gifts that are saved to the account's profile page */
    exclude_saved?: boolean
    /** Pass _True_ to exclude gifts that can be purchased an unlimited number of times */
    exclude_unlimited?: boolean
    /** Pass _True_ to exclude gifts that can be purchased a limited number of times and can be upgraded to unique */
    exclude_limited_upgradable?: boolean
    /** Pass _True_ to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique */
    exclude_limited_non_upgradable?: boolean
    /** Pass _True_ to exclude unique gifts */
    exclude_unique?: boolean
    /** Pass _True_ to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram */
    exclude_from_blockchain?: boolean
    /** Pass _True_ to sort results by gift price instead of send date. Sorting is applied before pagination. */
    sort_by_price?: boolean
    /** Offset of the first entry to return as received from the previous request; use empty string to get the first chunk of results */
    offset?: string
    /** The maximum number of gifts to be returned; 1-100. Defaults to 100 */
    limit?: number
  }
  getUserGifts: {
    /** Unique identifier of the user */
    user_id: number
    /** Pass _True_ to exclude gifts that can be purchased an unlimited number of times */
    exclude_unlimited?: boolean
    /** Pass _True_ to exclude gifts that can be purchased a limited number of times and can be upgraded to unique */
    exclude_limited_upgradable?: boolean
    /** Pass _True_ to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique */
    exclude_limited_non_upgradable?: boolean
    /** Pass _True_ to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram */
    exclude_from_blockchain?: boolean
    /** Pass _True_ to exclude unique gifts */
    exclude_unique?: boolean
    /** Pass _True_ to sort results by gift price instead of send date. Sorting is applied before pagination. */
    sort_by_price?: boolean
    /** Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results */
    offset?: string
    /** The maximum number of gifts to be returned; 1-100. Defaults to 100 */
    limit?: number
  }
  getChatGifts: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Pass _True_ to exclude gifts that aren't saved to the chat's profile page. Always _True_, unless the bot has the _can\_post\_messages_ administrator right in the channel. */
    exclude_unsaved?: boolean
    /** Pass _True_ to exclude gifts that are saved to the chat's profile page. Always _False_, unless the bot has the _can\_post\_messages_ administrator right in the channel. */
    exclude_saved?: boolean
    /** Pass _True_ to exclude gifts that can be purchased an unlimited number of times */
    exclude_unlimited?: boolean
    /** Pass _True_ to exclude gifts that can be purchased a limited number of times and can be upgraded to unique */
    exclude_limited_upgradable?: boolean
    /** Pass _True_ to exclude gifts that can be purchased a limited number of times and can't be upgraded to unique */
    exclude_limited_non_upgradable?: boolean
    /** Pass _True_ to exclude gifts that were assigned from the TON blockchain and can't be resold or transferred in Telegram */
    exclude_from_blockchain?: boolean
    /** Pass _True_ to exclude unique gifts */
    exclude_unique?: boolean
    /** Pass _True_ to sort results by gift price instead of send date. Sorting is applied before pagination. */
    sort_by_price?: boolean
    /** Offset of the first entry to return as received from the previous request; use an empty string to get the first chunk of results */
    offset?: string
    /** The maximum number of gifts to be returned; 1-100. Defaults to 100 */
    limit?: number
  }
  convertGiftToStars: {
    /** Unique identifier of the business connection */
    business_connection_id: string
    /** Unique identifier of the regular gift that should be converted to Telegram Stars */
    owned_gift_id: string
  }
  upgradeGift: {
    /** Unique identifier of the business connection */
    business_connection_id: string
    /** Unique identifier of the regular gift that should be upgraded to a unique one */
    owned_gift_id: string
    /** Pass _True_ to keep the original gift text, sender and receiver in the upgraded gift */
    keep_original_details?: boolean
    /** The amount of Telegram Stars that will be paid for the upgrade from the business account balance. If `gift.prepaid_upgrade_star_count > 0`, then pass 0, otherwise, the _can\_transfer\_stars_ business bot right is required and `gift.upgrade_star_count` must be passed. */
    star_count?: number
  }
  transferGift: {
    /** Unique identifier of the business connection */
    business_connection_id: string
    /** Unique identifier of the regular gift that should be transferred */
    owned_gift_id: string
    /** Unique identifier of the chat which will own the gift. The chat must be active in the last 24 hours. */
    new_owner_chat_id: number
    /** The amount of Telegram Stars that will be paid for the transfer from the business account balance. If positive, then the _can\_transfer\_stars_ business bot right is required. */
    star_count?: number
  }
  postStory: {
    /** Unique identifier of the business connection */
    business_connection_id: string
    /** Content of the story */
    content: Types.InputStoryContent
    /** Period after which the story is moved to the archive, in seconds; must be one of `6 * 3600`, `12 * 3600`, `86400`, or `2 * 86400` */
    active_period: number
    /** Caption of the story, 0-2048 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the story caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** An array of special entities that appear in the caption, which can be specified instead of _parse\_mode_ */
    caption_entities?: Array<Types.MessageEntity>
    /** An array of clickable areas to be shown on the story */
    areas?: Array<Types.StoryArea>
    /** Pass _True_ to keep the story accessible after it expires */
    post_to_chat_page?: boolean
    /** Pass _True_ if the content of the story must be protected from forwarding and screenshotting */
    protect_content?: boolean
  }
  repostStory: {
    /** Unique identifier of the business connection */
    business_connection_id: string
    /** Unique identifier of the chat which posted the story that should be reposted */
    from_chat_id: number
    /** Unique identifier of the story that should be reposted */
    from_story_id: number
    /** Period after which the story is moved to the archive, in seconds; must be one of `6 * 3600`, `12 * 3600`, `86400`, or `2 * 86400` */
    active_period: number
    /** Pass _True_ to keep the story accessible after it expires */
    post_to_chat_page?: boolean
    /** Pass _True_ if the content of the story must be protected from forwarding and screenshotting */
    protect_content?: boolean
  }
  editStory: {
    /** Unique identifier of the business connection */
    business_connection_id: string
    /** Unique identifier of the story to edit */
    story_id: number
    /** Content of the story */
    content: Types.InputStoryContent
    /** Caption of the story, 0-2048 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the story caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** An array of special entities that appear in the caption, which can be specified instead of _parse\_mode_ */
    caption_entities?: Array<Types.MessageEntity>
    /** An array of clickable areas to be shown on the story */
    areas?: Array<Types.StoryArea>
  }
  deleteStory: {
    /** Unique identifier of the business connection */
    business_connection_id: string
    /** Unique identifier of the story to delete */
    story_id: number
  }
  editMessageText: {
    /** Unique identifier of the business connection on behalf of which the message to be edited was sent */
    business_connection_id?: string
    /** Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id?: number | string
    /** Required if _inline\_message\_id_ is not specified. Identifier of the message to edit */
    message_id?: number
    /** Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message */
    inline_message_id?: string
    /** New text of the message, 1-4096 characters after entities parsing */
    text: string
    /** Mode for parsing entities in the message text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** An array of special entities that appear in message text, which can be specified instead of _parse\_mode_ */
    entities?: Array<Types.MessageEntity>
    /** Link preview generation options for the message */
    link_preview_options?: Types.LinkPreviewOptions
    /** An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). */
    reply_markup?: Types.InlineKeyboardMarkup
  }
  editMessageCaption: void | {
    /** Unique identifier of the business connection on behalf of which the message to be edited was sent */
    business_connection_id?: string
    /** Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id?: number | string
    /** Required if _inline\_message\_id_ is not specified. Identifier of the message to edit */
    message_id?: number
    /** Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message */
    inline_message_id?: string
    /** New caption of the message, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the message caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** An array of special entities that appear in the caption, which can be specified instead of _parse\_mode_ */
    caption_entities?: Array<Types.MessageEntity>
    /** Pass _True_, if the caption must be shown above the message media. Supported only for animation, photo and video messages. */
    show_caption_above_media?: boolean
    /** An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). */
    reply_markup?: Types.InlineKeyboardMarkup
  }
  editMessageMedia: {
    /** Unique identifier of the business connection on behalf of which the message to be edited was sent */
    business_connection_id?: string
    /** Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id?: number | string
    /** Required if _inline\_message\_id_ is not specified. Identifier of the message to edit */
    message_id?: number
    /** Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message */
    inline_message_id?: string
    /** An object for a new media content of the message */
    media: Types.InputMedia
    /** An object for a new [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). */
    reply_markup?: Types.InlineKeyboardMarkup
  }
  editMessageLiveLocation: {
    /** Unique identifier of the business connection on behalf of which the message to be edited was sent */
    business_connection_id?: string
    /** Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id?: number | string
    /** Required if _inline\_message\_id_ is not specified. Identifier of the message to edit */
    message_id?: number
    /** Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message */
    inline_message_id?: string
    /** Latitude of new location */
    latitude: number
    /** Longitude of new location */
    longitude: number
    /** New period in seconds during which the location can be updated, starting from the message send date. If 0x7FFFFFFF is specified, then the location can be updated forever. Otherwise, the new value must not exceed the current _live\_period_ by more than a day, and the live location expiration date must remain within the next 90 days. If not specified, then _live\_period_ remains unchanged */
    live_period?: number
    /** The radius of uncertainty for the location, measured in meters; 0-1500 */
    horizontal_accuracy?: number
    /** Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. */
    heading?: number
    /** The maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. */
    proximity_alert_radius?: number
    /** An object for a new [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). */
    reply_markup?: Types.InlineKeyboardMarkup
  }
  stopMessageLiveLocation: void | {
    /** Unique identifier of the business connection on behalf of which the message to be edited was sent */
    business_connection_id?: string
    /** Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id?: number | string
    /** Required if _inline\_message\_id_ is not specified. Identifier of the message with live location to stop */
    message_id?: number
    /** Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message */
    inline_message_id?: string
    /** An object for a new [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). */
    reply_markup?: Types.InlineKeyboardMarkup
  }
  editMessageChecklist: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id: string
    /** Unique identifier for the target chat */
    chat_id: number
    /** Unique identifier for the target message */
    message_id: number
    /** An object for the new checklist */
    checklist: Types.InputChecklist
    /** An object for the new inline keyboard for the message */
    reply_markup?: Types.InlineKeyboardMarkup
  }
  editMessageReplyMarkup: void | {
    /** Unique identifier of the business connection on behalf of which the message to be edited was sent */
    business_connection_id?: string
    /** Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id?: number | string
    /** Required if _inline\_message\_id_ is not specified. Identifier of the message to edit */
    message_id?: number
    /** Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message */
    inline_message_id?: string
    /** An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). */
    reply_markup?: Types.InlineKeyboardMarkup
  }
  stopPoll: {
    /** Unique identifier of the business connection on behalf of which the message to be edited was sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Identifier of the original message with the poll */
    message_id: number
    /** An object for a new message [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). */
    reply_markup?: Types.InlineKeyboardMarkup
  }
  approveSuggestedPost: {
    /** Unique identifier for the target direct messages chat */
    chat_id: number
    /** Identifier of a suggested post message to approve */
    message_id: number
    /** Point in time (Unix timestamp) when the post is expected to be published; omit if the date has already been specified when the suggested post was created. If specified, then the date must be not more than 2678400 seconds (30 days) in the future */
    send_date?: number
  }
  declineSuggestedPost: {
    /** Unique identifier for the target direct messages chat */
    chat_id: number
    /** Identifier of a suggested post message to decline */
    message_id: number
    /** Comment for the creator of the suggested post; 0-128 characters */
    comment?: string
  }
  deleteMessage: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Identifier of the message to delete */
    message_id: number
  }
  deleteMessages: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** An array of 1-100 identifiers of messages to delete. See [deleteMessage](https://core.telegram.org/bots/api#deletemessage) for limitations on which messages can be deleted */
    message_ids: Array<number>
  }
  sendSticker: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** Sticker to send. Pass a file\_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP sticker from the Internet, or upload a new .WEBP, .TGS, or .WEBM sticker using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files). Video and animated stickers can't be sent via an HTTP URL. */
    sticker: File.InputFile | string
    /** Emoji associated with the sticker; only for just uploaded stickers */
    emoji?: string
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** Additional interface options. An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards), [custom reply keyboard](https://core.telegram.org/bots/features#keyboards), instructions to remove a reply keyboard or to force a reply from the user */
    reply_markup?: Types.InlineKeyboardMarkup | Types.ReplyKeyboardMarkup | Types.ReplyKeyboardRemove | Types.ForceReply
  }
  getStickerSet: {
    /** Name of the sticker set */
    name: string
  }
  getCustomEmojiStickers: {
    /** An array of custom emoji identifiers. At most 200 custom emoji identifiers can be specified. */
    custom_emoji_ids: Array<string>
  }
  uploadStickerFile: {
    /** User identifier of sticker file owner */
    user_id: number
    /** A file with the sticker in .WEBP, .PNG, .TGS, or .WEBM format. See [](https://core.telegram.org/stickers)[https://core.telegram.org/stickers](https://core.telegram.org/stickers) for technical requirements. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    sticker: File.InputFile
    /** Format of the sticker, must be one of “static”, “animated”, “video” */
    sticker_format: string
  }
  createNewStickerSet: {
    /** User identifier of created sticker set owner */
    user_id: number
    /** Short name of sticker set, to be used in `t.me/addstickers/` URLs (e.g., _animals_). Can contain only English letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in `"_by_<bot_username>"`. `<bot_username>` is case insensitive. 1-64 characters. */
    name: string
    /** Sticker set title, 1-64 characters */
    title: string
    /** An array of 1-50 initial stickers to be added to the sticker set */
    stickers: Array<Types.InputSticker>
    /** Type of stickers in the set, pass “regular”, “mask”, or “custom\_emoji”. By default, a regular sticker set is created. */
    sticker_type?: string
    /** Pass _True_ if stickers in the sticker set must be repainted to the color of text when used in messages, the accent color if used as emoji status, white on chat photos, or another appropriate color based on context; for custom emoji sticker sets only */
    needs_repainting?: boolean
  }
  addStickerToSet: {
    /** User identifier of sticker set owner */
    user_id: number
    /** Sticker set name */
    name: string
    /** An object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set isn't changed. */
    sticker: Types.InputSticker
  }
  setStickerPositionInSet: {
    /** File identifier of the sticker */
    sticker: string
    /** New sticker position in the set, zero-based */
    position: number
  }
  deleteStickerFromSet: {
    /** File identifier of the sticker */
    sticker: string
  }
  replaceStickerInSet: {
    /** User identifier of the sticker set owner */
    user_id: number
    /** Sticker set name */
    name: string
    /** File identifier of the replaced sticker */
    old_sticker: string
    /** An object with information about the added sticker. If exactly the same sticker had already been added to the set, then the set remains unchanged. */
    sticker: Types.InputSticker
  }
  setStickerEmojiList: {
    /** File identifier of the sticker */
    sticker: string
    /** An array of 1-20 emoji associated with the sticker */
    emoji_list: Array<string>
  }
  setStickerKeywords: {
    /** File identifier of the sticker */
    sticker: string
    /** An array of 0-20 search keywords for the sticker with total length of up to 64 characters */
    keywords?: Array<string>
  }
  setStickerMaskPosition: {
    /** File identifier of the sticker */
    sticker: string
    /** An object with the position where the mask should be placed on faces. Omit the parameter to remove the mask position. */
    mask_position?: Types.MaskPosition
  }
  setStickerSetTitle: {
    /** Sticker set name */
    name: string
    /** Sticker set title, 1-64 characters */
    title: string
  }
  setStickerSetThumbnail: {
    /** Sticker set name */
    name: string
    /** User identifier of the sticker set owner */
    user_id: number
    /** A **.WEBP** or **.PNG** image with the thumbnail, must be up to 128 kilobytes in size and have a width and height of exactly 100px, or a **.TGS** animation with a thumbnail up to 32 kilobytes in size (see [](https://core.telegram.org/stickers#animation-requirements)[https://core.telegram.org/stickers#animation-requirements](https://core.telegram.org/stickers#animation-requirements) for animated sticker technical requirements), or a **.WEBM** video with the thumbnail up to 32 kilobytes in size; see [](https://core.telegram.org/stickers#video-requirements)[https://core.telegram.org/stickers#video-requirements](https://core.telegram.org/stickers#video-requirements) for video sticker technical requirements. Pass a _file\_id_ as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. [More information on Sending Files »](https://core.telegram.org/bots/api#sending-files). Animated and video sticker set thumbnails can't be uploaded via HTTP URL. If omitted, then the thumbnail is dropped and the first sticker is used as the thumbnail. */
    thumbnail?: File.InputFile | string
    /** Format of the thumbnail, must be one of “static” for a **.WEBP** or **.PNG** image, “animated” for a **.TGS** animation, or “video” for a **.WEBM** video */
    format: string
  }
  setCustomEmojiStickerSetThumbnail: {
    /** Sticker set name */
    name: string
    /** Custom emoji identifier of a sticker from the sticker set; pass an empty string to drop the thumbnail and use the first sticker as the thumbnail. */
    custom_emoji_id?: string
  }
  deleteStickerSet: {
    /** Sticker set name */
    name: string
  }
  answerInlineQuery: {
    /** Unique identifier for the answered query */
    inline_query_id: string
    /** An array of results for the inline query */
    results: Array<Types.InlineQueryResult>
    /** The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300. */
    cache_time?: number
    /** Pass _True_ if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query. */
    is_personal?: boolean
    /** Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don't support pagination. Offset length can't exceed 64 bytes. */
    next_offset?: string
    /** An object describing a button to be shown above inline query results */
    button?: Types.InlineQueryResultsButton
  }
  answerWebAppQuery: {
    /** Unique identifier for the query to be answered */
    web_app_query_id: string
    /** An object describing the message to be sent */
    result: Types.InlineQueryResult
  }
  savePreparedInlineMessage: {
    /** Unique identifier of the target user that can use the prepared message */
    user_id: number
    /** An object describing the message to be sent */
    result: Types.InlineQueryResult
    /** Pass _True_ if the message can be sent to private chats with users */
    allow_user_chats?: boolean
    /** Pass _True_ if the message can be sent to private chats with bots */
    allow_bot_chats?: boolean
    /** Pass _True_ if the message can be sent to group and supergroup chats */
    allow_group_chats?: boolean
    /** Pass _True_ if the message can be sent to channel chats */
    allow_channel_chats?: boolean
  }
  sendInvoice: {
    /** Unique identifier for the target chat or username of the target channel (in the format `@channelusername`) */
    chat_id: number | string
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Identifier of the direct messages topic to which the message will be sent; required if the message is sent to a direct messages chat */
    direct_messages_topic_id?: number
    /** Product name, 1-32 characters */
    title: string
    /** Product description, 1-255 characters */
    description: string
    /** Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes. */
    payload: string
    /** Payment provider token, obtained via [@BotFather](https://t.me/botfather). Pass an empty string for payments in [Telegram Stars](https://t.me/BotNews/90). */
    provider_token?: string
    /** Three-letter ISO 4217 currency code, see [more on currencies](https://core.telegram.org/bots/payments#supported-currencies). Pass “XTR” for payments in [Telegram Stars](https://t.me/BotNews/90). */
    currency: string
    /** Price breakdown, an array of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in [Telegram Stars](https://t.me/BotNews/90). */
    prices: Array<Types.LabeledPrice>
    /** The maximum accepted amount for tips in the _smallest units_ of the currency (integer, **not** float/double). For example, for a maximum tip of `US$ 1.45` pass `max_tip_amount = 145`. See the _exp_ parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in [Telegram Stars](https://t.me/BotNews/90). */
    max_tip_amount?: number
    /** An array of suggested amounts of tips in the _smallest units_ of the currency (integer, **not** float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed _max\_tip\_amount_. */
    suggested_tip_amounts?: Array<number>
    /** Unique deep-linking parameter. If left empty, **forwarded copies** of the sent message will have a _Pay_ button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a _URL_ button with a deep link to the bot (instead of a _Pay_ button), with the value used as the start parameter */
    start_parameter?: string
    /** JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider. */
    provider_data?: string
    /** URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for. */
    photo_url?: string
    /** Photo size in bytes */
    photo_size?: number
    /** Photo width */
    photo_width?: number
    /** Photo height */
    photo_height?: number
    /** Pass _True_ if you require the user's full name to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). */
    need_name?: boolean
    /** Pass _True_ if you require the user's phone number to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). */
    need_phone_number?: boolean
    /** Pass _True_ if you require the user's email address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). */
    need_email?: boolean
    /** Pass _True_ if you require the user's shipping address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). */
    need_shipping_address?: boolean
    /** Pass _True_ if the user's phone number should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). */
    send_phone_number_to_provider?: boolean
    /** Pass _True_ if the user's email address should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). */
    send_email_to_provider?: boolean
    /** Pass _True_ if the final price depends on the shipping method. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). */
    is_flexible?: boolean
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** An object containing the parameters of the suggested post to send; for direct messages chats only. If the message is sent as a reply to another suggested post, then that suggested post is automatically declined. */
    suggested_post_parameters?: Types.SuggestedPostParameters
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). If empty, one 'Pay `total price`' button will be shown. If not empty, the first button must be a Pay button. */
    reply_markup?: Types.InlineKeyboardMarkup
  }
  createInvoiceLink: {
    /** Unique identifier of the business connection on behalf of which the link will be created. For payments in [Telegram Stars](https://t.me/BotNews/90) only. */
    business_connection_id?: string
    /** Product name, 1-32 characters */
    title: string
    /** Product description, 1-255 characters */
    description: string
    /** Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use it for your internal processes. */
    payload: string
    /** Payment provider token, obtained via [@BotFather](https://t.me/botfather). Pass an empty string for payments in [Telegram Stars](https://t.me/BotNews/90). */
    provider_token?: string
    /** Three-letter ISO 4217 currency code, see [more on currencies](https://core.telegram.org/bots/payments#supported-currencies). Pass “XTR” for payments in [Telegram Stars](https://t.me/BotNews/90). */
    currency: string
    /** Price breakdown, an array of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.). Must contain exactly one item for payments in [Telegram Stars](https://t.me/BotNews/90). */
    prices: Array<Types.LabeledPrice>
    /** The number of seconds the subscription will be active for before the next payment. The currency must be set to “XTR” (Telegram Stars) if the parameter is used. Currently, it must always be 2592000 (30 days) if specified. Any number of subscriptions can be active for a given bot at the same time, including multiple concurrent subscriptions from the same user. Subscription price must no exceed 10000 Telegram Stars. */
    subscription_period?: number
    /** The maximum accepted amount for tips in the _smallest units_ of the currency (integer, **not** float/double). For example, for a maximum tip of `US$ 1.45` pass `max_tip_amount = 145`. See the _exp_ parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0. Not supported for payments in [Telegram Stars](https://t.me/BotNews/90). */
    max_tip_amount?: number
    /** An array of suggested amounts of tips in the _smallest units_ of the currency (integer, **not** float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed _max\_tip\_amount_. */
    suggested_tip_amounts?: Array<number>
    /** JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider. */
    provider_data?: string
    /** URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. */
    photo_url?: string
    /** Photo size in bytes */
    photo_size?: number
    /** Photo width */
    photo_width?: number
    /** Photo height */
    photo_height?: number
    /** Pass _True_ if you require the user's full name to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). */
    need_name?: boolean
    /** Pass _True_ if you require the user's phone number to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). */
    need_phone_number?: boolean
    /** Pass _True_ if you require the user's email address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). */
    need_email?: boolean
    /** Pass _True_ if you require the user's shipping address to complete the order. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). */
    need_shipping_address?: boolean
    /** Pass _True_ if the user's phone number should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). */
    send_phone_number_to_provider?: boolean
    /** Pass _True_ if the user's email address should be sent to the provider. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). */
    send_email_to_provider?: boolean
    /** Pass _True_ if the final price depends on the shipping method. Ignored for payments in [Telegram Stars](https://t.me/BotNews/90). */
    is_flexible?: boolean
  }
  answerShippingQuery: {
    /** Unique identifier for the query to be answered */
    shipping_query_id: string
    /** Pass _True_ if delivery to the specified address is possible and _False_ if there are any problems (for example, if delivery to the specified address is not possible) */
    ok: boolean
    /** Required if _ok_ is _True_. An array of available shipping options. */
    shipping_options?: Array<Types.ShippingOption>
    /** Required if _ok_ is _False_. Error message in human readable form that explains why it is impossible to complete the order (e.g. “Sorry, delivery to your desired address is unavailable”). Telegram will display this message to the user. */
    error_message?: string
  }
  answerPreCheckoutQuery: {
    /** Unique identifier for the query to be answered */
    pre_checkout_query_id: string
    /** Specify _True_ if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use _False_ if there are any problems. */
    ok: boolean
    /** Required if _ok_ is _False_. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. "Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!"). Telegram will display this message to the user. */
    error_message?: string
  }
  getMyStarBalance: void | Record<string, never>
  getStarTransactions: void | {
    /** Number of transactions to skip in the response */
    offset?: number
    /** The maximum number of transactions to be retrieved. Values between 1-100 are accepted. Defaults to 100. */
    limit?: number
  }
  refundStarPayment: {
    /** Identifier of the user whose payment will be refunded */
    user_id: number
    /** Telegram payment identifier */
    telegram_payment_charge_id: string
  }
  editUserStarSubscription: {
    /** Identifier of the user whose subscription will be edited */
    user_id: number
    /** Telegram payment identifier for the subscription */
    telegram_payment_charge_id: string
    /** Pass _True_ to cancel extension of the user subscription; the subscription must be active up to the end of the current subscription period. Pass _False_ to allow the user to re-enable a subscription that was previously canceled by the bot. */
    is_canceled: boolean
  }
  setPassportDataErrors: {
    /** User identifier */
    user_id: number
    /** An array describing the errors */
    errors: Array<Types.PassportElementError>
  }
  sendGame: {
    /** Unique identifier of the business connection on behalf of which the message will be sent */
    business_connection_id?: string
    /** Unique identifier for the target chat. Games can't be sent to channel direct messages chats and channel chats. */
    chat_id: number
    /** Unique identifier for the target message thread (topic) of a forum; for forum supergroups and private chats of bots with forum topic mode enabled only */
    message_thread_id?: number
    /** Short name of the game, serves as the unique identifier for the game. Set up your games via [@BotFather](https://t.me/botfather). */
    game_short_name: string
    /** Sends the message [silently](https://telegram.org/blog/channels-2-0#silent-messages). Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Protects the contents of the sent message from forwarding and saving */
    protect_content?: boolean
    /** Pass _True_ to allow up to 1000 messages per second, ignoring [broadcasting limits](https://core.telegram.org/bots/faq#how-can-i-message-all-of-my-bot-39s-subscribers-at-once) for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance */
    allow_paid_broadcast?: boolean
    /** Unique identifier of the message effect to be added to the message; for private chats only */
    message_effect_id?: string
    /** Description of the message to reply to */
    reply_parameters?: Types.ReplyParameters
    /** An object for an [inline keyboard](https://core.telegram.org/bots/features#inline-keyboards). If empty, one 'Play game\_title' button will be shown. If not empty, the first button must launch the game. */
    reply_markup?: Types.InlineKeyboardMarkup
  }
  setGameScore: {
    /** User identifier */
    user_id: number
    /** New score, must be non-negative */
    score: number
    /** Pass _True_ if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters */
    force?: boolean
    /** Pass _True_ if the game message should not be automatically edited to include the current scoreboard */
    disable_edit_message?: boolean
    /** Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat */
    chat_id?: number
    /** Required if _inline\_message\_id_ is not specified. Identifier of the sent message */
    message_id?: number
    /** Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message */
    inline_message_id?: string
  }
  getGameHighScores: {
    /** Target user id */
    user_id: number
    /** Required if _inline\_message\_id_ is not specified. Unique identifier for the target chat */
    chat_id?: number
    /** Required if _inline\_message\_id_ is not specified. Identifier of the sent message */
    message_id?: number
    /** Required if _chat\_id_ and _message\_id_ are not specified. Identifier of the inline message */
    inline_message_id?: string
  }
}

export interface MethodResults {
  getUpdates: Array<Types.Update>
  setWebhook: true
  deleteWebhook: true
  getWebhookInfo: Types.WebhookInfo
  getMe: Types.User
  logOut: true
  close: true
  sendMessage: Types.Message
  forwardMessage: Types.Message
  forwardMessages: Array<Types.MessageId>
  copyMessage: Types.MessageId
  copyMessages: Array<Types.MessageId>
  sendPhoto: Types.Message
  sendAudio: Types.Message
  sendDocument: Types.Message
  sendVideo: Types.Message
  sendAnimation: Types.Message
  sendVoice: Types.Message
  sendVideoNote: Types.Message
  sendPaidMedia: Types.Message
  sendMediaGroup: Array<Types.Message>
  sendLocation: Types.Message
  sendVenue: Types.Message
  sendContact: Types.Message
  sendPoll: Types.Message
  sendChecklist: Types.Message
  sendDice: Types.Message
  sendMessageDraft: true
  sendChatAction: true
  setMessageReaction: true
  getUserProfilePhotos: Types.UserProfilePhotos
  setUserEmojiStatus: true
  getFile: Types.File
  banChatMember: true
  unbanChatMember: true
  restrictChatMember: true
  promoteChatMember: true
  setChatAdministratorCustomTitle: true
  banChatSenderChat: true
  unbanChatSenderChat: true
  setChatPermissions: true
  exportChatInviteLink: string
  createChatInviteLink: Types.ChatInviteLink
  editChatInviteLink: Types.ChatInviteLink
  createChatSubscriptionInviteLink: Types.ChatInviteLink
  editChatSubscriptionInviteLink: Types.ChatInviteLink
  revokeChatInviteLink: Types.ChatInviteLink
  approveChatJoinRequest: true
  declineChatJoinRequest: true
  setChatPhoto: true
  deleteChatPhoto: true
  setChatTitle: true
  setChatDescription: true
  pinChatMessage: true
  unpinChatMessage: true
  unpinAllChatMessages: true
  leaveChat: true
  getChat: Types.ChatFullInfo
  getChatAdministrators: Array<Types.ChatMember>
  getChatMemberCount: number
  getChatMember: Types.ChatMember
  setChatStickerSet: true
  deleteChatStickerSet: true
  getForumTopicIconStickers: Array<Types.Sticker>
  createForumTopic: Types.ForumTopic
  editForumTopic: true
  closeForumTopic: true
  reopenForumTopic: true
  deleteForumTopic: true
  unpinAllForumTopicMessages: true
  editGeneralForumTopic: true
  closeGeneralForumTopic: true
  reopenGeneralForumTopic: true
  hideGeneralForumTopic: true
  unhideGeneralForumTopic: true
  unpinAllGeneralForumTopicMessages: true
  answerCallbackQuery: true
  getUserChatBoosts: Types.UserChatBoosts
  getBusinessConnection: Types.BusinessConnection
  setMyCommands: true
  deleteMyCommands: true
  getMyCommands: Array<Types.BotCommand>
  setMyName: true
  getMyName: Types.BotName
  setMyDescription: true
  getMyDescription: Types.BotDescription
  setMyShortDescription: true
  getMyShortDescription: Types.BotShortDescription
  setChatMenuButton: true
  getChatMenuButton: Types.MenuButton
  setMyDefaultAdministratorRights: true
  getMyDefaultAdministratorRights: Types.ChatAdministratorRights
  getAvailableGifts: Types.Gifts
  sendGift: true
  giftPremiumSubscription: true
  verifyUser: true
  verifyChat: true
  removeUserVerification: true
  removeChatVerification: true
  readBusinessMessage: true
  deleteBusinessMessages: true
  setBusinessAccountName: true
  setBusinessAccountUsername: true
  setBusinessAccountBio: true
  setBusinessAccountProfilePhoto: true
  removeBusinessAccountProfilePhoto: true
  setBusinessAccountGiftSettings: true
  getBusinessAccountStarBalance: Types.StarAmount
  transferBusinessAccountStars: true
  getBusinessAccountGifts: Types.OwnedGifts
  getUserGifts: Types.OwnedGifts
  getChatGifts: Types.OwnedGifts
  convertGiftToStars: true
  upgradeGift: true
  transferGift: true
  postStory: Types.Story
  repostStory: Types.Story
  editStory: Types.Story
  deleteStory: true
  editMessageText: Types.Message | true
  editMessageCaption: Types.Message | true
  editMessageMedia: Types.Message | true
  editMessageLiveLocation: Types.Message | true
  stopMessageLiveLocation: Types.Message | true
  editMessageChecklist: Types.Message
  editMessageReplyMarkup: Types.Message | true
  stopPoll: Types.Poll
  approveSuggestedPost: true
  declineSuggestedPost: true
  deleteMessage: true
  deleteMessages: true
  sendSticker: Types.Message
  getStickerSet: Types.StickerSet
  getCustomEmojiStickers: Array<Types.Sticker>
  uploadStickerFile: Types.File
  createNewStickerSet: true
  addStickerToSet: true
  setStickerPositionInSet: true
  deleteStickerFromSet: true
  replaceStickerInSet: true
  setStickerEmojiList: true
  setStickerKeywords: true
  setStickerMaskPosition: true
  setStickerSetTitle: true
  setStickerSetThumbnail: true
  setCustomEmojiStickerSetThumbnail: true
  deleteStickerSet: true
  answerInlineQuery: true
  answerWebAppQuery: Types.SentWebAppMessage
  savePreparedInlineMessage: Types.PreparedInlineMessage
  sendInvoice: Types.Message
  createInvoiceLink: string
  answerShippingQuery: true
  answerPreCheckoutQuery: true
  getMyStarBalance: Types.StarAmount
  getStarTransactions: Types.StarTransactions
  refundStarPayment: true
  editUserStarSubscription: true
  setPassportDataErrors: true
  sendGame: Types.Message
  setGameScore: Types.Message | true
  getGameHighScores: Array<Types.GameHighScore>
}
