'use strict'

const { Command } = require('../dist')

class HelloCommand extends Command {
  name () {
    return 'hello'
  }

  configure () {
    this.addArgument('name').description('The name to greet.').defaultValue('Marcus').required()
    this.addOption('dry-run').shortcuts('d').description('dry run mode')
  }

  async handle () {
    console.log('handle HELLO ->')
  }
}

module.exports = HelloCommand
