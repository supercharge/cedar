'use strict'

import Map from '@supercharge/map'

export interface InputInterface {
  /**
   * Returns the first argument. This typically represents the command name.
   * Returns an empty string if the input doesn’t contain any argument.
   */
  firstArgument(): string

  /**
   * Validates the input against required arguments and options.
   *
   * @throws when missing required arguments and options
   */
  validate(): void

  /**
   * Returns all provided arguments, merged with their default values.
   */
  arguments(): Map<string, unknown>

  /**
   * Returns the argument value for the given `name`.
   */
  argument(name: string): string | string[] | undefined

  /**
   * Set an argument for the given `name` and assign the `value`.
   *
   * @param {String} name
   * @param {*} value
   */
  setArgument(name: string, value: unknown): this

  /**
   * Determine whether an argument with the given `name` exists.
   *
   * @param {String} name
   */
  hasArgument(name: string): boolean

  /**
   * Returns all provided options, merged with their default values.
   */
  options(): Map<string, unknown>

  /**
   * Returns the option value for the given `name`.
   */
  option(name: string): unknown

  /**
   * Set an option for the given `name` and assign the `value`.
   *
   * @param {String} name
   * @param {*} value
   */
  setOption(name: string, value: unknown): this

  /**
   * Determine whether an option with the given `name` exists.
   *
   * @param {String} name
   */
  hasOption(name: string): boolean
}
