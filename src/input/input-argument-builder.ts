'use strict'

import { tap } from '@supercharge/goodies'
import { InputArgument } from './input-argument'

export class InputArgumentBuilder {
  /**
   * The argument instance.
   */
  private readonly argument: InputArgument

  /**
   * Create a new instance for the argument to build.
   *
   * @param {InputArgument} argument
   */
  constructor (argument: InputArgument) {
    this.argument = argument
  }

  /**
   * Set the argument description.
   *
   * @param {String} description
   *
   * @returns {InputArgumentBuilder}
   */
  description (description: string): this {
    return tap(this, () => {
      this.argument.setDescription(description)
    })
  }

  /**
   * Set the default value.
   *
   * @param defaultValue
   *
   * @returns {InputArgumentBuilder}
   */
  defaultValue (defaultValue: any): this {
    return tap(this, () => {
      this.argument.setDefaultValue(defaultValue)
    })
  }

  /**
   * Mark the argument as required.
   *
   * @returns {InputArgumentBuilder}
   */
  required (): this {
    return tap(this, () => {
      this.argument.markAsRequired()
    })
  }

  /**
   * Mark the argument as optional.
   *
   * @returns {InputArgumentBuilder}
   */
  optional (): this {
    return tap(this, () => {
      this.argument.markAsOptional()
    })
  }
}
