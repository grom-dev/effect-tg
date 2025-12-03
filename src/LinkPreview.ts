import type * as BotApi from './BotApi.ts'
import * as Data from 'effect/Data'
import * as Option from 'effect/Option'

export class LinkPreview extends Data.Class<{
  url: Option.Option<string>
  position: 'above' | 'below'
  mediaSize: 'large' | 'small'
}> {
  options(): BotApi.Types.LinkPreviewOptions {
    const opts: BotApi.Types.LinkPreviewOptions = { is_disabled: false }
    if (Option.isSome(this.url)) {
      opts.url = this.url.value
    }
    if (this.position === 'above') {
      opts.show_above_text = true
    }
    if (this.mediaSize === 'large') {
      opts.prefer_large_media = true
    }
    else if (this.mediaSize === 'small') {
      opts.prefer_small_media = true
    }
    return opts
  }
}
