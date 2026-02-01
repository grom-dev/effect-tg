import type { MethodFailureReason } from '../BotApiError.ts'

export const guessReason = ({
  code,
  description,
}: {
  code: number
  description: string
}): MethodFailureReason => {
  const msg = description.toLowerCase()
  if (code === 403) {
    if (msg.includes('bot was blocked by the user')) {
      return 'BotBlockedByUser'
    }
  }
  if (code === 400) {
    if (msg.includes('message is not modified')) {
      return 'MessageNotModified'
    }
    if (msg.includes('reply markup too long')) {
      return 'ReplyMarkupTooLong'
    }
    if (msg.includes('query is too old') && msg.includes('query id is invalid')) {
      return 'QueryIdInvalid'
    }
    if (msg.includes('can\'t use the media of the specified type in the album')) {
      return 'MediaGroupedInvalid'
    }
  }
  return 'Unknown'
}
