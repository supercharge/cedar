'use strict'

import Set from '@supercharge/set'
import Str from '@supercharge/strings'
import { tap } from '@supercharge/goodies'
import { InputOption } from './input-option'
import { InputArgument } from './input-argument'

export class InputDefinition {
  /**
   * The input definition meta data.
   */
  private readonly meta: {
    /**
     * Contains the defined input options
     */
    options: Set<InputOption>
    arguments: Set<InputArgument>
  }

  /**
   * Create a new option instance for the given `name`.
   *
   * @param {String} name
   */
  constructor () {
    this.meta = {
      options: new Set(),
      arguments: new Set()
    }
  }

  /**
   * Returns the defined input options.
   *
   * @returns {Map}
   */
  options (): Set<InputOption> {
    return this.meta.options
  }

  /**
   * Returns the input option instance for the given `name`. Returns
   * `undefined` if no input option is defined for the name.
   *
   * @returns {InputOption}
   */
  option (name: string): InputOption | undefined {
    return this.options().find(option => {
      return option.name() === name
    })
  }

  /**
   * Creates a new argument for the given `name` for this command. Returns a
   * builder instance to configure the added argument with fluent methods.
   *
   * @param {String} name
   *
   * @returns {InputArgumentBuilder}
   *
   * @throws
   */
  addOption (option: InputOption): this {
    if (this.hasOption(option.name())) {
      throw new Error(`Option "${option.name()}" is already registered.`)
    }

    option.shortcuts().forEach(shortcut => {
      this.options().forEach(option => {
        if (Str(shortcut).includes(option.shortcuts())) {
          throw new Error(`Shortcut "${shortcut}" is already registered for option "${option.name()}".`)
        }
      })
    })

    return tap(this, () => {
      this.options().add(option)
    })
  }

  /**
   * Determine whether an option with the given `name` exists.
   *
   * @param {String} name
   *
   * @returns {Boolean}
   */
  hasOption (name: string): boolean {
    return this.options().includes(option => {
      return option.name() === name
    })
  }

  /**
   * Determine whether an option with the given `name` does not exist.
   *
   * @param {String} name
   *
   * @returns {Boolean}
   */
  isMissingOption (name: string): boolean {
    return !this.hasOption(name)
  }

  /**
   * Returns the defined input arguments.
   *
   * @returns {Map}
   */
  arguments (): Set<InputArgument> {
    return this.meta.arguments
  }

  /**
   * Returns the input argument instance for the given `name`. Returns
   * `undefined` if no input argument is defined for the name.
   *
   * @param {String|Number} name
   *
   * @returns {InputArgument|undefined}
   */
  argument (name: string | number): InputArgument | undefined {
    if (Number.isInteger(name)) {
      return this.arguments().at(name as number)
    }

    return this.arguments().find(argument => {
      return argument.name() === name
    })
  }

  /**
   * Creates a new argument for the given `name` for this command. Returns a
   * builder instance to configure the added argument with fluent methods.
   *
   * @param {String} name
   *
   * @returns {InputDefinition}
   *
   * @throws
   */
  addArgument (argument: InputArgument): this {
    if (this.hasArgument(argument.name())) {
      throw new Error(`Argument "${argument.name()}" is already registered.`)
    }

    return tap(this, () => {
      this.arguments().add(argument)
    })
  }

  /**
   * Determine whether an argument for the given `name` exists. The `name`
   * can be the name’s argument or the argument’s position as a number.
   * When using a number it represents the registration position.
   *
   * @param {String|Number} name
   *
   * @returns {Boolean}
   */
  hasArgument (name: string | number): boolean {
    return !!this.argument(name)
  }

  /**
   * Determine whether an argument for the given `name` does not exist.
   *
   * @param {String|Number} name
   *
   * @returns {Boolean}
   */
  isMissingArgument (name: string | number): boolean {
    return !this.hasArgument(name)
  }

  /**
   * Returns the defined input arguments.
   *
   * @returns {String[]}
   */
  argumentNames (): string[] {
    return this.arguments().map(argument => {
      return argument.name()
    }).toArray()
  }
}
