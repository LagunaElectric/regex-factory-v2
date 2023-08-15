export default interface Rule {
  match: string
  substitution: string
  isRegEx: boolean
  isCaseSensitive: boolean
  isWholeWord: boolean
  isReplaceAll: boolean
}
