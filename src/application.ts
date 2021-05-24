'use strict'

import kleur from 'kleur'
import { Command } from './command/command'
import { tap } from '@supercharge/goodies'
import { ArgvInput } from './input/argv-input'
import { InputOption } from './input/input-option'
import { HelpCommand } from './command/help-command'
import { InputArgument } from './input/input-argument'
import { ConsoleOutput } from '@supercharge/console-io'
import { InputDefinition } from './input/input-definition'

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

  /**
   * The default command to run on empty input.
   */
  defaultCommand: Command

  /**
   * The default command to run on empty input.
   */
  output: ConsoleOutput

  /**
   * The application’s input definition. Contains the `version` and `help` flags by default.
   */
  definition: InputDefinition
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
      commands: [],
      output: new ConsoleOutput(),
      definition: this.defaultInputDefinition(),
      defaultCommand: new HelpCommand().setApplication(this)
    }
  }

  /**
   * Returns the application’s input definition, containing global flags for `version` and `help`.
   *
   * @returns {InputDefinition}
   */
  definition (): InputDefinition {
    return this.meta.definition
  }

  /**
   * Returns the default input definition for this application.
   *
   * @returns {InputDefinition}
   */
  defaultInputDefinition (): InputDefinition {
    return new InputDefinition([
      new InputArgument('command').setDescription('The command to run').markAsRequired(),
      new InputOption('version').addShortcuts('v').setDescription('Print the application version to the terminal.'),
      new InputOption('help').addShortcuts('h').setDescription('Display the help output for the given command or this application.')
    ])
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
   * Returns the console output instance.
   *
   * @returns {ConsoleOutput}
   */
  output (): ConsoleOutput {
    return this.meta.output
  }

  /**
   * Returns the default command.
   *
   * @returns {Command}
   */
  defaultCommand (): Command {
    return this.meta.defaultCommand
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
    let argv = new ArgvInput(input)

    try {
      argv = argv.bind(this.definition())
    } catch (error) {
      // Ignore validation error. At this point, we want the command name
    }

    if (argv.hasOption('version')) {
      return this.outputNameAndVersion()
    }

    try {
      await this.showHelpWhenNecessary(argv)

      const command = this.get(argv.firstArgument()) ?? this.defaultCommand()
      await command.handle(argv)

      await this.terminate()
    } catch (error) {
      await this.terminate(error)
    }
  }

  /**
   * Returns the command for the given `name`. Throws an error if
   * no command is registered for the given name.
   *
   * @param {String} name
   *
   * @returns {Command}
   */
  get (name: string): Command | undefined {
    const command = this.commands().find(command => {
      return command.getName() === name
    })

    if (command) {
      return command
    }

    if (name) {
      throw new Error(`"${name}" command not registered`)
    }
  }

  /**
   * Print help output to the terminal. If available, print help for the specific `command`.
   *
   * @param argv
   * @param command
   */
  async showHelpWhenNecessary (argv: ArgvInput): Promise<void> {
    if (argv.isMissingOption('help')) {
      return
    }

    await new HelpCommand()
      .setApplication(this)
      .forCommand(
        this.get(argv.firstArgument())
      )
      .handle(argv)

    await this.terminate()
  }

  /**
   * Returns the list of default aliases, like `help: 'h'` and `version: 'v'`.
   *
   * @returns {Object}
   */
  defaultAliases (): { [key: string]: string|string[] } {
    return { help: 'h', version: 'v' }
  }

  /**
   * Print the application name and version to the console.
   */
  outputNameAndVersion (): void {
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

  /**
   * Termine the application. Exits the process with exit code `0` if the `error`
   * is empty. In case an error happened, the error will be logged to the
   * console and the process exits with status code `1`.
   *
   * @param {Error} error
   */
  private async terminate (error?: Error): Promise<void> {
    const exitCode = error ? 1 : 0

    if (!error) {
      return process.exit(exitCode)
    }

    this.output().blankLine().error(error)

    return process.exit(exitCode)
  }
}
