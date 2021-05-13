'use strict'

const { Command } = require('../dist')

class HelloCommand extends Command {
  /**
   * Configure this command by defining input arguments and options.
   */
  configure () {
    this
      .name('hello')
      .description('Send a friendly hello to a given name :)')

      /**
       * either use an argument builder
       * the argument builer is available as an argument to a callback provided as a second parameter
       */
      .addArgument('name', builder => {
        builder.description('The name to greet.').required()
      })

      /**
       * or the fluent interface
       * the fluent interface is available when not providing the builder callback
       */
      .addArgument('title').description('Your scientific title').optional()

    this
      .addOption('random-title').shortcuts('r').description('generate a random title if none is present')
  }

  /**
   * Process the console command.
   */
  async run () {
    const title = this.option('random-title')
      ? this.randomTitle()
      : this.argument('title') ?? ''

    const name = this.argument('name')

    const message = title
      ? `${title} ${name}`
      : `${name}`

    this.io()
      .emptyLine()
      .success(' Hello ', message)
      .emptyLine()
  }

  /**
   * Returns a randomly generated name.
   *
   * @returns {String}
   */
  randomTitle () {
    const titles = ['Mr.', 'Mrs.', 'Bro', 'Dude']

    return titles[
      Math.floor(Math.random() * titles.length)
    ]
  }
}

module.exports = HelloCommand
