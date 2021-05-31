'use strict'

const Sinon = require('sinon')
const { test } = require('tap')
const { IO } = require('../../dist/io/io')
const { MemoryLogger } = require('@supercharge/console-io')
const { Application, HelpCommand, Command } = require('../../dist')

test('Command', async () => {
  test('help for application without commands', async t => {
    const logger = new MemoryLogger()
    const io = new IO().withLogger(logger)

    const app = new Application()
    const command = new HelpCommand().setApplication(app)

    const commandIoStub = Sinon.stub(command, 'io').returns(io)
    await command.handle()

    t.equal(commandIoStub.called, true)
    t.ok(
      logger.logs().find(log => {
        return log.message.includes('No commands available.')
      })
    )

    commandIoStub.restore()
  })

  test('help for application with commands', async t => {
    const logger = new MemoryLogger()
    const io = new IO().withLogger(logger)

    const app = new Application()
      .add(new MigrationCommand())
      .add(new TestCommand())
      .add(new ListCommand())

    const command = new HelpCommand().setApplication(app)

    const commandIoStub = Sinon.stub(command, 'io').returns(io)
    const applicationOutputStub = Sinon.stub(app, 'output').returns(io)

    await command.handle()

    t.equal(commandIoStub.called, true)

    t.ok(logger.logs().find(log => {
      return log.message.includes('Available commands:')
    }))

    t.ok(logger.logs().find(log => {
      return log.message.includes('list')
    }))

    t.ok(logger.logs().find(log => {
      return log.message.includes('test')
    }))

    t.ok(logger.logs().find(log => {
      return log.message.includes('migrations:migrate')
    }))

    commandIoStub.restore()
    applicationOutputStub.restore()
  })

  test('help for test command without arguments and without options', async t => {
    const logger = new MemoryLogger()
    const io = new IO().withLogger(logger)

    class EmptyCommand extends Command {
      run () {}
    }

    const app = new Application()
    const command = new HelpCommand()
      .setApplication(app)
      .forCommand(new EmptyCommand())

    const commandIoStub = Sinon.stub(command, 'io').returns(io)
    await command.handle()

    t.notOk(logger.logs().find(log => {
      return log.message.includes('Arguments')
    }))

    t.notOk(logger.logs().find(log => {
      return log.message.includes('Options/Flags')
    }))

    commandIoStub.restore()
  })

  test('help for test command', async t => {
    const logger = new MemoryLogger()
    const io = new IO().withLogger(logger)

    const app = new Application()
    const command = new HelpCommand()
      .setApplication(app)
      .forCommand(new TestCommand())

    const commandIoStub = Sinon.stub(command, 'io').returns(io)
    await command.handle()

    t.equal(commandIoStub.called, true)

    t.ok(logger.logs().find(log => {
      return log.message.includes('this is the test command description')
    }))

    t.ok(logger.logs().find(log => {
      return log.message.includes('Usage')
    }))

    t.ok(logger.logs().find(log => {
      // required "name" and optional "title"
      return log.message.includes('<name> [title?]')
    }))

    t.ok(logger.logs().find(log => {
      return log.message.includes('name')
    }))
    t.ok(logger.logs().find(log => {
      return log.message.includes('the test name')
    }))
    t.ok(logger.logs().find(log => {
      return log.message.includes('the test title')
    }))

    t.ok(logger.logs().find(log => {
      return log.message.includes('Options/Flags')
    }))

    t.ok(logger.logs().find(log => {
      return log.message.includes('dry-run')
    }))
    t.ok(logger.logs().find(log => {
      return log.message.includes('the test dry-run option')
    }))

    t.ok(logger.logs().find(log => {
      return log.message.includes('the test abc option')
    }))

    const indexOfDryRun = logger.logs().findIndex(log => {
      return log.message.includes('the test dry-run option')
    })

    const indexOfAbc = logger.logs().findIndex(log => {
      return log.message.includes('the test abc option')
    })

    t.equal(indexOfDryRun < indexOfAbc, true)

    commandIoStub.restore()
  })

  test('sorts commands by name (and namespace)', async t => {
    const logger = new MemoryLogger()
    const io = new IO().withLogger(logger)

    const app = new Application()
      .register('db:seed')
      .register('db')
      .register('mm:mm')
      .register('aa:aa')
      .register('aa:dd')
      .register('aa:bb')
      .register('mm:aa')
      .register('migrations:run')
      .register('migrations:status')
      .register('migrations:rollback')
      .register('migrations:latest')
      .register('test')
      .register('migrations:migrate')
      .register('db:fake')
      .register('list')

    const command = new HelpCommand().setApplication(app)

    const commandIoStub = Sinon.stub(command, 'io').returns(io)
    await command.handle()

    t.pass('TODO')
    // TODO asset correct command order

    commandIoStub.restore()
  })
})

class TestCommand extends Command {
  configure () {
    this
      .name('test')
      .description('this is the test command description')
      .addArgument('name', builder => builder.description('the test name').required())
      .addArgument('title', builder => builder.description('the test title'))
      .addOption('dry-run', builder => builder.description('the test dry-run option').defaultValue(false).shortcuts('d'))
      .addOption('abc').description('the test abc option')
  }

  run () {}
}

class ListCommand extends Command {
  getName () { return 'list' }
  run () {}
}

class MigrationCommand extends Command {
  getName () { return 'migrations:migrate' }
  run () {}
}
