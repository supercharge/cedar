'use strict'

import Map from '@supercharge/map'
import { Application } from './application'
import { ArgvInput } from './input/argv-input'
import { tap, upon } from '@supercharge/goodies'
import { InputOption } from './input/input-option'
import { ConsoleOutput } from './io/console-output'
import { CommandContract } from './command-contract'
import { InputArgument } from './input/input-argument'
import { InputDefinition } from './input/input-definition'
import { InputOptionBuilder } from './input/input-option-builder'
import { InputArgumentBuilder } from './input/input-argument-builder'

interface CommandMeta {
  name: string
  description: string | undefined
  application?: Application

  definition: InputDefinition
  arguments: Map<string, unknown>
  options: Map<string, unknown>

  output: ConsoleOutput
}

export class Command implements CommandContract {
  /**
   * Store the command meta data.
   */
  private readonly meta: CommandMeta

  /**
   * Create a new command instance.
   *
   * @param {String} name
   */
  constructor (name?: string) {
    this.meta = {
      name: name ?? this.constructor.name,
      description: undefined,

      definition: new InputDefinition(),
      arguments: new Map(),
      options: new Map(),

      output: new ConsoleOutput()
    }

    this.configure()
  }

  /**
   * Returns the command name.
   *
   * @returns {String}
   */
  getName (): string {
    return this.meta.name
  }

  /**
   * Set the command name.
   *
   * @returns {Command}
   */
  name (name: string): this {
    return tap(this, () => {
      this.meta.name = name
    })
  }

  /**
   * Returns the command description displayed when calling the help overview.
   *
   * @returns {String}
   */
  getDescription (): string {
    return this.meta.description ?? ''
  }

  /**
   * Set the command description
   *
   * @param {String} alias
   *
   * @returns {Command}
   */
  description (description: string): this {
    return tap(this, () => {
      this.meta.description = description
    })
  }

  /**
   * Set the console application instance.
   *
   * @param {Application} application
   *
   * @returns {Command}
   */
  setApplication (application: Application): this {
    return tap(this, () => {
      this.meta.application = application
    })
  }

  /**
   * Returns the console application instance.
   *
   * @returns {Application}
   */
  application (): Application {
    if (!this.meta.application) {
      throw new Error('Missing application instance.')
    }

    return this.meta.application
  }

  /**
   * Returns the input definition containing all registered options and arguments.
   *
   * @returns {InputDefinition}
   */
  definition (): InputDefinition {
    return this.meta.definition
  }

  /**
   * Determine whether this command is enabled. You may override this method in
   * your command and perform checks determining whether it should be enabled
   * or disabled in a given environment or under the given conditions.
   *
   * @returns {Boolean}
   */
  isEnabled (): boolean {
    return true
  }

  /**
   * Configure the command.
   */
  configure (): void {
    /**
     * This method is not abstract because users don’t need to implement it.
     * Sometimes commands can live without extra configuration besides the
     * command name. That’s the reason this method stays empty over here.
     */
  }

  /**
   * Creates a new argument for the given `name` for this command. Returns a
   * builder instance to configure the added argument with fluent methods.
   *
   * @param {String} name
   *
   * @returns {InputArgumentBuilder}
   *
   * @throws
   */
  addArgument (name: string): InputArgumentBuilder
  addArgument (name: string, callback: (builder: InputArgumentBuilder) => void): Command
  addArgument (name: string, callback?: any): any {
    if (!name) {
      throw new Error(`Missing argument name in command ${this.constructor.name}`)
    }

    const argument = new InputArgument(name)
    this.definition().addArgument(argument)

    const builder = new InputArgumentBuilder(argument)

    if (typeof callback === 'function') {
      callback(builder)
      return this
    }

    return builder
  }

  /**
   * Returns a map of key-value pairs of input arguments. This represents the merged
   * input definition from the configured arguments and the actual terminal input
   * provided by the user.
   *
   * @returns {Map}
   */
  private arguments (): Map<string, unknown> {
    return this.meta.arguments
  }

