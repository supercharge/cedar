'use strict'

import Prompt from 'prompts'
import { PromptBuilder } from './builder/prompt'
import { ConfirmBuilder } from './builder/confirm'
import { QuestionBuilder } from './builder/question'

export class ConsoleInput {
  /**
   * Ask the user for text input.
   *
   * @param {String} question
   *
   * @returns {String}
   */
  async ask<T extends string> (question: string, callback: (questionBuilder: QuestionBuilder) => unknown): Promise<T> {
    const builder = new PromptBuilder()
      .type('text')
      .name('value')
      .question(question)

    if (callback) {
      callback(new QuestionBuilder(builder))
    }

    const result = await Prompt(builder.build())

    return result.value
  }

  /**
   * Ask the user to confirm the given `question`. Returns `true` or
   * `false`, depending on whether the user confirmed or declined.
   *
   * @param {String} question
   *
   * @returns {Boolean}
   */
  async confirm (question: string, callback: (confirmBuilder: ConfirmBuilder) => unknown): Promise<boolean> {
    const builder = new PromptBuilder()
      .type('confirm')
      .name('value')
      .question(question)

    if (callback) {
      callback(new ConfirmBuilder(builder))
    }

    const result = await Prompt(builder.build())

    return result.value
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
