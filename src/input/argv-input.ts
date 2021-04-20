'use strict'

import { tap } from '@supercharge/goodies'
import minimist, { ParsedArgs } from 'minimist'

export class ArgvInput {
  /**
   * The input tokens.
   */
  private tokens: string[]

  /**
   * The parsed input tokens.
   */
  private parsed: ParsedArgs

  constructor (argv?: string[]) {
    this.tokens = argv ?? process.argv.slice(2)
    this.parsed = { _: [] }
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
  parse (): void {
    this.parsed = minimist(this.tokens)
  }

  /**
   * Returns the first argument. This typically represents the command name (if available).
   *
   * @returns {String}
   */
  firstArgument (): string {
    return this.parsed._[0]
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
  options (): {[key: string]: unknown} {
    const { _, ...rest } = this.parsed

    return { ...rest }
  }
}
