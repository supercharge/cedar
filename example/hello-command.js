'use strict'

const { Command } = require('../dist')

class HelloCommand extends Command {
  getName () {
    return 'hello'
  }

  configure () {
    this.description('Say hello')

    this.addArgument('name').description('The name to greet.').defaultValue('Marcus').required()

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
