'use strict'

import { Command } from './command'
import { tap } from '@supercharge/goodies'
import { ArgvInput } from './input/argv-input'
// import { findAllBrackets } from './utils'

interface ApplicationMeta {
  /**
   * Stores the application’s name.
   */
  name: string

  commands: Command[]
}
export class Application {
  private readonly meta: ApplicationMeta

  /**
   * Create a new console application instance.
   *
   * @param app
   */
  constructor (name: string = '') {
    this.meta = {
      name,
      commands: []
    }
  }

  /**
   * Set the application’s name.
   *
   * @param {String} name
   *
   * @returns {Application}
   */
  setName (name: string): this {
    return tap(this, () => {
      this.meta.name = name
    })
  }

  /**
   * Returns the application’s name.
   *
   * @returns {String}
   */
  name (): string {
    return this.meta.name
  }

  /**
   * Returns the registered commands.
   *
   * @returns {Command[]}
   */
  commands (): Command[] {
    return this.meta.commands
  }

  /**
   * Register a new command for the given `name`.
   *
   * @param {String} name
   * @param {Function} commandHandler
   *
   * @returns {Application}
   */
  register (name: string, commandHandler: (command: Command) => void): this {
    const command = new Command(name)

    if (typeof commandHandler === 'function') {
      commandHandler(command)
    }

    return this.add(command)
  }

  addCommands (commands: Command[]): this {
    ([] as Command[])
      .concat(commands)
      .forEach(command => {
        this.add(command)
      })

    return this
  }

  /**
   * Add the given `command` to this application.
   *
   * @param {Command} command
   *
   * @returns {Application}
   */
  add (command: Command): this {
    if (command.isEnabled()) {
      command.setApplication(this)
      this.commands().push(command)
    }

    return this
  }

  /**
   * Runs the incoming console command for the given `input`.
   * By default, `input` equals `process.argv`.
   *
   * @param {String[]} input - command line arguments (process.argv)
   *
   * @throws
   */
  async run (input?: string[]): Promise<void> {
    const argv = new ArgvInput(input)

    const command = this.commands().find(command => {
      return command.name() === argv.firstArgument()
    })

    if (command) {
      return await command.run()
    }

    throw new Error(`No command registered with name "${argv.firstArgument()}"`)
  }
}
