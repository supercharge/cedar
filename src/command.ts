'use strict'

import Map from '@supercharge/map'
import { Application } from './application'
import { ArgvInput } from './input/argv-input'
import { tap, upon } from '@supercharge/goodies'
import { InputOption } from './input/input-option'
import { CommandContract } from './command-contract'
import { InputArgument } from './input/input-argument'
import { InputArgumentBuilder } from './input/input-argument-builder'
import { InputOptionBuilder } from './input/input-option-builder'
import { ConsoleOutput } from './io/console-output'

interface CommandMeta {
  name: string
  description: string | undefined
  application?: Application

  aliases: Set<string>

  options: Map<string, InputOption>
  arguments: Map<string, InputArgument>

  output: ConsoleOutput
}

export class Command implements CommandContract {
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
      aliases: new Set(),

      options: new Map(),
      arguments: new Map(),

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
   * Add the given `alias` as an alternative command name. For example: imagine your
   * CLI provides a database migration command. You may want to run the migrations
   * using `migration:run` or `migrate`. You can do this by using an alias.
   *
   * @param {String} alias
   *
   * @returns {Command}
   */
  addAlias (alias: string): this {
    return tap(this, () => {
      this.meta.aliases.add(alias)
    })
  }

  /**
   * Returns the aliases for this command. For example, this command may have the
   * `migration:run` name. An alias for this command name can be `migrate`.
   *
   * @returns {String[]}
   */
  aliases (): string[] {
    return Array.from(this.meta.aliases)
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
   * Returns the input arguments for this command.
   *
   * @returns {Map}
   */
  arguments (): Map<string, InputArgument> {
    return this.meta.arguments
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
  addArgument (name: string): InputArgumentBuilder {
    if (!name) {
      throw new Error(`Missing argument name in command ${this.constructor.name}`)
    }

    return upon(new InputArgument(name), argument => {
      this.arguments().set(name, argument)

      return new InputArgumentBuilder(argument)
    })
  }

  /**
   * Returns the input options for this command.
   *
   * @returns {Map}
   */
  options (): Map<string, InputOption> {
    return this.meta.options
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
      this.options().set(name, option)

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
  async run (_argv: ArgvInput): Promise<any> {
    try {
      await this.handle()
    } catch (error) {
      // pretty-print command error

      this.io().log('')
      this.io().error(error)
      this.io().log('')
    }
  }

  /**
   * Handle an incoming console command for the given `input`.
   *
   * @returns {Promise}
   */
  handle (): any | Promise<any> {
    throw new Error(`You must implement the "handle" method in your "${this.getName()}" command`)
  }
}
