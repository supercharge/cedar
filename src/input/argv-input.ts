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

    this
      .assignArgumentsFrom(args.slice(1))
      .assignOptionsFrom(options)
  }

  /**
   * Assign the input values from `argv` to the defined arguments.
   *
   * @param argv
   *
   * @returns {ThisType}
   */
  private assignArgumentsFrom (args: string[]): this {
    args.forEach((argument, index) => {
      // add another argument if the command expects it
      if (this.definition().hasArgument(index)) {
        const arg = this.definition().argument(index)

        return this.arguments().set(arg?.name() as string, argument)
      }

      // too many arguments provided
      if (this.definition().arguments().size()) {
        throw new Error(`Too many arguments in command ${this.constructor.name}: expected arguments "${
          this.definition().argumentNames().join(', ')
        }"`)
      }

      throw new Error(`No arguments expected in command ${this.constructor.name}`)
    })

    return this
  }

  /**
   * Assign the input values from `argv` to the defined options.
   *
   * @param argv
   *
   * @returns {ThisType}
   */
  private assignOptionsFrom (options: { [key: string]: unknown }): this {
    Object.entries(options).forEach(([name, value]) => {
      if (this.definition().hasOptionShortcut(name)) {
        const option = this.definition().optionByShortcut(name)

        return this.options().set(option?.name() as string, value
        )
      }

      if (this.definition().hasOption(name)) {
        return this.options().set(name, value)
      }

      throw new Error(`Unexpected option "${name}" in command ${this.constructor.name}`)
    })

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
}
