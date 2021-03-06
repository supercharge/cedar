'use strict'

import { Command } from './command'
import { InputOption } from '../input'
import { tap } from '@supercharge/goodies'

interface CommandGroup { name: string, commands: Command[] }

export class HelpCommand extends Command {
  /**
   * The command to show the help output for.
   */
  private command?: Command

  /**
   * Configure the command.
   */
  override configure (): void {
    this
      .name('help')
      .description('Show help for the application or a given command.')
      .ignoreValidationErrors()
  }

  /**
   * Assign the command for which to show the help output.
   *
   * @param command
   *
   * @returns {HelpCommand}
   */
  forCommand (command?: Command): this {
    return tap(this, () => {
      this.command = command
    })
  }

  /**
   * Determine whether a command is assigned and available.
   *
   * @returns {Boolean}
   */
  hasCommand (): boolean {
    return !!this.command
  }

  /**
   * Output all available commands in the application to the console.
   */
  override async run (): Promise<void> {
    this.hasCommand()
      ? this.showHelpForCommand()
      : this.showHelpForApplication()
  }

  /**
   * Show help output (description, usage, arguments, and options) for the given command.
   */
  private showHelpForCommand (): void {
    this
      .outputCommandDescription()
      .outputCommandUsage()
      .outputCommandArguments()
      .outputCommandOptions()
  }

  /**
   * Print the command description to the terminal.
   *
   * @returns {HelpCommand}
   */
  private outputCommandDescription (): HelpCommand {
    if (this.command?.hasDescription()) {
      this.io()
        .log(
          this.io().colors().bold().magenta('Description')
        )
        .log(`  ${this.command.getDescription()}`)
        .blankLine()
    }

    return this
  }

  /**
   * Print the command usage to the terminal.
   *
   * @returns {HelpCommand}
   */
  private outputCommandUsage (): HelpCommand {
    this.io()
      .log(
        this.io().colors().magenta().bold('Usage')
      )
      .log(`  ${this.command?.getName() as string} ${this.io().colors().white().dim(
          this.wrapCommandArguments()
        )}`
      )

    return this
  }

  /**
   * Create a string from required and optional arguments.
   *
   * @returns {HelpCommand}
   */
  private wrapCommandArguments (): string {
    return this.command?.definition().arguments().join(argument => {
      return argument.isRequired()
        ? `<${argument.name()}> `
        : `[${argument.name()}?] `
    }).trimEnd() as string
  }

  /**
   * Print command arguments to the terminal.
   *
   * @returns {HelpCommand}
   */
  private outputCommandArguments (): HelpCommand {
    const args = this.command?.definition().arguments()

    if (args?.isEmpty()) {
      return this
    }

    this.io()
      .blankLine()
      .log(
        this.io().colors().bold().magenta('Arguments')
      )

    const argumentWithLongestName = this.command?.definition().arguments().toArray().sort((a, b) => {
      return b.name().length - a.name().length
    }).shift()

    const maxWidth = argumentWithLongestName
      ? argumentWithLongestName.name().length
      : 0

    this.command?.definition().arguments().forEach(argument => {
      const whiteSpace = ''.padEnd(maxWidth - argument.name().length)

      this.io().log(`  ${this.io().colors().yellow(argument.name())} ${whiteSpace} ${this.io().colors().white().dim(argument.description())}`)
    })

    return this
  }

  /**
   * Print command options to the terminal.
   *
   * @returns {HelpCommand}
   */
  private outputCommandOptions (): HelpCommand {
    const options = this.command?.definition().options()

    return options?.isEmpty()
      ? this
      : this.outputOptions(options?.toArray() ?? [])
  }

  /**
   * Print the given input `options` to the terminal.
   *
   * @param {InputOption[]} options
   */
  outputOptions (options: InputOption[]): HelpCommand {
    this.io()
      .blankLine()
      .log(
        this.io().colors().bold().magenta('Options')
      )

    const optionWithLongestName = [...options]
      .sort((a, b) => {
        return this.totalOptionLength(b) - this.totalOptionLength(a)
      })
      .shift()

    const maxWidth = optionWithLongestName
      ? this.totalOptionLength(optionWithLongestName)
      : 0

    options.forEach(option => {
      this.outputOptionDetails(option, maxWidth)
    })

    return this
  }

  /**
   * Returns the number of characters required to print the name and shortcuts of the given `option`.
   *
   * @param {InputOption} option
   *
   * @returns {Number}
   */
  totalOptionLength (option: InputOption): number {
    return option.name().length + this.createShortcutOutputFor(option).length
  }

