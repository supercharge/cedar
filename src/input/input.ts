'use strict'

import Map from '@supercharge/map'
import { tap } from '@supercharge/goodies'
import { InputDefinition } from './input-definition'
import { ValidationError } from '../errors/validation-error'

export abstract class Input {
  /**
   * Stores the input meta data. The bound definition and parsed arguments and options.
   */
  private readonly meta: {
    definition: InputDefinition
    options: Map<string, unknown>
    arguments: Map<string, unknown>
  }

  /**
   * Create a new instance for the given `args`.
   */
  constructor () {
    this.meta = {
      options: new Map(),
      arguments: new Map(),
      definition: new InputDefinition()
    }
  }

  /**
   * Returns the input definition.
   *
   * @returns {InputDefinition}
   */
  definition (): InputDefinition {
    return this.meta.definition
  }

  /**
   * Assign the given input `definition`.
   *
   * @param definition
   *
   * @returns {ThisType}
   */
  withDefinition (definition: InputDefinition): this {
    return tap(this, () => {
      this.meta.definition = definition
    })
  }

  /**
   * Parse the command line input (arguments and options).
   */
  abstract parse (): this

  /**
   * Bind the command definition against the `argv` input values.
   *
   * @param argv
   *
   * @returns {ThisType}
   */
  bind (definition: InputDefinition): this {
    return this.withDefinition(definition).parse().validate()
  }

  /**
   * Validate the provided arguments and options (command line input)
   * against the input definition configured for this command.
   *
   * @returns {Command}
   *
   * @throws
   */
  private validate (): this {
    const missingArguments = this.definition().argumentNames().filter(argument => {
      return this.arguments().isMissing(argument) && this.definition().argument(argument)?.isRequired()
    })

    if (missingArguments.length > 0) {
      throw new ValidationError(`Not enough arguments provided. Missing: ${missingArguments.join(', ')}`)
    }

    const missingOptions = this.definition().options()
      .filter(option => option.isRequired())
      .filter(option => this.options().isMissing(option.name()))

    if (missingOptions.size() > 0) {
      const missingOptionNames = missingOptions.map(option => option.name()).join(', ')
      throw new ValidationError(`Required options not provided. Missing: ${missingOptionNames}`)
    }

    return this
  }

  /**
   * Returns the provided input arguments.
   *
   * @returns {Map}
   */
  arguments (): Map<string, unknown> {
    return this.meta.arguments
  }

  /**
   * Returns the provided input options.
   *
   * @returns {Object}
   *
   * @example
   * ```bash
   * # Imagine this command input
   * $ ./cli command:name --dry-run -h
   *
   * # the input from above results in these options
   * {
   *   h: true,
   *   'dry-run': true
   * }
   * ```
   */
  options (): Map<string, unknown> {
    return this.meta.options
  }

  /**
   * Returns the option value for the given `name`.
   *
   * @returns {*}
   *
   * @throws
   */
  option (name: string): any {
    return this.options().get(name)
  }

  /**
    * Set an option for the given `name` and assign the `value`.
    *
    * @param {String} name
    * @param {*} value
    */
  setOption (name: string, value: any): this {
    return tap(this, () => {
      this.options().set(name, value)
    })
  }

  /**
    * Determine whether an option with the given `name` exists.
    *
    * @param {String} name
    *
    * @returns {Boolean}
    */
  hasOption (name: string): boolean {
    return this.options().has(name)
  }

  /**
    * Determine whether an option with the given `name` is missing.
    *
    * @param {String} name
    *
    * @returns {Boolean}
    */
  isMissingOption (name: string): boolean {
    return !this.hasOption(name)
  }
}
