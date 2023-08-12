import Rule from "./Rule"

export default class RuleSet {
  private _rules: Ref<Rule[]>

  constructor(ruleSet?: Rule[]) {
    this._rules = ref(ruleSet || [])
  }

  get rules(): Rule[] {
    return this._rules.value
  }

  addRule(rule: Rule): RuleSet {
    this._rules.value.push(rule)
    return this
  }

  addRules(rules: Rule[]): RuleSet {
    this._rules.value = this._rules.value.concat(rules)
    return this
  }

  removeRule(rule: Rule): RuleSet {
    const index = this._rules.value.indexOf(rule)
    if (index > -1) { this._rules.value.splice(index, 1) }
    return this
  }

  removeRules(rules: Rule[]): RuleSet {
    for (const rule of rules) { this.removeRule(rule) }
    return this
  }

  apply(text: string, rules: Rule[] = this._rules.value) {
    return rules.reduce((result, rule) => {
      const { substitution, isRegEx, isCaseSensitive, isWholeWord, isReplaceAll } = rule
      let { match } = rule

      if (!isRegEx) {
        match = match.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
      }

      match = isWholeWord ? `\\b${match}\\b` : match

      const flags = (isCaseSensitive ? "" : "i") + (isReplaceAll ? "g" : "")

      const regex = new RegExp(match, flags)
      return result.replace(regex, substitution)
    }, text)
  }
}
