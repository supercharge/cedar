'use strict'

import Enquirer from 'enquirer'
import { PromptBuilder } from './prompt-builder'
import { TextPromptOptions } from './console-input-contracts'

export class ConsoleInput {
  /**
   * Ask the user for text input.
   *
   * @param {String} question
   *
   * @returns {String}
   */
  async ask (question: string, options?: TextPromptOptions): Promise<string> {
    const prompt = new PromptBuilder()
      .add('type', 'input')
      .add('name', options?.name ?? 'value')
      .add('message', question)
      .add('initial', options?.default)
      .add('hint', options?.hint)
      .build()

    return await Enquirer.prompt(prompt as any)
  }

  /**
   * Ask the user to confirm the given `question`. Returns `true` or
   * `false`, depending on whether the user confirmed or declined.
   *
   * @param {String} question
   *
   * @returns {Boolean}
   */
  async confirm (_question: string): Promise<boolean> {
    //
    return true
  }

  /**
   * Ask the user to select one of the given `choices`.
   *
   * @param {String} question
   * @param  {Choice[]} choices
   *
   * @returns {Choice}
   */
  async choice (_question: string, _choices: string[]): Promise<string> {
    //
    return ''
  }

  /**
   * Ask the user for input and mask it in the terminal. This prompt is
   * useful for password inputs or when providing sensitive credentials.
   *
   * @param {String} question
   *
   * @returns  {Result}
   */
  async secure (_question: string): Promise<string> {
    return ''
  }

  /**
   * Returns a progress bar.
   */
  async progress (): Promise<any> {
    //
  }
}
