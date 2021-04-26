'use strict'

const { Command } = require('../dist')

class HelloCommand extends Command {
  getName () {
    return 'hello'
  }

  configure () {
    this.description('Say hello')

    this.addArgument('name').description('The name to greet.').defaultValue('Marcus').required()

    this.addOption('dry-run').shortcuts('d').description('dry run mode')
  }

  async handle () {
    throw new Error('PUPER')
    // console.log('handle HELLO ->')
  }
}

module.exports = HelloCommand
