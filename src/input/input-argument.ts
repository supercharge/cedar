'use strict'

import { tap } from '@supercharge/goodies'

export class InputArgument {
  /**
   * The argument name.
   */
  private readonly meta: {
    /**
     * The argument name.
     */
    name: string

    /**
     * The argument description.
     */
    description?: string

    /**
     * The argument’s or option’s default value.
     */
    defaultValue?: any

    /**
     * Determine whether the argument is required.
     */
    required: boolean
  }

  constructor (name: string) {
    this.meta = { name: name ?? '', required: false }
  }

  /**
   * Returns the argument name.
   *
   * @returns {String}
   */
  name (): string {
    return this.meta.name
  }

  /**
   * Returns the argument description.
   *
   * @returns {String}
   */
  description (): string {
    return this.meta.description ?? ''
  }

  /**
   * Set the argument description.
   *
   * @param {String} description
   *
   * @returns {InputArgument}
   */
  setDescription (description: string): this {
    return tap(this, () => {
      this.meta.description = String(description).trim()
    })
  }

  /**
   * Returns the argument’s default value.
   *
   * @returns {*}
   */
  defaultValue (): any {
    return this.meta.defaultValue
  }

  /**
   * Set the default value.
   *
   * @param value
   *
   * @returns {InputArgument}
   */
  setDefaultValue (value: any): this {
    return tap(this, () => {
      this.meta.defaultValue = value
    })
  }

  /**
   * Returns `true` if the argument is optional.
   *
   * @returns {Boolean}
   */
  isOptional (): boolean {
    return !this.isRequired()
  }

  /**
   * Returns `true` if the argument is required.
   *
   * @returns {Boolean}
   */
  isRequired (): boolean {
    return this.meta.required ?? false
  }

  /**
   * Mark the argument as required.
   *
   * @returns {InputArgument}
   */
  markAsRequired (): this {
    return tap(this, () => {
      this.meta.required = true
    })
  }

  /**
   * Mark the argument as optional.
   *
   * @returns {InputArgument}
   */
  markAsOptional (): this {
    return tap(this, () => {
      this.meta.required = false
    })
  }
}
