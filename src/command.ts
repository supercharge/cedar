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
  ignoreValidationErrors: boolean
  application?: Application

  definition: InputDefinition
  input: ArgvInput

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
      ignoreValidationErrors: false,

      definition: new InputDefinition(),
      input: new ArgvInput(),

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
   * Ignore validation errors when binding the terminal input to the arguments and
   * options defined in the command. For example, this is useful in the help
   * command because it can’t know argumentss and options of other commands.
   *
   * @returns {ThisType}
   */
  ignoreValidationErrors (): this {
    return tap(this, () => {
      this.meta.ignoreValidationErrors = true
    })
  }

  /**
   * Determine whether to ignore validation errors.
   *
   * @returns {Boolean}
   */
  shouldIgnoreValidationErrors (): boolean {
    return this.meta.ignoreValidationErrors
  }

  /**
   * Determine whether to **not ignore** validation errors.
   *
   * @returns {Boolean}
   */
  shouldThrowValidationErrors (): boolean {
    return !this.shouldIgnoreValidationErrors()
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

  private input (): ArgvInput {
    if (!this.meta.input) {
      throw new Error('Missing input')
    }

    return this.meta.input
  }

  /**
   * Assign the given `argv` input to this command.
   *
   * @param argv
   *
   * @returns {ThisType}
   */
  private withInput (argv: ArgvInput): this {
    try {
      this.meta.input = argv.bind(this.definition())
    } catch (error) {
      if (this.shouldThrowValidationErrors()) {
        throw error
      }
    }

    return this
  }

  /**
   * Returns a map of key-value pairs of input arguments. This represents the merged
   * input definition from the configured arguments and the actual terminal input
   * provided by the user.
   *
   * @returns {Map}
   */
  private arguments (): Map<string, unknown> {
    return this.input().arguments()
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
    return this.input().options()
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
    await this.withInput(argv).run()
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
