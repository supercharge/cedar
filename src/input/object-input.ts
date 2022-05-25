'use strict'

import { Input } from './input'
import { ValidationError } from '../errors'

export class ObjectInput extends Input {
  private readonly commandName: string

  /**
   * The input arguments. By default `process.argv.slice(2)`
   */
  private readonly parameters: { arguments?: Record<string, any>, options?: Record<string, any> }

  /**
   * Create a new instance for the given `args`.
   *
   * @param parameters
   */
  constructor (commandName: string, parameters?: { arguments?: Record<string, any>, options?: Record<string, any> }) {
    super()

    this.commandName = commandName
    this.parameters = parameters ?? { arguments: {}, options: {} }
  }

  /**
   * Parse the command line input (arguments and options).
   */
  parse (): this {
    return this
      .assignArgumentsFrom(this.parameters.arguments ?? {})
      .assignOptionsFrom(this.parameters.options ?? {})
  }

  /**
   * Assign the input values from `argv` to the defined arguments.
   *
   * @param argv
   *
   * @returns {ThisType}
   */
  private assignArgumentsFrom (args: { [key: string]: any }): this {
    Object.entries(args).forEach(([name, value]) => {
      // add another argument if the command expects it
      if (this.definition().hasArgument(name)) {
        const arg = this.definition().argument(name)

        return this.arguments().set(arg?.name(), value)
      }

      this.ensureExpectedArguments(Object.keys(args))

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

    if (args[0]) {
      throw new ValidationError(`No arguments expected for command "${this.commandName}"`)
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
    return ''

    // TODO
    // return this.parsed._[0] ?? ''
  }
}
