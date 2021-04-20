'use strict'

import Map from '@supercharge/map'
import { Application } from './application'
import { tap, upon } from '@supercharge/goodies'
import { CommandContract } from './command-contract'
import { InputArgument } from './input/input-argument'
import { InputArgumentBuilder } from './input/input-argument-builder'
import { ArgvInput } from './input/argv-input'

interface CommandMeta {
  name: string
  description: string | undefined
  application: Application | undefined

  aliases: Set<string>

  arguments: Map<string, InputArgument>
}

export class Command implements CommandContract {
  private readonly meta: CommandMeta

  constructor (name?: string) {
    this.meta = {
      name: name ?? this.constructor.name,
      description: undefined,
      aliases: new Set(),

      arguments: new Map(),
      application: undefined
    }

    this.configure()
  }

  /**
   * Returns the command name.
   *
   * @returns {String}
   */
  name (): string {
    return this.meta.name
  }

  /**
   * Returns the command description displayed when calling the help overview.
   *
   * @returns {String}
   */
  description (): string | undefined {
    return this.meta.description
  }

  /**
   * Returns the command description displayed when calling the help overview.
   *
   * @returns {String}
   */
  setDescription (description: string): this {
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
    }
  }

  /**
   * Handle an incoming console command for the given `input`.
   *
   * @returns {Promise}
   */
  handle (): any | Promise<any> {
    throw new Error(`You must implement the "handle" method in your "${this.constructor.name}" command`)
  }
}
