import type { TgxElement } from '@grom.js/tgx'
import type { Types } from './BotApi.ts'

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

export interface Html {
  readonly _tag: 'Html'
  readonly html: string
}

export interface Markdown {
  readonly _tag: 'Markdown'
  readonly markdown: string
}

export interface Tgx {
  readonly _tag: 'Tgx'
  readonly tgx: TgxElement
}

// ———— Constructors ———————————————————————————————————————————————————————————

export const plain = (
  text: string,
  entities?: Array<Types.MessageEntity>,
): Plain => ({ _tag: 'Plain', text, entities })

export const html = (html: string): Html => ({ _tag: 'Html', html })

export const markdown = (markdown: string): Markdown => ({ _tag: 'Markdown', markdown })

export const tgx = (tgx: TgxElement): Tgx => ({ _tag: 'Tgx', tgx })
