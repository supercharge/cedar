'use strict'

import { Command } from './command'
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
  configure (): void {
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
  async run (): Promise<void> {
    this.hasCommand()
      ? this.showHelpForCommand()
      : this.showHelpForApplication()
  }

  private showHelpForCommand (): void {
    this
      .outputCommandDescription()
      .outputCommandUsage()
      .outputCommandArguments()
      .outputCommandOptions()
  }

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

  private outputCommandUsage (): HelpCommand {
    this.io()
      .log(
        this.io().colors().magenta().bold('Usage')
      )
      .log(`  ${this.command?.getName() as string} ${this.io().colors().white().dim(
          this.wrapCommandArguments()
        )}`
      )
      .blankLine()

    return this
  }

  private wrapCommandArguments (): string {
    return this.command?.definition().arguments().join(argument => {
      return argument.isRequired()
        ? `<${argument.name()}> `
        : `[${argument.name()}?] `
    }).trimEnd() as string
  }

  private outputCommandArguments (): HelpCommand {
    const args = this.command?.definition().arguments()

    if (args?.isEmpty()) {
      return this
    }

    this.io().log(
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

      console.log(`  ${this.io().colors().yellow(argument.name())} ${whiteSpace} ${this.io().colors().white().dim(argument.description())}`)
    })

    return tap(this, () => {
      this.io().blankLine()
    })
  }

  private outputCommandOptions (): HelpCommand {
    const options = this.command?.definition().options()

    if (options?.isEmpty()) {
      return this
    }

    this.io().log(
      this.io().colors().bold().magenta('Options/Flags')
    )

    const optionWithLongestName = this.command?.definition().options().toArray().sort((a, b) => {
      return b.name().length - a.name().length
    }).shift()

    const maxWidth = optionWithLongestName
      ? optionWithLongestName.name().length
      : 0

    this.command?.definition().options().forEach(option => {
      const whiteSpace = ''.padEnd(maxWidth - option.name().length)

      console.log(`  ${this.io().colors().yellow(option.name())} ${whiteSpace} ${this.io().colors().white().dim(option.description())}`)
    })

    return tap(this, () => {
      this.io().blankLine()
    })
  }

  private showHelpForApplication (): void {
    this.outputAppVersion()
    this.outputCommandOverview()
    this.outputFlagOverview()
  }

  /**
   * Print the application version to the terminal.
   */
  private outputAppVersion (): void {
    this.application().outputNameAndVersion()
    this.io().blankLine()
  }

  private outputCommandOverview (): void {
    const commandWithLongestName = [...this.application().commands()].sort((a, b) => {
      return b.getName().length - a.getName().length
    }).shift()

    const maxWidth = commandWithLongestName
      ? commandWithLongestName.getName().length
      : 0

    this.groupAndSortCommands().forEach(group => {
      this.isRoot(group)
        ? console.log(this.io().colors().bold().magenta('Available commands:'))
        : console.log(this.io().colors().bold().magenta(` ${group.name}`))

      group.commands.forEach(command => {
        const whiteSpace = ''.padEnd(maxWidth - command.getName().length)

        console.log(`  ${this.io().colors().yellow(command.getName())} ${whiteSpace} ${this.io().colors().white().dim(command.getDescription())}`)
      })

      console.log()
    })
  }

  private isRoot (group: CommandGroup): boolean {
    return group.name === 'root'
  }

  private groupAndSortCommands (): CommandGroup[] {
    return this.sortCommands(
      this.groupCommands()
    )
  }

  private groupCommands (): { [key: string]: Command[] } {
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

  private sortCommands (groups: { [key: string]: Command[] }): CommandGroup[] {
    return Object.keys(groups).sort((curr, prev) => {
      if (curr === 'root') return -1
      if (prev === 'root') return -1

      if (curr < prev) return 1
      if (curr > prev) return -1
      return 0
    }).map(name => {
      return {
        name,
        commands: groups[name].sort((a, b) => {
          if (a.getName() < b.getName()) return 1
          if (a.getName() > b.getName()) return -1
          return 0
        })
      }
    })
  }

  private outputFlagOverview (): void {
  }
}
