'use strict'

import { Input } from './input'
import { tap } from '@supercharge/goodies'
import minimist, { ParsedArgs, Opts as ParseOptions } from 'minimist'

export class ArgvInput extends Input {
  /**
   * The input arguments. By default `process.argv.slice(2)`
   */
  private readonly args: string[]

  /**
   * The parsed input tokens.
   */
  private parsed: ParsedArgs

  /**
   * Create a new instance for the given `args`.
   *
   * @param args
   */
  constructor (args?: string[]) {
    super()

    this.args = args ?? process.argv.slice(2)
    this.parsed = { _: [] }
  }

  /**
   * Parse the command line input (arguments and options).
   */
  parse (options?: ParseOptions): this {
    return tap(this, () => {
      this.parsed = minimist(this.args, options ?? {})
      this.assignParsedInput()
    })
  }

  /**
   * Assign the parsed arguments and options.
   */
  private assignParsedInput (): void {
    const { _: args, ...options } = this.parsed

    this.arguments().push(...args.slice(1))

    Object.entries(options).forEach(([name, value]) => {
      this.options().set(name, value)
    })
  }

  /**
   * Returns the first argument. This typically represents the command name (if available).
   *
   * @returns {String}
   */
  firstArgument (): string {
    return this.parsed._[0] ?? ''
  }
}
