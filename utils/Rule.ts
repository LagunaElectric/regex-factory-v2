export default interface Rule {
  id: string | undefined
  match: string
  substitution: string
  isRegEx: boolean
  isCaseSensitive: boolean
  isWholeWord: boolean
  isReplaceAll: boolean
}
