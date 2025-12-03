export function PeerId<Tag extends string>({
  tag,
  isValid,
  toDialogId,
}: {
  tag: Tag
  isValid: (peerId: number) => boolean
  toDialogId: (peerId: number) => number
}): {
  new (id: number): {
    readonly _tag: Tag
    readonly id: number
    readonly dialogId: number
  }
} {
  class Base {
    public readonly _tag = tag
    public readonly id: number
    public readonly dialogId: number

    constructor(id: number) {
      if (!Number.isSafeInteger(id)) {
        throw new TypeError(`invalid integer: ${id}`)
      }
      if (!isValid(id)) {
        throw new Error(`invalid peer id: ${id}`)
      }
      this.id = id
      this.dialogId = toDialogId(id)
    }
  }
  return Base
}
