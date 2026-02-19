import type { TgxElement } from '@grom.js/tgx'
import type { Types } from './BotApi.ts'
import * as Data from 'effect/Data'

/**
 * Formatted text.
 */
export type Text =
  | Plain
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

// ———— Constructors ———————————————————————————————————————————————————————————

export const plain = (
  text: string,
  entities?: Array<Types.MessageEntity>,
): Plain => new Plain({ text, entities })

export const html = (html: string): Html => new Html({ html })

export const markdown = (markdown: string): Markdown => new Markdown({ markdown })

export const tgx = (tgx: TgxElement): Tgx => new Tgx({ tgx })
