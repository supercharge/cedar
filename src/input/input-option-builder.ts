'use strict'

import { tap } from '@supercharge/goodies'
import { InputOption } from './input-option'

export class InputOptionBuilder {
  /**
   * The option instance.
   */
  private readonly option: InputOption

  /**
   * Create a new instance for the option to build.
   *
   * @param {InputOption} option
   */
  constructor (option: InputOption) {
    this.option = option
  }

  /**
   * Set the option description.
   *
   * @param {String} shortcut
   *
   * @returns {InputOptionBuilder}
   */
  shortcuts (shortcut: string | string[]): this {
    shortcut = ([] as string[]).concat(shortcut)

    return tap(this, () => {
      this.option.addShortcuts(shortcut)
    })
  }

  /**
   * Set the option description.
   *
   * @param {String} description
   *
   * @returns {InputOptionBuilder}
   */
  description (description: string): this {
    return tap(this, () => {
      this.option.setDescription(description)
    })
  }

  /**
   * Set the default value.
   *
   * @param defaultValue
   *
   * @returns {InputOptionBuilder}
   */
  defaultValue (defaultValue: any): this {
    return tap(this, () => {
      this.option.setDefaultValue(defaultValue)
    })
  }

  /**
   * Mark the argument as required.
   *
   * @returns {InputOptionBuilder}
   */
  required (): this {
    return tap(this, () => {
      this.option.markAsRequired()
    })
  }

  /**
   * Mark the argument as optional.
   *
   * @returns {InputOptionBuilder}
   */
  optional (): this {
    return tap(this, () => {
      this.option.markAsOptional()
    })
  }
}
