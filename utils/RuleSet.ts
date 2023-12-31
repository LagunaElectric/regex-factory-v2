import { TRPCClientError } from "@trpc/client"
import Rule from "./Rule"

export default class RuleSet {
  private _id: Ref<string>
  private _title: Ref<string>
  private _rules: Rule[]
  private _isStored: Ref<boolean>
  private _isSaved: Ref<boolean>
  private _client = useNuxtApp().$client

  constructor(id?: string, title?: string, ruleSet?: Rule[], isStored?: boolean) {
    this._id = ref(id || "")
    this._title = ref(title || "Untitled Rule Set")
    this._rules = reactive<Rule[]>(ruleSet || [])
    this._isStored = ref(isStored || false)
    this._isSaved = ref(isStored || false)
    this._client = useNuxtApp().$client
  }

  private _isEqualTo(ruleSet: {
    title: string
    rules: Rule[]
  }) {
    const { title, rules } = ruleSet
    const isSameTitle = this._title.value === title
    const isSameRules = this._rules.length === rules?.length && this._rules.every((rule, index) => {
      return rule.match === rules[index].match &&
        rule.substitution === rules[index].substitution &&
        rule.isRegEx === rules[index].isRegEx &&
        rule.isCaseSensitive === rules[index].isCaseSensitive &&
        rule.isWholeWord === rules[index].isWholeWord &&
        rule.isReplaceAll === rules[index].isReplaceAll
    })
    return isSameTitle && isSameRules
  }

  private _handleSaveError(result: { status: number, message?: string, ruleSet?: any }) {
    switch (result.status) {
      case 409:{
        const { ruleSet: existingRuleSet } = result
        this._id.value = existingRuleSet!.id
        this._isStored.value = true
        const { title, rules } = existingRuleSet!
        this._isSaved.value = this._isEqualTo({ title, rules })
        break
      }
      default:{
        const { status } = result
        throw new TRPCClientError(status.toString())
      }
    }
  }

  private async _save() {
    const result = await this._client.createRuleSet.mutate({
      id: this._id.value,
      title: this._title.value,
      ruleSet: this._rules,
    })
    if (result.status !== 200) {
      this._handleSaveError(result)
      return
    }
    // We're splicing this instead of assignment because
    // dirtect assignment will cause the reactivity to break
    this._rules.splice(0, this._rules.length, ...(result.rules as Rule[] || []))
    this._id.value = result.ruleSetId || this._id.value
    this._isSaved.value = true
    this._isStored.value = true
  }

  private async _update() {
    const result = await this._client.updateRuleSet.mutate({
      id: this._id.value,
      title: this._title.value,
      ruleSet: this._rules.length ? this._rules : undefined,
    })
    // We're splicing this instead of assignment because
    // dirtect assignment will cause the reactivity to break
    this._rules.splice(0, this._rules.length, ...(result as Rule[] || []))
    this._isSaved.value = true
    this._isStored.value = true
  }

  async save(overwrite?: boolean) {
    if (this._isSaved.value) { return }
    if (this._isStored.value) {
      if (!overwrite) { return }
      await this._update()
      return
    }
    await this._save()
  }

  private _onModification() {
    this._isSaved.value = false
  }

  get id(): Ref<string> {
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
