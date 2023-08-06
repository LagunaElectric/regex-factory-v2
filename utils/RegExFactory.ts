import { ReplaceRule } from "./ReplaceRule"

export default class RegExFactory {
  private _rules: ReplaceRule[]

  constructor(ruleSet?: ReplaceRule[]) {
    this._rules = ruleSet || []
  }

  get rules(): ReplaceRule[] {
    return this._rules
  }

  addRule(rule: ReplaceRule): RegExFactory {
    this._rules.push(rule)
    return this
  }

  addRules(rules: ReplaceRule[]): RegExFactory {
    this._rules = this._rules.concat(rules)
    return this
  }

  removeRule(rule: ReplaceRule): RegExFactory {
    const index = this._rules.indexOf(rule)
    if (index > -1) { this._rules.splice(index, 1) }
    return this
  }

  removeRules(rules: ReplaceRule[]): RegExFactory {
    for (const rule of rules) { this.removeRule(rule) }
    return this
  }

  process(text: string, rules?: ReplaceRule[]): string {
    const rulesToUse = rules || this._rules
    let result = text
    for (const rule of rulesToUse) {
      const { substitution, isRegEx, isCaseSensitive, isWholeWord, isReplaceAll } = rule
      let { match } = rule
      if (!isRegEx) { match = match.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&") }
      match = isWholeWord ? `\\b${match}\\b` : match
      let flags = "m"
      if (!isCaseSensitive) { flags += "i" }
      if (isReplaceAll) { flags += "g" }
      const regex = new RegExp(match, flags)
      result = result.replace(regex, substitution)
    }
    return result
  }
}
