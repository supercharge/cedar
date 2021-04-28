'use strict'

import kleur, { Kleur } from 'kleur'

export class ConsoleOutput {
  /**
   * Log the given `message` to the console or create a chain for colored output.
   *
   * @param message
   *
   * @return {undefined | Kleur}
   */
  log (message?: undefined | null): Kleur
  log (message: string): void
  log (message: any): any {
    if (message === undefined || message === null) {
      return kleur
    }

    console.log(message)
  }

  error (message: string | Error): void {
    if (typeof message === 'string') {
      this.log(
        `${this.log().red().bold(' ERROR ')} ${message}`
      )
    }

    this.log(
      `${this.log().red().bold(' error ')} ${(message as Error).message}\n`
    )
    this.log(
      `${this.log().bgRed().white().bold(' error ')} ${(message as Error).message}\n`
    )
    this.log(
      `${this.log().red().bold(' ERROR ')}  ${(message as Error).message}\n`
    )
    this.log(
      `${this.log().bgRed().white().bold(' ERROR ')}  ${(message as Error).message}`
    )

    const lines = (message as Error).stack?.split('\n')
      .splice(1)
      .map((line: string) => {
        return `${this.log().dim(line)}`
      })
      .join('\n')

    this.log(this.log().dim(lines ?? ''))
  }
}
