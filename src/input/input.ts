'use strict'

import Map from '@supercharge/map'
import { tap } from '@supercharge/goodies'
import { Opts as Options } from 'minimist'
import { InputDefinition } from './input-definition'

export abstract class Input {
  /**
   * The parsed input tokens.
   */
  private readonly meta: {
    arguments: Map<string, unknown>
    options: Map<string, unknown>

    definition: InputDefinition
  }

  /**
   * Create a new instance for the given `args`.
   *
   * @param definition
   */
  constructor (definition?: InputDefinition) {
    this.meta = {
      options: new Map(),
      arguments: new Map(),
      definition: new InputDefinition()
    }

    if (definition) {
      this.bind(definition)
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
   * Parse the command line input (arguments and options).
   */
  abstract parse (options?: Options): this

  /**
   * Bind the given input `definition` with the provided input options and arguments.
   *
   * @param {InputDefinition} definition
   *
   * @returns {Input}
   *
   * @param definition
   */
  public bind (definition: InputDefinition): this {
    this.meta.definition = definition

    return this.parse()
  }

  /**
   * Validate the command line input against the definition.
   *
   * @returns {Input}
   *
   * @throws
   */
  public validate (): this {
    // TODO

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
   * Returns the argument value for the given `name`.
   *
   * @returns {*}
   *
   * @throws
   */
  argument (name: string): unknown {
    if (this.definition().isMissingArgument(name)) {
      throw new Error(`The "${name}" argument is not available.`)
    }

    return this.arguments().has(name)
      ? this.arguments().get(name)
      : this.definition().argument(name)?.defaultValue()
  }

  /**
    * Set an argument for the given `name` and assign the `value`.
    *
    * @param {String} name
    * @param {*} value
    */
  setArgument (name: string, value: unknown): this {
    if (this.definition().isMissingArgument(name)) {
      throw new Error(`The "${name}" argument is not available.`)
    }

    return tap(this, () => {
      this.arguments().set(name, value)
    })
  }

  /**
    * Determine whether an option with the given `name` exists.
    *
    * @param {String} name
    */
  hasArgument (name: string): boolean {
    return this.arguments().has(name)
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
  option (name: string): unknown {
    if (this.definition().isMissingOption(name)) {
      throw new Error(`The "${name}" option is not available.`)
    }

    return this.options().has(name)
      ? this.options().get(name)
      : this.definition().option(name)?.defaultValue()
  }

  /**
    * Set an option for the given `name` and assign the `value`.
    *
    * @param {String} name
    * @param {*} value
    */
  setOption (name: string, value: unknown): this {
    if (this.definition().isMissingOption(name)) {
      throw new Error(`The "${name}" option is not available.`)
    }

    return tap(this, () => {
      this.options().set(name, value)
    })
  }

  /**
    * Determine whether an option with the given `name` exists.
    *
    * @param {String} name
    */
  hasOption (name: string): boolean {
    return this.options().has(name)
  }
}
