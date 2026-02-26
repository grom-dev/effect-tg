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

export interface Plain {
  readonly _tag: 'Plain'
  readonly text: string
  readonly entities?: Array<Types.MessageEntity>
}
export const Plain: Data.Case.Constructor<Plain, '_tag'> = Data.tagged<Plain>('Plain')

export interface Html {
  readonly _tag: 'Html'
  readonly html: string
}
export const Html: Data.Case.Constructor<Html, '_tag'> = Data.tagged<Html>('Html')

export interface Markdown {
  readonly _tag: 'Markdown'
  readonly markdown: string
}
export const Markdown: Data.Case.Constructor<Markdown, '_tag'> = Data.tagged<Markdown>('Markdown')

export interface Tgx {
  readonly _tag: 'Tgx'
  readonly tgx: TgxElement
}
export const Tgx: Data.Case.Constructor<Tgx, '_tag'> = Data.tagged<Tgx>('Tgx')

// ———— Constructors ———————————————————————————————————————————————————————————

export const plain = (
  text: string,
  entities?: Array<Types.MessageEntity>,
): Plain => Plain({ text, entities })

export const html = (html: string): Html => Html({ html })

export const markdown = (markdown: string): Markdown => Markdown({ markdown })

export const tgx = (tgx: TgxElement): Tgx => Tgx({ tgx })
