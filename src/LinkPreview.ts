import type * as BotApi from './BotApi.ts'
import * as Data from 'effect/Data'
import * as Option from 'effect/Option'

export class LinkPreview extends Data.Class<{
  url: Option.Option<string>
  position: 'above' | 'below'
  mediaSize: 'large' | 'small'
}> {}

export const options = (preview: LinkPreview): BotApi.Types.LinkPreviewOptions => {
  const opts: BotApi.Types.LinkPreviewOptions = { is_disabled: false }
  if (Option.isSome(preview.url)) {
    opts.url = preview.url.value
  }
  if (preview.position === 'above') {
    opts.show_above_text = true
  }
  if (preview.mediaSize === 'large') {
    opts.prefer_large_media = true
  }
  else if (preview.mediaSize === 'small') {
    opts.prefer_small_media = true
  }
  return opts
}
