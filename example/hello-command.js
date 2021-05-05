'use strict'

const { Command } = require('../dist')

class HelloCommand extends Command {
  getName () {
    return 'hello'
  }

  configure () {
    this.description('Say hello')

    this
      // either use an argument builder
      //   the argument builer is available as an argument to a callback provided as a second parameter
      .addArgument('name', builder => {
        builder.description('The name to greet.').defaultValue('Marcus').required()
      })
      // or the fluent interface
      //   the fluent interface is available when not providing the builder callback
      .addArgument('title').description('Your scientific title').optional()

    this.addOption('random').shortcuts('r').description('random')
  }

  async run () {
    const name = this.options().get('random')
      ? 'Marcus'
      : this.arguments().get('name')

    console.log(`Hello ${name}`)
  }
}

module.exports = HelloCommand
