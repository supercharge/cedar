'use strict'

import kleur, { Kleur } from 'kleur'
import { tap } from '@supercharge/goodies'

export class ConsoleOutput {
  /**
   * Returns the colors instance.
   *
   * @returns {Kleur}
   */
  colors (): Kleur {
    return kleur
  }

  /**
   * Log an empty line to the console. Useful if you want to create some space to breath.
   *
   * @returns {ConsoleOutput}
   */
  emptyLine (): this {
    return this.log('')
  }

  /**
   * Log the given `message` to the console or create a chain for colored output.
   *
   * @param message
   *
   * @returns {ConsoleOutput}
   */
  log (message: string): this {
    return tap(this, () => {
      console.log(message)
    })
  }

  /**
   * Log the given warning `info` to the terminal.
   *
   * @param {String} message
   *
   * @returns {ConsoleOutput}
   */
  debug (message: string): this {
    if (typeof message === 'string') {
      return this.log(`${this.colors().blue().bold(' DEBUG ')} ${message}`)
    }

    throw new Error(`Unsupported input when logging a warning. Received: ${typeof message}`)
  }

  /**
   * Log the given warning `info` to the terminal.
   *
   * @param {String} message
   *
   * @returns {ConsoleOutput}
   */
  info (message: string): this {
    if (typeof message === 'string') {
      return this.log(`${this.colors().cyan().bold(' INFO ')} ${message}`)
    }

    throw new Error(`Unsupported input when logging a warning. Received: ${typeof message}`)
  }

  /**
   * Log the given warning `message` to the terminal.
   *
   * @param {String} message
   *
   * @returns {ConsoleOutput}
   */
  warn (message: string): this {
    if (typeof message === 'string') {
      return this.log(`${this.colors().yellow().bold(' WARN ')} ${message}`)
    }

    throw new Error(`Unsupported input when logging a warning. Received: ${typeof message}`)
  }

  /**
   * Log the given `error` to the terminal. The `error` can be a string or an error instance.
   *
   * @param {String|Error} error
   *
   * @returns {ConsoleOutput}
   */
  error (error: string | Error): this {
    if (typeof error === 'string') {
      return this.log(`${this.colors().red().bold(' ERROR ')} ${error}`)
    }

    if (error instanceof Error) {
      return this
        .log(`${this.colors().bgRed().white().bold(' ERROR ')}  ${error.message}`)
        .log(this.formatStack(error.stack))
    }

    throw new Error(`Unsupported input when logging an error. Received: ${typeof error}`)
  }

  /**
   * Returns the a formatted error stack, if available.
   *
   * @param {String} stack
   *
   * @returns {String}
   */
  private formatStack (stack?: string): string {
    if (!stack) {
      return ''
    }

    return stack
      .split('\n')
      .splice(1)
      .map(line => `${this.colors().dim(line)}`)
      .join('\n')
  }
}
