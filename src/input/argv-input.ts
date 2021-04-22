'use strict'

import Map from '@supercharge/map'
import { tap } from '@supercharge/goodies'
import minimist, { ParsedArgs, Opts as Options } from 'minimist'
// import { InputInterface } from './input-interface'

export class ArgvInput {// implements InputInterface {
  /**
   * The input tokens.
   */
  private tokens: string[]

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
    this.tokens = args ?? process.argv.slice(2)
    this.parsed = { _: [] }

    this.meta = { options: new Map() }

    this.parse()
  }

  setTokens (tokens: string[]): this {
    return tap(this, () => {
      this.tokens = tokens
    })
  }

  /**
   * Parse the input.
   */
  parse (options?: Options): void {
    this.parsed = minimist(this.tokens, options ?? {})
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
