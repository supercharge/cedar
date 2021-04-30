'use strict'

const { ConsoleOutput } = require('../dist/io/console-output')

async function run () {
  const output = new ConsoleOutput()

  output
    .log('normal message')
    .debug('debug message')
    .info('info message')
    .warn('warning message')
    .error('error message')
    .error(new Error('error message with stack'))

  output
    .emptyLine()
    .log(
      output.colors().yellow().bold('bold yellow message')
    )
}

run()
