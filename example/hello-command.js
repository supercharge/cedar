'use strict'

const { Command } = require('../dist')

class HelloCommand extends Command {
  name () {
    return 'hello'
  }

  configure () {
    this.addArgument('name').description('The name to greet.').defaultValue('Marcus').required()
  }

  async handle () {
    console.log('handle HELLO ->')
  }
}

module.exports = HelloCommand
