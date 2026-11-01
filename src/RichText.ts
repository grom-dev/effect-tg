import type { Types } from './BotApi.ts'

/**
 * Rich formatted text, as used in [rich messages](https://core.telegram.org/bots/api#rich-messages).
 */
export type RichText =
  | Html
  | Markdown
  | Blocks

export interface Html {
  readonly _tag: 'Html'
  readonly html: string
}

export interface Markdown {
  readonly _tag: 'Markdown'
  readonly markdown: string
}

export interface Blocks {
  readonly _tag: 'Blocks'
  readonly blocks: Array<Types.InputRichBlock>
}

// ———— Constructors ———————————————————————————————————————————————————————————

export const html = (html: string): Html => ({ _tag: 'Html', html })

export const markdown = (markdown: string): Markdown => ({ _tag: 'Markdown', markdown })

export const blocks = (blocks: Array<Types.InputRichBlock>): Blocks => ({ _tag: 'Blocks', blocks })
