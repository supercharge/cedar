'use strict'

import { tap } from '@supercharge/goodies'

export class InputOption {
  /**
   * The argument name.
   */
  private readonly meta: {
    /**
     * The argument name.
     */
    name: string

    /**
     * The shortcut name.
     */
    shortcut?: string

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

  /**
   * Create a new option instance for the given `name`.
   *
   * @param {String} name
   */
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
   * @returns {InputOption}
   */
  setDescription (description: string): this {
    return tap(this, () => {
      this.meta.description = String(description).trim()
    })
  }

  /**
   * Returns the option shortcut.
   *
   * @returns {String}
   */
  shortcut (): string | undefined {
    return this.meta.shortcut
  }

  /**
   * Set the option shortcut.
   *
   * @param {String} shortcut
   *
   * @returns {InputOption}
   */
  setShortcut (shortcut: string): this {
    return tap(this, () => {
      this.meta.shortcut = String(shortcut).trim()
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
   * @returns {InputOption}
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
   * @returns {InputOption}
   */
  markAsRequired (): this {
    return tap(this, () => {
      this.meta.required = true
    })
  }

  /**
   * Mark the argument as optional.
   *
   * @returns {InputOption}
   */
  markAsOptional (): this {
    return tap(this, () => {
      this.meta.required = false
    })
  }
}
