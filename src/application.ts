'use strict'

import Set from '@supercharge/set'
import Str from '@supercharge/strings'
import { tap } from '@supercharge/goodies'
import { Command } from './command/command'
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
  commands: Set<Command>

  /**
   * The default command name to run on empty input.
   */
  defaultCommand: string

  /**
   * The default command to run on empty input.
   */
  output: ConsoleOutput

  /**
   * The application’s input definition. Contains the `version` and `help` flags by default.
   */
  definition: InputDefinition

  /**
   * Determine whether the help command should be used.
   */
  wantsHelp: boolean

  /**
   * Determine whether the application is initialized.
   */
  initialized: boolean
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
      commands: new Set(),
      output: new ConsoleOutput(),
      definition: this.defaultInputDefinition(),
      initialized: false,

      wantsHelp: false,
      defaultCommand: ''
    }
  }

  /**
   * Initializes the application.
   */
  init (): void {
    if (this.isInitialized()) {
      return
    }

    this
      .markAsInitialized()
      .defaultCommands()
      .forEach(command => {
        this.add(command)
      })
  }

  /**
   * Determine whether the application is already initialized.
   *
   * @returns {Boolean}
   */
  isInitialized (): boolean {
    return this.meta.initialized
  }

  /**
   * Mark this application as initialized.
   *
   * @returns {Application}
   */
  markAsInitialized (): Application {
    return tap(this, () => {
      this.meta.initialized = true
    })
  }

  /**
   * Returns the list of default commands for this application.
   *
   * @returns {Command[]}
   */
  defaultCommands (): Command[] {
    return [
      new HelpCommand()
    ]
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
   * @returns {Set<Command>}
   */
  commands (): Set<Command> {
    this.init()

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
   * Returns the default command name.
   *
   * @returns {String}
   */
  defaultCommand (): string {
    return this.meta.defaultCommand
  }

  /**
   * Determine whether the application should use the help command.
   *
   * @returns {Boolean}
   */
  wantsHelp (): boolean {
    return this.meta.wantsHelp
  }

  /**
   * Determine whether the application should use the help command.
   *
   * @returns {Application}
   */
  markAsWantingHelp (): Application {
    return tap(this, () => {
      this.meta.wantsHelp = true
    })
  }

  /**
   * Determine whether the application should use the help command.
   *
   * @returns {Application}
   */
  markAsNotWantingHelp (): Application {
    return tap(this, () => {
      this.meta.wantsHelp = false
    })
  }

  /**
   * Assign the given `command` as the default command for this application.
   *
   * @param {Command} command
   *
   * @returns {Application}
   */
  useDefaultCommand (command: string | Command): Application {
    if (!Str.isString(command) && !(command instanceof Command)) {
      throw new Error('The default command must either be a command name (as string) or a "Command" instance')
    }

    const commandName = command instanceof Command
      ? command.getName()
      : command

    if (Str.isString(command) && this.isMissing(commandName)) {
      throw new Error(`Cannot set default command "${commandName}" because it is not registered`)
    }

    if (command instanceof Command && this.isMissing(commandName)) {
      this.add(command)
    }

    return tap(this, () => {
      this.meta.defaultCommand = commandName
    })
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

  /**
   * Add the given list of `commands` to this application.
   *
   * @param {Command[]} commands
   *
   * @returns {Application}
   */
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
    if (!command.getName()) {
      throw new Error(`Command "${command.constructor.name}" is missing a command name.`)
    }

    if (command.isEnabled()) {
      command.setApplication(this)
      this.commands().add(command)
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
      const commandName = argv.firstArgument() || this.defaultCommand()

      if (argv.hasOption('help')) {
        this.markAsWantingHelp()
      }

      const command = this.get(commandName)
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
   *
   * @throws
   */
  get (name: string): Command {
    const command = this.commands().find(command => {
      return command.getName() === name
    })

    if (!name && !command) {
      this.markAsWantingHelp()
    }

    if (name && !command) {
      throw new Error(`Command "${name}" is not registered`)
    }

    return this.wantsHelp()
      ? this.helpCommandFor(command)
      : command as Command
  }

  /**
   * Returns an instance of the help command for the given `command`.
   *
   * @param {Command|undefined} command
   *
   * @returns {HelpCommand}
   */
  private helpCommandFor (command: Command | undefined): HelpCommand {
    this.markAsNotWantingHelp()

    return (this.get('help') as HelpCommand).forCommand(command)
  }

  /**
   * Determine whether the application has a command for the given `name`.
   *
   * @param {String} name
   *
   * @returns {Boolean}
   */
  has (name: string): boolean {
    try {
      return !!this.get(name)
    } catch (error) {
      return false
    }
  }

  /**
   * Determine whether the application is missing a command for the given `name`.
   *
   * @param {String} name
   *
   * @returns {Boolean}
   */
  isMissing (name: string): boolean {
    return !this.has(name)
  }

  /**
   * Returns the list of unique command namespaces. It does
   * not return the root namespace which always exists.
   *
   * @returns {String[]}
   */
  namspaces (): string[] {
    return this.commands()
      .filter(command => {
        return command.isEnabled()
      })
      .filter(command => {
        return command.getName().split(':').length > 1
      })
      .map(command => {
        return command.getName().split(':')[0]
      })
      .toArray()
  }

  /**
   * Print the application name and version to the console.
   */
  outputNameAndVersion (): void {
    if (this.name() && this.version()) {
      this.output().log(`${this.name()} ${this.output().colors().green(this.version())}`)
      return
    }

    if (this.name()) {
      this.output().log(this.name())
    }

    if (this.version()) {
      this.output().success(this.version())
    }
  }

  /**
   * Termine the application. Exits the process with exit code `0` if the `error`
   * is empty. In case an error happened, the error will be logged to the
   * console and the process exits with status code `1`.
   *
   * @param {Error} error
   */
  async terminate (error?: Error): Promise<void> {
    const exitCode = error ? 1 : 0

    if (!error) {
      return process.exit(exitCode)
    }

    this.output().blankLine().error(error).blankLine()
    process.exit(exitCode)
  }
}
