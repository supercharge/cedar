'use strict'

import { tap } from '@supercharge/goodies/dist'
import { Command } from '../command'

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
   * Output all available commands in the application to the console.
   */
  async run (): Promise<void> {
    // TODO

    console.log('TODO: show help')

    if (this.command) {
      this.io().log('Show help for command: ' + this.command.constructor.name)
    }

    // await !!this.command
    //   ? this.application().showHelpFor(this.command)
    //   : this.application().showHelp()
  }
}
