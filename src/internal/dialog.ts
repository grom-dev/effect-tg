import type * as BotApi from '../BotApi.ts'
import * as Option from 'effect/Option'
import * as Dialog from '../Dialog.ts'

// =============================================================================
// Dialog ID <-> Peer ID
// =============================================================================

export const decodeDialogId = (dialogId: number): Option.Option<
  | { peer: 'user', id: Dialog.UserId }
  | { peer: 'group', id: Dialog.GroupId }
  | { peer: 'channel', id: Dialog.ChannelId }
  | { peer: 'monoforum', id: number }
  | { peer: 'secret-chat', id: number }
> => {
  if (Number.isSafeInteger(dialogId)) {
    if (1 <= dialogId && dialogId <= 0xFFFFFFFFFF) {
      return Option.some({ peer: 'user', id: +dialogId as Dialog.UserId })
    }
    if (-999999999999 <= dialogId && dialogId <= -1) {
      return Option.some({ peer: 'group', id: -dialogId as Dialog.GroupId })
    }
    if (-1997852516352 <= dialogId && dialogId <= -1000000000001) {
      return Option.some({ peer: 'channel', id: -(dialogId + 1000000000000) as Dialog.ChannelId })
    }
    if (-4000000000000 <= dialogId && dialogId <= -2002147483649) {
      return Option.some({ peer: 'monoforum', id: -(dialogId + 1000000000000) })
    }
    if (-2002147483648 <= dialogId && dialogId <= -1997852516353) {
      return Option.some({ peer: 'secret-chat', id: dialogId + 2000000000000 })
    }
  }
  return Option.none()
}

export const decodePeerId: {
  (peer: 'user', dialogId: number): Option.Option<Dialog.UserId>
  (peer: 'group', dialogId: number): Option.Option<Dialog.GroupId>
  (peer: 'channel', dialogId: number): Option.Option<Dialog.ChannelId>
  (peer: 'monoforum', dialogId: number): Option.Option<number>
  (peer: 'secret-chat', dialogId: number): Option.Option<number>
} = (peer, dialogId) => {
  const decoded = decodeDialogId(dialogId)
  if (Option.isSome(decoded) && decoded.value.peer === peer) {
    return Option.some(decoded.value.id as any)
  }
  return Option.none()
}

export const encodePeerId = (
  peer: 'user' | 'group' | 'channel' | 'monoforum' | 'secret-chat',
  id: number,
): Option.Option<Dialog.DialogId> => {
  if (Number.isSafeInteger(id)) {
    if (peer === 'user' && 1 <= id && id <= 0xFFFFFFFFFF) {
      return Option.some(id as Dialog.DialogId)
    }
    if (peer === 'group' && 1 <= id && id <= 999999999999) {
      return Option.some(-id as Dialog.DialogId)
    }
    if (peer === 'channel' && 1 <= id && id <= 997852516352) {
      return Option.some(-(id + 1000000000000) as Dialog.DialogId)
    }
    if (peer === 'monoforum' && 1002147483649 <= id && id <= 3000000000000) {
      return Option.some(-(id + 1000000000000) as Dialog.DialogId)
    }
    if (peer === 'secret-chat' && -2147483648 <= id && id <= 2147483647) {
      return Option.some((id - 2000000000000) as Dialog.DialogId)
    }
  }
  return Option.none()
}

// =============================================================================
// Constructors
// =============================================================================

export const ofMessage: (
  message: BotApi.Types.Message,
) => Dialog.Dialog = (m) => {
  switch (m.chat.type) {
    case 'private': {
      const user = new Dialog.User({
        id: Option.getOrThrow(decodePeerId('user', m.chat.id)),
      })
      if (m.message_thread_id != null) {
        return user.topic(m.message_thread_id)
      }
      return user
    }
    case 'group': {
      return new Dialog.Group({
        id: Option.getOrThrow(decodePeerId('group', m.chat.id)),
      })
    }
    case 'channel': {
      const channel = new Dialog.Channel({
        id: Option.getOrThrow(decodePeerId('channel', m.chat.id)),
      })
      if (m.direct_messages_topic != null) {
        return channel.directMessages(m.direct_messages_topic.topic_id)
      }
      return channel
    }
    case 'supergroup': {
      const supergroup = new Dialog.Supergroup({
        id: Option.getOrThrow(decodePeerId('channel', m.chat.id)),
      })
      if (m.message_thread_id != null) {
        return supergroup.topic(m.message_thread_id)
      }
      return supergroup
    }
  }
}
