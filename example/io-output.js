'use strict'

const { ConsoleOutput } = require('../dist/io/console-output')

async function run () {
  const output = new ConsoleOutput()

  output
    .log('normal message')
    .emptyLine()
    .success('All tests pass')
    .success(' PASS ', 'Test suite successful')
    .emptyLine()
    .hint('Skipping the following tests')
    .hint(' SKIP ', 'auth/jwt.ts')
    .hint(' SKIP ', 'routes/web.ts')
    .emptyLine()
    .fail('Tests failed')
    .fail(' FAIL ', 'tests/auth/jwt.ts')
    .emptyLine()
    .tag(' FINISHED ').success('Database migrations')
    .tag(' IGNORED ').info('config/app.js file for this run')
    .tag(' SKIPPED ').info('Copying .env', 'File already exists.')
    .tag(' FAILED ').failed('to copy .env file', 'File already exists.')
    .emptyLine()
    .debug('debug message')
    .info('info message')
    .warn('warning message')
    .emptyLine()
    .error('single error message (without stack)')
    .emptyLine()
    .error(new Error('error message with stack'))
    .emptyLine()

  output.log(
    output.colors().yellow().bold('bold yellow message')
  )
}

run()
