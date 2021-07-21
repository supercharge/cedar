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
   * Assign the given `shortcut` to this option.
   *
   * @param {String} shortcut
   *
   * @returns {InputOptionBuilder}
   */
  shortcut (shortcut: string): this {
    return this.shortcuts(shortcut)
  }

  /**
   * Assign the given `shortcuts` to this option.
   *
   * @param {String|String[]} shortcuts
   *
   * @returns {InputOptionBuilder}
   */
  shortcuts (shortcuts: string | string[]): this {
    shortcuts = ([] as string[]).concat(shortcuts)

    return tap(this, () => {
      this.option.addShortcuts(shortcuts)
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
   * Mark this option as required.
   *
   * @returns {InputOptionBuilder}
   */
  required (): this {
    return tap(this, () => {
      this.option.markAsRequired()
    })
  }

  /**
   * Mark this option as optional.
   *
   * @returns {InputOptionBuilder}
   */
  optional (): this {
    return tap(this, () => {
      this.option.markAsOptional()
    })
  }
}
