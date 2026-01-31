import * as Data from 'effect/Data'
import * as internal from './internal/dialog.ts'

export type Dialog =
  | UserId
  | GroupId
  | ChannelId
  | SupergroupId
  | PublicChannel
  | PublicSupergroup
  | ForumTopic
  | ChannelDm
  | PrivateThread

export class UserId extends internal.PeerId({
  tag: 'UserId',
  isValid: id => (id >= 1 && id <= 0xFFFFFFFFFF),
  toDialogId: id => id,
}) {}

export class GroupId extends internal.PeerId({
  tag: 'GroupId',
  isValid: id => (id >= 1 && id <= 999999999999),
  toDialogId: id => -id,
}) {}

export class ChannelId extends internal.PeerId({
  tag: 'ChannelId',
  isValid: id => (id >= 1 && id <= 997852516352),
  toDialogId: id => -(1000000000000 + id),
}) {}

export class SupergroupId extends internal.PeerId({
  tag: 'SupergroupId',
  isValid: id => (id >= 1 && id <= 997852516352),
  toDialogId: id => -(1000000000000 + id),
}) {}

export class PublicChannel extends Data.TaggedClass('PublicChannel')<{
  username: string
}> {}

export class PublicSupergroup extends Data.TaggedClass('PublicSupergroup')<{
  username: string
}> {}

export class ForumTopic extends Data.TaggedClass('ForumTopic')<{
  forum: SupergroupId | PublicSupergroup
  topicId: number
}> {}

export class ChannelDm extends Data.TaggedClass('ChannelDm')<{
  channel: ChannelId | PublicChannel
  userId: number
}> {}

export class PrivateThread extends Data.TaggedClass('PrivateThread')<{
  user: UserId
  threadId: number
}> {}
