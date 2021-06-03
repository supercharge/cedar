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

    const initStub = Sinon.stub(app, 'init').returns()
    const commandIoStub = Sinon.stub(command, 'io').returns(io)
    await command.handle()

    t.equal(commandIoStub.called, true)
    t.ok(
      logger.logs().find(log => {
        return log.message.includes('No commands available.')
      })
    )

    initStub.restore()
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

  test('groupCommands', async t => {
    const app = new Application()
      .register('db:seed')
      .register('migrations:run')
      .register('test')

    const groupedCommands = new HelpCommand()
      .setApplication(app)
      .groupCommands()

    t.same(Object.keys(groupedCommands), [
      'root', // goes first because the 'help' command is registered as a default command when initializing the app
      'db',
      'migrations'
    ])
  })

  test('sortGroups', async t => {
    const app = new Application()
      .register('list')
      .register('db:seed')
      .register('test:double')
      .register('migrations:status')
      .register('migrations:run')
      .register('migrations:migrate')
      .register('db:fake')

    const command = new HelpCommand().setApplication(app)

    const sortedGroupNames = command.sortGroups(
      Object.keys(command.groupCommands())
    )

    t.same(sortedGroupNames, [
      'root',
      'db',
      // 'help', // registered as a default command
      'migrations',
      'test'
    ])
  })

  test('sortCommands (first by namespace, then by command name)', async t => {
    const logger = new MemoryLogger()
    const io = new IO().withLogger(logger)

    const app = new Application()
      .register('db:seed')
      .register('db')
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
    const groups = command.sortCommands(
      command.groupCommands()
    )

    t.equal(groups.length, 3)
    t.equal(groups[0].name, 'root')
    t.equal(groups[1].name, 'db')
    t.equal(groups[2].name, 'migrations')

    t.same(
      groups[0].commands.map(command => command.getName()),
      ['db', 'help', 'list', 'test'] // 'help' is registered when initializing the app
    )
    t.same(
      groups[1].commands.map(command => command.getName()),
      ['db:fake', 'db:seed']
    )
    t.same(
      groups[2].commands.map(command => command.getName()),
      ['migrations:latest', 'migrations:migrate', 'migrations:rollback', 'migrations:run', 'migrations:status']
    )

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
