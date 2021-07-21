'use strict'

import { Input } from './input'
import { tap } from '@supercharge/goodies'
import { ValidationError } from '../errors'
import minimist, { ParsedArgs } from 'minimist'

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

    this.parsed = { _: [] }
    this.args = args ?? process.argv.slice(2)
  }

  /**
   * Parse the command line input (arguments and options).
   */
  parse (): this {
    return tap(this, () => {
      this.parsed = minimist(this.args)
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

        return this.arguments().set(arg?.name(), argument)
      }

      this.ensureExpectedArguments(args)

      throw new ValidationError(`Too many arguments: expected arguments "${
        this.definition().argumentNames().join(', ')
      }"`)
    })

    return this
  }

  /**
   * Ensure the input definition expects arguments. Throws an
   *  error if the comamnd doesn’t expect any arg arguments.
   *
   * @param {String[]} args
   *
   * @throws
   */
  private ensureExpectedArguments (args: string[]): void {
    if (this.definition().arguments().isNotEmpty()) {
      // expects arguments
      return
    }

    if (this.firstArgument()) {
      throw new ValidationError(`No arguments expected for command "${this.firstArgument()}"`)
    }

    throw new ValidationError(`No arguments expected, got ${args.join(', ')}`)
  }

  /**
   * Assign the input values from `argv` to the defined options.
   *
   * @param argv
   *
   * @returns {ThisType}
   */
  private assignOptionsFrom (options: { [key: string]: any }): this {
    Object.entries(options).forEach(([name, value]) => {
      if (this.definition().hasOptionShortcut(name)) {
        const option = this.definition().optionByShortcut(name)

        return this.setOption(option?.name(), value)
      }

      if (this.definition().isMissingOption(name)) {
        throw new ValidationError(`Unexpected option "${name}"`)
      }

      const option = this.definition().option(name)

      if (option.isRequired() && !value) {
        throw new ValidationError(`The option "${name}" requires a value`)
      }

      this.options().set(name, value)
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
