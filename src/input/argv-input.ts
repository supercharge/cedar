'use strict'

import minimist from 'minimist'
import { tap } from '@supercharge/goodies'

export class ArgvInput {
  /**
   * The input tokens.
   */
  private tokens: string[]

  /**
   * The parsed input tokens.
   */
  private parsed: {
    _: string[]
    [key: string]: unknown
  }

  constructor (argv?: string[]) {
    this.tokens = argv ?? process.argv.slice(2)
    this.parsed = { _: [] }
    this.parse()
  }

  setTokens (tokens: string[]): this {
    return tap(this, () => {
      this.tokens = tokens
    })
  }

  /**
   * Parse the input.
   */
  parse (): void {
    this.parsed = minimist(this.tokens)
  }

  /**
   * Returns the command name.
   *
   * @returns {String}
   */
  commandName (): string {
    return this.parsed._[0]
  }

  arguments (): string[] {
    return this.parsed._.slice(1)
  }

  options (): {[key: string]: unknown} {
    const { _, ...rest } = this.parsed

    return { ...rest }
  }
}
