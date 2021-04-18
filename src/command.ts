'use strict'

import { tap } from '@supercharge/goodies'
import { Application } from './application'
import { CommandContract } from './command-contract'
import { InputArgument } from './input/input-argument'
import { InputArgumentBuilder } from './input/input-argument-builder'

interface CommandMeta {
  name: string
  description: string | undefined
  application: Application | undefined

  aliases: string[]
  arguments: InputArgument[]
}

export class Command implements CommandContract {
  private readonly meta: CommandMeta

  constructor (name?: string) {
    this.meta = {
      name: name ?? this.constructor.name,
      description: undefined,
      aliases: [],

      arguments: [],
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

  setApplication (application: Application): this {
    return tap(this, () => {
      this.meta.application = application
    })
  }

  addAlias (alias: string): this {
    return tap(this, () => {
      this.aliases().push(alias)
    })
  }

  /**
   * Returns the aliases for this command. For example, this command may have the
   * `migration:run` name. An alias for this command name can be `migrate`.
   *
   * @returns {String[]}
   */
  aliases (): string[] {
    return this.meta.aliases
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

  arguments (): InputArgument[] {
    return this.meta.arguments
  }

  addArgument (name: string): InputArgumentBuilder {
    if (!name) {
      throw new Error(`Missing argument name in command ${this.constructor.name}`)
    }

    const argument = new InputArgument(name)

    this.arguments().push(argument)

    return new InputArgumentBuilder(argument)
  }

  async run (): Promise<any> {
    await this.handle()
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
