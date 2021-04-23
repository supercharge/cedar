'use strict'

import kleur from 'kleur'
import { Command } from './command'
import { tap } from '@supercharge/goodies'
import { ArgvInput } from './input/argv-input'
// import { findAllBrackets } from './utils'

interface ApplicationMeta {
  /**
   * Stores the application’s name.
   */
  name: string

  /**
   * Stores the application’s version.
   */
  version?: string

  /**
   * The command list.
   */
  commands: Command[]
}

export class Application {
  /**
   * Stores the application’s meta data, like name, version, commands.
   */
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
   * Set the application’s version.
   *
   * @param {String} version
   *
   * @returns {Application}
   */
  setVersion (version: string): this {
    return tap(this, () => {
      this.meta.version = version
    })
  }

  /**
   * Returns the application’s version.
   *
   * @returns {String}
   */
  version (): string {
    return this.meta.version ?? ''
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
    const argv = new ArgvInput(input).parse({
      alias: this.defaultAliases()
    })

    if (argv.hasOption('version')) {
      return this.outputVersion()
    }

    const commandName = argv.firstArgument()

    const command = this.commands().find(command => {
      return command.name() === commandName
    })

    if (command) {
      return await command.run(argv)
    }

    if (commandName) {
      throw new Error(`No command registered with name "${commandName}"`)
    }

    await this.defaultCommand().run(argv)
  }

  /**
   * Returns the list of default aliases, like `help: 'h'` and `version: 'v'`.
   *
   * @returns {Object}
   */
  defaultAliases (): {[key: string]: string|string[]} {
    return { help: 'h', version: 'v' }
  }

  /**
   * Print the application version to the console.
   */
  outputVersion (): void {
    if (this.name() && this.version()) {
      return console.log(`${this.name()} ${kleur.green(this.version())}`)
    }

    if (this.name()) {
      console.log(this.name())
    }

    if (this.version()) {
      console.log(kleur.green(this.version()))
    }
  }

  defaultCommand (): Command {
    return this.meta.defaultCommand
  }
}
