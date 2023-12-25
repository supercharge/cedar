'use strict'

export interface CommandContract {
  /**
   * Returns the command name.
   */
  getName (): string

  /**
   * Returns the command description displayed when calling the help overview.
   */
  getDescription (): string | undefined

  /**
   * Configure the command.
   */
  configure (): void

  /**
   * Run the console command.
   */
  run(): Promise<any> | any
}
