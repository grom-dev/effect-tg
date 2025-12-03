import type { TgxElement } from '@grom.js/tgx/types'
import type { Types } from './BotApi.ts'
import * as Data from 'effect/Data'

/**
 * Formatted text.
 */
export type Text
  = | Plain
    | Html
    | Markdown
    | Tgx

export class Plain extends Data.TaggedClass('Plain')<{
  text: string
  entities?: Array<Types.MessageEntity>
}> {}

export class Html extends Data.TaggedClass('Html')<{
  html: string
}> {}

export class Markdown extends Data.TaggedClass('Markdown')<{
  markdown: string
}> {}

export class Tgx extends Data.TaggedClass('Tgx')<{
  tgx: TgxElement
}> {}
