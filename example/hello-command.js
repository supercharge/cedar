'use strict'

const Crypto = require('crypto')
const { Command } = require('../dist')

class HelloCommand extends Command {
  /**
   * Configure this command by defining input arguments and options.
   */
  configure () {
    this
      .name('hello')
      .description('Say hello')

      /**
       * either use an argument builder
       * the argument builer is available as an argument to a callback provided as a second parameter
       */
      .addArgument('name', builder => {
        builder.description('The name to greet.').optional()
      })

      /**
       * or the fluent interface
       * the fluent interface is available when not providing the builder callback
       */
      .addArgument('title').description('Your scientific title').optional()

    this
      .addOption('random').shortcuts('r').description('random')
  }

  /**
   * Process the console command.
   */
  async run () {
    const title = this.argument('title') ?? ''

    const name = this.option('random')
      ? this.randomName()
      : this.argument('name')

    const message = title
      ? `${title} ${name}`
      : `${name}`

    this.io()
      .emptyLine()
      .success(' Hello ', message)
  }

  /**
   * Returns a randomly generated name.
   *
   * @returns {String}
   */
  randomName () {
    return Crypto.randomBytes(32).toString('hex').slice(0, 4)
  }
}

module.exports = HelloCommand