  /**
   * Returns the argument value for the argument identified by `name`. Throws an
   * error if no argument with the given `name` is defined in this command.
   *
   * @param {String} name
   *
   * @returns {*}
   */
  argument (name: string): unknown {
    if (this.definition().isMissingArgument(name)) {
      throw new Error(`The argument "${name}" does not exist in command "${this.constructor.name}"`)
    }

    return this.arguments().get(name) ?? this.definition().argument(name)?.defaultValue()
  }

  /**
   * Returns a map of key-value pairs of input options. This represents the merged
   * input definition from the configured options and the actual terminal input
   * provided by the user.
   *
   * @returns {Map}
   */
  private options (): Map<string, unknown> {
    return this.meta.options
  }

  /**
   * Returns the option value for the option identified by `name`. Throws an
   * error if no option with the given `name` is defined in this command.
   *
   * @param {String} name
   *
   * @returns {*}
   */
  option (name: string): unknown {
    if (this.definition().isMissingOption(name)) {
      throw new Error(`The option "${name}" does not exist in command "${this.constructor.name}"`)
    }

    return this.options().get(name) ?? this.definition().option(name)?.defaultValue()
  }

  /**
   * Creates a new argument for the given `name` for this command. Returns a
   * builder instance to configure the added argument with fluent methods.
   *
   * @param {String} name
   *
   * @returns {InputArgumentBuilder}
   *
   * @throws
   */
  addOption (name: string): InputOptionBuilder {
    if (!name) {
      throw new Error(`Missing option name in command ${this.constructor.name}`)
    }

    return upon(new InputOption(name), option => {
      this.definition().addOption(option)

      return new InputOptionBuilder(option)
    })
  }

  /**
   * Returns the output interface.
   *
   * @returns {ConsoleOutput}
   */
  io (): ConsoleOutput {
    return this.meta.output
  }

  /**
   * Run the command.
   *
   * The code to run is provided in the `handle` method. This
   * `handle` method must be implemented by subclasses.
   */
  async handle (argv: ArgvInput): Promise<any> {
    await this
      .bind(argv)
      .run()
  }

  /**
   * Bind the command definition against the `argv` input values.
   *
   * @param argv
   *
   * @returns {ThisType}
   */
  private bind (argv: ArgvInput): this {
    return this
      .assignArgumentsAndOptions(argv)
      .validate(argv)
  }

  /**
   * Assign the input values from `argv` to the argument and option definitions.
   *
   * @param argv
   *
   * @returns {ThisType}
   */
  private assignArgumentsAndOptions (argv: ArgvInput): this {
    return this
      .assignArgumentsFrom(argv)
      .assignOptionsFrom(argv)
  }

  /**
   * Assign the input values from `argv` to the defined arguments.
   *
   * @param argv
   *
   * @returns {ThisType}
   */
  private assignArgumentsFrom (argv: ArgvInput): this {
    argv.arguments().forEach((argument, index) => {
      // if the command is expecting another argument: add it
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
  private assignOptionsFrom (argv: ArgvInput): this {
    argv.options().forEach((name, value) => {
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
   * Validate the provided arguments and options (command line input)
   * against the input definition configured for this command.
   *
   * @returns {Command}
   *
   * @throws
   */
  private validate (_argv: ArgvInput): this {
    const missingArguments = this.definition().argumentNames().filter(argument => {
      return this.arguments().missing(argument) && this.definition().argument(argument)?.isRequired()
    })

    if (missingArguments.length > 0) {
      throw new Error(`Not enough arguments provided in command ${this.constructor.name}. Missing: ${
        missingArguments.join(', ')
      }`)
    }

    return this
  }

  /**
   * Handle an incoming console command for the given `input`.
   *
   * @returns {Promise}
   */
  run (): any | Promise<any> {
    throw new Error(`You must implement the "run" method in your "${this.getName()}" command`)
  }
}
