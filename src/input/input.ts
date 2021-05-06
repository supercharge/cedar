'use strict'

import Map from '@supercharge/map'
import { tap } from '@supercharge/goodies'
import { Opts as Options } from 'minimist'

export abstract class Input {
  /**
   * The parsed input tokens.
   */
  private readonly meta: {
    arguments: string[]
    options: Map<string, unknown>
  }

  /**
   * Create a new instance for the given `args`.
   */
  constructor () {
    this.meta = {
      options: new Map(),
      arguments: []
    }
  }

  /**
   * Parse the command line input (arguments and options).
   */
  abstract parse (options?: Options): this

  /**
   * Returns the provided input arguments.
   *
   * @returns {String[]}
   */
  arguments (): string[] {
    return this.meta.arguments
  }

  /**
   * Returns the provided input options.
   *
   * @returns {Object}
   *
   * @example
   * ```bash
   * # Imagine this command input
   * $ ./cli command:name --dry-run -h
   *
   * # the input from above results in these options
   * {
   *   h: true,
   *   'dry-run': true
   * }
   * ```
   */
  options (): Map<string, unknown> {
    return this.meta.options
  }

  /**
   * Returns the option value for the given `name`.
   *
   * @returns {*}
   *
   * @throws
   */
  option (name: string): unknown {
    return this.options().get(name)
  }

  /**
    * Set an option for the given `name` and assign the `value`.
    *
    * @param {String} name
    * @param {*} value
    */
  setOption (name: string, value: unknown): this {
    return tap(this, () => {
      this.options().set(name, value)
    })
  }

  /**
    * Determine whether an option with the given `name` exists.
    *
    * @param {String} name
    */
  hasOption (name: string): boolean {
    return this.options().has(name)
  }
}
