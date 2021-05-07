'use strict'

import { tap } from '@supercharge/goodies'

export class InputOption {
  /**
   * The option meta data.
   */
  private readonly meta: {
    /**
     * The option name.
     */
    name: string

    /**
     * The avaialble shortcuts.
     */
    shortcuts: string[]

    /**
     * The option description.
     */
    description?: string

    /**
     * The option’s default value.
     */
    defaultValue?: any

    /**
     * Determine whether the option is required.
     */
    required: boolean
  }

  /**
   * Create a new option instance for the given `name`.
   *
   * @param {String} name
   */
  constructor (name: string) {
    this.meta = {
      name: name ?? '',
      required: false,
      shortcuts: []
    }
  }

  /**
   * Returns the option name.
   *
   * @returns {String}
   */
  name (): string {
    return this.meta.name
  }

  /**
   * Returns the option description.
   *
   * @returns {String}
   */
  description (): string {
    return this.meta.description ?? ''
  }

  /**
   * Set the option description.
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
  shortcuts (): string[] {
    return Array.from(
      new Set(this.meta.shortcuts)
    )
  }

  /**
   * Set the option shortcut.
   *
   * @param {String} shortcuts
   *
   * @returns {InputOption}
   */
  addShortcuts (shortcuts: string | string[]): this {
    return tap(this, () => {
      this.meta.shortcuts = this.meta.shortcuts
        .concat(shortcuts || [])
        .map(shortcut => {
          return String(shortcut).trim()
        })
    })
  }

  /**
   * Returns the option’s default value.
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
   * Returns `true` if the option is optional.
   *
   * @returns {Boolean}
   */
  isOptional (): boolean {
    return !this.isRequired()
  }

  /**
   * Returns `true` if the option is required.
   *
   * @returns {Boolean}
   */
  isRequired (): boolean {
    return this.meta.required ?? false
  }

  /**
   * Mark the option as required.
   *
   * @returns {InputOption}
   */
  markAsRequired (): this {
    return tap(this, () => {
      this.meta.required = true
    })
  }

  /**
   * Mark the option as optional.
   *
   * @returns {InputOption}
   */
  markAsOptional (): this {
    return tap(this, () => {
      this.meta.required = false
    })
  }
}