  /**
   * Outputs the shortcuts, name and description for the given `option`.
   *
   * @param {InputOption} option
   * @param {Number} maxWidth
   *
   * @returns {HelpCommand}
   */
  private outputOptionDetails (option: InputOption, maxWidth: number): void {
    const whiteSpace = ''.padEnd(maxWidth - this.totalOptionLength(option))

    const output = ['']
      .concat(this.io().colors().yellow(this.createShortcutOutputFor(option)))
      .concat(this.io().colors().yellow(`--${option.name()}`))
      .concat(`   ${whiteSpace}`)
      .concat(this.io().colors().white().dim(option.description()))
      .join('')

    this.io().log(`  ${output}`)
  }

  /**
   * Returns the output for all shortcuts assigned to the given `option`.
   *
   * @param {InputOption} option
   *
   * @returns {String}
   */
  private createShortcutOutputFor (option: InputOption): string {
    return option.shortcuts().map(shortcut => {
      return `-${shortcut}, `
    }).join('')
  }

  /**
   * Print the application help to the terminal. Contains the application
   * version, command overview and a list of globally available flags.
   */
  private showHelpForApplication (): void {
    this
      .outputApplicationVersion()
      .outputApplicationCommandList()
      .outputApplicationOptions()
  }

  /**
   * Print the application version to the terminal.
   */
  private outputApplicationVersion (): HelpCommand {
    return tap(this, () => {
      this.application().outputNameAndVersion()
      this.io().blankLine()
    })
  }

  /**
   * Print the command overview to the terminal.
   *
   * @returns {HelpCommand}
   */
  private outputApplicationCommandList (): HelpCommand {
    if (this.application().commands().isEmpty()) {
      this.io().log(
        this.io().colors().bold().magenta('No commands available.')
      )

      return this
    }

    const commandWithLongestName = [...this.application().commands()].sort((a, b) => {
      return b.getName().length - a.getName().length
    }).shift()

    const maxWidth = commandWithLongestName
      ? commandWithLongestName.getName().length
      : 0

    const groups = this.groupAndSortCommands()

    groups.forEach((group, index) => {
      this.isRoot(group)
        ? this.io().log(this.io().colors().bold().magenta('Available commands'))
        : this.io().log(this.io().colors().bold().magenta(` ${group.name}`))

      group.commands.forEach(command => {
        const whiteSpace = ''.padEnd(maxWidth - command.getName().length)

        this.io().log(`  ${this.io().colors().yellow(command.getName())} ${whiteSpace} ${this.io().colors().white().dim(command.getDescription())}`)
      })

      if (this.isNotLast(index, groups)) {
        this.io().blankLine()
      }
    })

    return this
  }

  /**
   * Returns an array of sorted commands grouped by their namespace.
   *
   * @returns {CommandGroup[]}
   */
  private groupAndSortCommands (): CommandGroup[] {
    return this.sortCommands(
      this.groupCommands()
    )
  }

  /**
   * Returns key-value pairs of namespaces with all their commands.
   *
   * @returns {}
   */
  groupCommands (): { [key: string]: Command[] } {
    return this.application()
      .commands()
      .reduce<{ [key: string]: Command[] }>((groups, command: Command) => {
      const tokens = command.getName().split(':')
      const namespace: string = tokens.length > 1 ? tokens[0] : 'root'

      const commands = groups[namespace] ?? []
      commands.push(command)

      groups[namespace] = commands

      return groups
    }, {})
  }

  /**
   * Sort all commands in the given `groups` by their name.
   *
   * @param groups
   * @returns {CommandGroup[]}
   */
  sortCommands (groups: { [key: string]: Command[] }): CommandGroup[] {
    return this.sortGroups(
      Object.keys(groups)
    ).map(name => {
      return {
        name,
        commands: groups[name].sort((a, b) => {
          return a.getName() < b.getName()
            ? -1
            : 1
        })
      }
    })
  }

  /**
   * Sort the given `groupNames` alphabetically, except the "root" group comes always first.
   *
   * @param {String[]} groupNames
   *
   * @returns {String[]}
   */
  sortGroups (groupNames: string[]): string[] {
    return [...groupNames].sort((a, b) => {
      if (a === 'root') return -1
      if (b === 'root') return 1
      if (b < a) return 1
      return -1
    })
  }

  /**
   * Determine whether the given `group` is the root group.
   *
   * @param {CommandGroup} group
   *
   * @returns {Boolean}
   */
  private isRoot (group: CommandGroup): boolean {
    return group.name === 'root'
  }

  /**
   * Determine whether the given `index` is not representing the last item in the given `groups`.
   *
   * @param {Number} index
   * @param {CommandGroup[]} groups
   *
   * @returns {Boolean}
   */
  private isNotLast (index: number, groups: CommandGroup[]): boolean {
    return index < groups.length - 1
  }

  /**
   * Print the globally available application flags to the terminal.
   */
  private outputApplicationOptions (): HelpCommand {
    const options = this.application().definition().options()

    return options.isEmpty()
      ? this
      : this.outputOptions(options.toArray())
  }
}
