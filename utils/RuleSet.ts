import { TRPCClientError } from "@trpc/client"
import Rule from "./Rule"

export default class RuleSet {
  private _id?: string
  private _rules: Rule[]
  private _isStored: Ref<boolean>
  private _isSaved: Ref<boolean>
  private _client = useNuxtApp().$client
  private _title: Ref<string>

  constructor(title?: string, ruleSet?: Rule[], isStored?: boolean) {
    this._rules = reactive<Rule[]>(ruleSet || [])
    this._title = ref(title || "Untitled Rule Set")
    this._isStored = ref(isStored || false)
    this._isSaved = ref(isStored || false)
    this._client = useNuxtApp().$client
  }

  private _handleSaveError(error: unknown) {
    if (!(error instanceof TRPCClientError)) {
      // eslint-disable-next-line no-console
      console.error(error)
      return {
        status: 500,
        message: "Internal Server Error",
        error,
      }
    }
    const { httpStatus: status }: { httpStatus: number } = error.data
    const { message }: { message: string } = error.shape
    return {
      status,
      message,
      error,
    }
  }

  private async _save() {
    try {
      const ruleSet = await this._client.createRuleSet.mutate({
        title: this._title.value,
        ruleSet: this._rules,
      })
      this._isSaved.value = true
      this._isStored.value = true
      this._id = ruleSet.id
      return ruleSet
    } catch (error) {
      return this._handleSaveError(error)
    }
  }

  private async _update() {
    const updatedRuleSet = await this._client.updateRuleSet.mutate({
      title: this._title.value,
      ruleSet: this._rules.length ? this._rules : undefined,
    })
    this._isSaved.value = true
    return updatedRuleSet
  }

  async save() {
    if (this._isSaved) { return }
    if (this._isStored) {
      await this._update()
      return
    }
    await this._save()
  }

  private _onModification() {
    this._isSaved.value = false
  }

  get id(): string | undefined {
    return this._id
  }

  get isStored(): Ref<boolean> {
    return this._isStored
  }

  get isSaved(): Ref<boolean> {
    return this._isSaved
  }

  get rules(): Rule[] {
    return this._rules
  }

  get title(): Ref<string> {
    return this._title
  }

  set title(title: string) {
    // TODO: Add validation
    this._title.value = title
    this._onModification()
  }

  addRule(rule: Rule): RuleSet {
    this._rules.push(rule)
    this._onModification()
    return this
  }

  addRules(rules: Rule[]): RuleSet {
    this._rules = this._rules.concat(rules)
    this._onModification()
    return this
  }

  insertRule(rule: Rule, index: number): RuleSet {
    this._rules.splice(index, 0, rule)
    this._onModification()
    return this
  }

  removeRule(rule: Rule): RuleSet {
    const index = this._rules.indexOf(rule)
    if (index > -1) {
      this._rules.splice(index, 1)
      this._onModification()
    }
    return this
  }

  /**
   * The function removes a rule at a specific index from an array and returns the removed rule.
   * @param {number} index - The index parameter is the position of the rule that you want to remove
   * from the array of rules. It is a number that represents the index of the rule in the array.
   * @returns The method is returning the removed rule at the specified index.
   */
  removeRuleAt(index: number): Rule {
    this._onModification()
    return this._rules.splice(index, 1)[0]
  }

  removeRules(rules: Rule[]): RuleSet {
    if (!rules.length) { return this }
    for (const rule of rules) { this.removeRule(rule) }
    this._onModification()
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
