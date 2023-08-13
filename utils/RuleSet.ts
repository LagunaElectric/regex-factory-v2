import Rule from "./Rule"

export default class RuleSet {
  private _rules: Rule[]
  name: Ref<string>

  constructor(name?: string, ruleSet?: Rule[]) {
    this._rules = reactive<Rule[]>(ruleSet || [])
    this.name = ref(name || "Untitled Rule Set")
  }

  get rules(): Rule[] {
    return this._rules
  }

  addRule(rule: Rule): RuleSet {
    this._rules.push(rule)
    return this
  }

  addRules(rules: Rule[]): RuleSet {
    this._rules = this._rules.concat(rules)
    return this
  }

  insertRule(rule: Rule, index: number): RuleSet {
    this._rules.splice(index, 0, rule)
    return this
  }

  removeRule(rule: Rule): RuleSet {
    const index = this._rules.indexOf(rule)
    if (index > -1) { this._rules.splice(index, 1) }
    return this
  }

  /**
   * The function removes a rule at a specific index from an array and returns the removed rule.
   * @param {number} index - The index parameter is the position of the rule that you want to remove
   * from the array of rules. It is a number that represents the index of the rule in the array.
   * @returns The method is returning the removed rule at the specified index.
   */
  removeRuleAt(index: number): Rule {
    return this._rules.splice(index, 1)[0]
  }

  removeRules(rules: Rule[]): RuleSet {
    for (const rule of rules) { this.removeRule(rule) }
    return this
  }

  apply(text: string, rules: Rule[] = this._rules) {
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
