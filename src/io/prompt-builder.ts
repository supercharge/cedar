'use strict'

export class PromptBuilder {
  /**
   * The Enquirer configuration object.
   */
  private prompt: { [key: string]: any } = {}

  /**
   * Add a configuration to the Enquirer config object.
   *
   * @param {String} key
   * @param {*} value
   *
   * @returns {PromptBuilder}
   */
  public add (key: string, value: any): this {
    if (value !== undefined) {
      this.prompt[key] = value
    }

    return this
  }

  /**
   * Returns the prompt configuration object for Enquirer.
   *
   * @returns {Object}
   */
  public build (): { [key: string]: any } {
    return this.prompt
  }
}
