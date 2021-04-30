'use strict'

import { Command } from '../command'

export class ListCommands extends Command {
  /**
   * Configure the command.
   */
  configure (): void {
    this
      .name('list')
      .description('List all available commands.')
  }

  /**
   * Output all available commands in the application to the console.
   */
  async handle (): Promise<void> {
    this.outputAppVersion()
    this.outputCommandOverview()
    this.outputFlagOverview()
  }

  private outputAppVersion (): void {
    this.application().outputNameAndVersion()
    this.io().log('')
  }

  private outputCommandOverview (): void {
    const commandWithLongestName = [...this.application().commands()].sort((a, b) => {
      return b.getName().length - a.getName().length
    }).shift()

    const maxWidth = commandWithLongestName
      ? commandWithLongestName.getName().length
      : 0

    this.groupAndSortCommands().forEach(group => {
      if (group.name === 'root') {
        console.log(this.io().colors().bold().magenta('Available commands:'))
      } else {
        console.log(this.io().colors().bold().magenta(group.name))
      }

      group.commands.forEach(command => {
        const whiteSpace = ''.padEnd(maxWidth - command.getName().length)

        console.log(`  ${this.io().colors().yellow(command.getName())} ${whiteSpace} ${this.io().colors().white().dim(command.getDescription())}`)
      })

      console.log()
    })
  }

  private groupAndSortCommands (): Array<{ name: string, commands: Command[] }> {
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

  private sortCommands (groups: { [key: string]: Command[] }): Array<{ name: string, commands: Command[] }> {
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
