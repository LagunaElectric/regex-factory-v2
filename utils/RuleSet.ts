import { TRPCClientError } from "@trpc/client"
import Rule from "./Rule"

export default class RuleSet {
  private _rules: Rule[]
  private _isSaved: boolean
  title: Ref<string>

  constructor(title?: string, ruleSet?: Rule[], isSaved?: boolean) {
    this._rules = reactive<Rule[]>(ruleSet || [])
    this.title = ref(title || "Untitled Rule Set")
    this._isSaved = isSaved || false
  }

  private async _handleSaveError(error: unknown) {
    if (!(error instanceof TRPCClientError)) {
      // eslint-disable-next-line no-console
      console.error(error)
      return
    }
    const { httpStatus }: { httpStatus: number } = error.data
    const { message }: { message: string } = error.shape
    switch (httpStatus) {
      case 409: {
        // eslint-disable-next-line no-console
        console.log(message)
        const updatedRuleSet = await this._update()
        this._isSaved = true
        return updatedRuleSet
      }
      case 401:
        // eslint-disable-next-line no-console
        console.log(message)
        break
      default:
        // eslint-disable-next-line no-console
        console.error(error)
        break
    }
  }

  private async _save() {
    const { $client } = useNuxtApp()

    try {
      const ruleSet = await $client.createRuleSet.mutate({
        title: this.title.value,
        ruleSet: this._rules,
      })
      this._isSaved = true
      return ruleSet
    } catch (error) {
      this._handleSaveError(error)
    }
  }

  private async _update() {
    const { $client } = useNuxtApp()
    return await $client.updateRuleSet.mutate({
      title: this.title.value,
      ruleSet: this._rules.length ? this._rules : undefined,
    })
  }

  async save() {
    if (this._isSaved) {
      return await this._update()
    }
    return await this._save()
  }

  get isSaved(): boolean {
    return this._isSaved
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
