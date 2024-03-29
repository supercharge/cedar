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
   * Create a new instance for the given `definition` (a list of input arguments and options).
   *
   * @param {Array<InputArgument | InputOption>} definition
   */
  constructor (definition?: Array<InputArgument | InputOption>) {
    this.meta = {
      options: new Set(),
      arguments: new Set()
    }

    this.setDefinition(definition)
  }

  /**
   * Assign the arguments and options from the given `definition`.
   *
   * @param definition
   */
  setDefinition (definition?: Array<InputArgument | InputOption>): void {
    for (const input of definition ?? []) {
      input instanceof InputOption
        ? this.addOption(input)
        : this.addArgument(input)
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
   * @param {String} name
   *
   * @returns {InputOption}
   *
   * @throws
   */
  option (name: string): InputOption {
    const option = this.options().find(option => {
      return option.name() === name
    })

    if (option) {
      return option
    }

    throw new Error(`The option "${name}" is not registered.`)
  }

  /**
   * Adds a new input option in this input definition. Throws an error if an
   * option with the name or shortcut already exsits in this definition.
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
    try {
      return !!this.option(name)
    } catch (error) {
      return false
    }
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
   * Returns the input option instance for the given `name`. Returns
   * `undefined` if no input option is defined for the name.
   *
   * @returns {InputOption}
   *
   * @throws
   */
  optionByShortcut (name: string): InputOption {
    const option = this.options().find(option => {
      return option.shortcuts().includes(name)
    })

    if (option) {
      return option
    }

    throw new Error(`The option with shortcut "${name}" is not registered.`)
  }

  /**
   * Determine whether an option with the given `name` does not exist.
   *
   * @param {String} name
   *
   * @returns {Boolean}
   */
  hasOptionShortcut (name: string): boolean {
    try {
      return !!this.optionByShortcut(name)
    } catch (error) {
      return false
    }
  }

  /**
   * Returns the defined input arguments.
   *
   * @returns {Set<InputArgument>}
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
   *
   * @throws
   */
  argument (name: string | number): InputArgument {
    const argument = Number.isInteger(name)
      ? this.arguments().at(name as number)
      : this.arguments().find(argument => argument.name() === name)

    if (argument) {
      return argument
    }

    throw new Error(`The argument "${name}" is not registered.`)
  }

  /**
   * Adds the given `argument` to this input definition. Throws
   * an error if an argument with the same name already exists.
   *
   * @param {InputArgument} argument
   *
   * @returns {InputDefinition}
   *
   * @throws
   */
  addArgument (argument: InputArgument): this {
    if (this.hasArgument(argument.name())) {
      throw new Error(`Argument "${argument.name()}" is already registered.`)
    }

    if (argument.isRequired() && this.lastArgumentIsOptional()) {
      throw new Error(`Cannot add required argument "${argument.name()}" after optional argument "${String(this.arguments().at(-1)?.name())}".`)
    }

    return tap(this, () => {
      this.arguments().add(argument)
    })
  }

  /**
   * Determine whether the last argument added to this definition is optional.
   *
   * @returns {Boolean}
   */
  private lastArgumentIsOptional (): boolean {
    return this.arguments().isNotEmpty() && this.arguments().at(-1)?.isOptional() as boolean
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
    try {
      return !!this.argument(name)
    } catch (error) {
      return false
    }
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
