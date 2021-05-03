'use strict'

import Map from '@supercharge/map'
import { tap } from '@supercharge/goodies'
import { InputDefinition } from './input-definition'
import minimist, { ParsedArgs, Opts as Options } from 'minimist'

export class ArgvInput {
  /**
   * The input arguments. By default `process.argv.slice(2)`
   */
  private readonly args: string[]

  /**
   * The parsed input tokens.
   */
  private parsed: ParsedArgs

  /**
   * The parsed input tokens.
   */
  private readonly meta: {
    options: Map<string, unknown>
  }

  /**
   * Create a new instance for the given `args`.
   *
   * @param args
   */
  constructor (args?: string[]) {
    this.args = args ?? process.argv.slice(2)
    this.parsed = { _: [] }

    this.meta = { options: new Map() }
  }

  /**
   * Parse the command line input (arguments and options).
   */
  parse (options?: Options): this {
    return tap(this, () => {
      this.parsed = minimist(this.args, options ?? {})
    })
  }

  /**
   * Bind the given input `definition` with the provided input options and arguments.
   *
   * @param {InputDefinition} definition
   *
   * @returns {ArgvInput}
   *
   * @param definition
   */
  public bind (definition: InputDefinition): this {
    // TODO

    return this
  }

  /**
   * Validate the command line input against the definition.
   *
   * @returns {ArgvInput}
   *
   * @throws
   */
  public validate (): this {
    // TODO

    return this
  }

  /**
   * Returns the first argument. This typically represents the command name (if available).
   *
   * @returns {String}
   */
  firstArgument (): string {
    return this.parsed._[0] ?? ''
  }

  /**
   * Returns the provided input arguments.
   *
   * @returns {String[]}
   *
   * @example
   * ```bash
   * # Imagine this command input
   * $ ./cli command:name UserModel --dry-run -h
   *
   * # the input from above results in these arguments
   * ['command:name', 'UserModel']
   * ```
   */
  arguments (): string[] {
    return this.parsed._.slice(1)
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
    if (this.meta.options.isEmpty()) {
      const { _, ...rest } = this.parsed

      Object
        .entries({ ...rest })
        .forEach(([key, value]) => {
          this.meta.options.set(key, value)
        })
    }

    return this.meta.options
  }

  /**
   * Returns the option value for the given `name`.
   */
  option (name: string): unknown {
    return this.options().get(name)
  }

  /**
    * Set an option for the given `name` and assign the `value`.
    *
    * @param {String} name
    * @param {*} value
    */
  setOption (name: string, value: unknown): this {
    return tap(this, () => {
      this.meta.options.set(name, value)
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
