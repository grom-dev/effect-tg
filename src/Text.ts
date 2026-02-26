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

const _Plain: ReturnType<typeof Data.TaggedClass<'Plain'>> = Data.TaggedClass('Plain')
export class Plain extends _Plain<{
  text: string
  entities?: Array<Types.MessageEntity>
}> {}

const _Html: ReturnType<typeof Data.TaggedClass<'Html'>> = Data.TaggedClass('Html')
export class Html extends _Html<{
  html: string
}> {}

const _Markdown: ReturnType<typeof Data.TaggedClass<'Markdown'>> = Data.TaggedClass('Markdown')
export class Markdown extends _Markdown<{
  markdown: string
}> {}

const _Tgx: ReturnType<typeof Data.TaggedClass<'Tgx'>> = Data.TaggedClass('Tgx')
export class Tgx extends _Tgx<{
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
