'use strict'

const Sinon = require('sinon')
const { test } = require('tap')
const { Application, Command } = require('../dist')
const { MemoryLogger } = require('@supercharge/console-io')

test('Console Application', async () => {
  test('name', async t => {
    const app = new Application()
    t.equal(app.name(), '')

    t.equal(new Application('supercharge-cli').name(), 'supercharge-cli')

    app.setName('Supercharge CLI')
    t.equal(app.name(), 'Supercharge CLI')
  })

  test('version', async t => {
    const app = new Application()

    app.setVersion('1.1.2')
    t.equal(app.version(), '1.1.2')

    app.setVersion()
    t.equal(app.version(), '')

    app.setVersion(null)
    t.equal(app.version(), '')

    app.setVersion(4)
    t.equal(app.version(), 4)
  })

  test('output name and version', async t => {
    const app = new Application()

    const logger = new MemoryLogger()
    app.output().withLogger(logger)

    app.setName('Supercharge').setVersion('1.2.3').outputNameAndVersion()

    t.equal(logger.logs().length, 1)
    t.ok(logger.logs()[0].message.includes('Supercharge'))
    t.ok(logger.logs()[0].message.includes('1.2.3'))
    t.equal(logger.logs()[0].stream, 'stdout')
  })

  test('output name without version', async t => {
    const app = new Application()

    const logger = new MemoryLogger()
    app.output().withLogger(logger)

    app.setName('Supercharge').outputNameAndVersion()

    t.equal(logger.logs().length, 1)
    t.equal(logger.logs()[0].stream, 'stdout')
    t.equal(logger.logs()[0].message, 'Supercharge')
  })

  test('output version without name', async t => {
    const app = new Application()

    const logger = new MemoryLogger()
    app.output().withLogger(logger)

    app.setVersion('1.2.3').outputNameAndVersion()

    t.equal(logger.logs().length, 1)
    t.equal(logger.logs()[0].stream, 'stdout')
    t.ok(logger.logs()[0].message.includes('1.2.3'))
  })

  test('register command', async t => {
    const app = new Application()
    app.register('test')
    t.ok(app.has('test'))

    app.register('supercharge', command => {
      t.ok(command)
      t.ok(command instanceof Command)
      t.equal(command.getName(), 'supercharge')
    })

    t.ok(app.has('supercharge'))
  })

  test('add command', async t => {
    const app = new Application()
    app.add(new NoopCommand())

    t.ok(app.has('noop'))
    t.ok(app.isMissing('foo'))
  })

  test('add commands', async t => {
    const app = new Application()

    app.addCommands([
      new AppCommand(),
      new NoopCommand(),
      new NotEnabledCommand()
    ])

    t.ok(app.has('app'))
    t.ok(app.has('noop'))
    t.ok(app.isMissing('not:enabled'))
  })

  test('all commands', async t => {
    const app = new Application()
    t.equal(app.commands().size(), 1)
    t.equal(app.has('help'), true)

    app.add(new NoopCommand())
    t.equal(app.commands().size(), 2)
  })

  test('namespaces', async t => {
    const appWithoutNamespaces = new Application()
      .register('make')
      .register('list')
      .register('supercharge')

    t.same(appWithoutNamespaces.namspaces(), [])

    const app = new Application()
      .register('test')
      .register('make:test')
      .register('make:migration')
      .register('db:seed')
      .register('db:test')

    t.same(app.namspaces(), ['make', 'db'])
  })

  test('useDefaultCommand via string', async t => {
    let called = false

    class TestingDefaultCommand extends Command {
      configure () {
        this.name('default:command')
      }

      run () {
        called = true
      }
    }

    const app = new Application().add(new TestingDefaultCommand())
    const terminateStub = Sinon.stub(app, 'terminate').resolves()

    app.useDefaultCommand('default:command')

    await app.run()

    t.equal(called, true)
    t.ok(terminateStub.called)

    terminateStub.restore()
  })

  test('useDefaultCommand via string', async t => {
    let called = false

    class TestingDefaultCommand extends Command {
      configure () {
        this.name('default:command')
      }

      run () {
        called = true
      }
    }

    const app = new Application().add(new TestingDefaultCommand())
    const terminateStub = Sinon.stub(app, 'terminate').resolves()

    app.useDefaultCommand('default:command')

    await app.run()

    t.equal(called, true)
    t.ok(terminateStub.called)

    terminateStub.restore()
  })

  test('useDefaultCommand via instance', async t => {
    let called = false

    class TestingDefaultCommand extends Command {
      run () {
        called = true
      }
    }

    const app = new Application()
    const terminateStub = Sinon.stub(app, 'terminate').resolves()

    app.useDefaultCommand(new TestingDefaultCommand())

    await app.run()

    t.equal(called, true)
    t.ok(terminateStub.called)

    terminateStub.restore()
  })

  test('throws when default command is not an instance of Command', async t => {
    class TestingDefaultCommand {
      run () { }
    }

    t.throws(() => {
      new Application().useDefaultCommand(new TestingDefaultCommand())
    })
  })

  test('throws when assigning default command name without registering it first', async t => {
    t.throws(() => {
      new Application().useDefaultCommand('default:command')
    }, 'Cannot set default command')
  })

  test('terminate', async t => {
    let called = false

    class TestingDefaultCommand extends Command {
      run () { called = true }
    }

    const app = new Application().useDefaultCommand(
      new TestingDefaultCommand()
    )

    const processExitStub = Sinon.stub(process, 'exit').returns()

    await app.run()

    t.ok(called)
    t.ok(processExitStub.calledOnce)
    t.ok(processExitStub.calledWith(0))

    processExitStub.restore()
  })

  test('terminate with error', async t => {
    class TestingDefaultCommand extends Command {
      run () { throw new Error() }
    }

    const app = new Application().useDefaultCommand(
      new TestingDefaultCommand()
    )

    const output = {
      blankLine () { return this },
      error () { return this }
    }

    const outputStub = Sinon.stub(app, 'output').returns(output)
    const processExitStub = Sinon.stub(process, 'exit').returns()

    await app.run()

    t.ok(outputStub.called)
    t.ok(processExitStub.calledOnce)
    t.ok(processExitStub.calledWith(1))

    outputStub.restore()
    processExitStub.restore()
  })

  test('terminate when missing command', async t => {
    const app = new Application()

    let error
    const output = {
      blankLine () { return this },
      error (err) {
        error = err
        return this
      }
    }

    const outputStub = Sinon.stub(app, 'output').returns(output)
    const processExitStub = Sinon.stub(process, 'exit').returns()

    await app.run(['missing:command'])

    t.ok(outputStub.called)
    t.ok(processExitStub.calledOnce)
    t.ok(processExitStub.calledWith(1))
    t.ok(String(error).includes('Command "missing:command" is not registered'))

    outputStub.restore()
    processExitStub.restore()
  })

  test('print version', async t => {
    const logger = new MemoryLogger()

    const app = new Application().setVersion('cli-version-v1')
    app.output().withLogger(logger)

    await app.run(['-v'])

    t.ok(
      logger.logs().find(log => log.message.includes('cli-version-v1'))
    )

    logger.clearLogs()
    await app.run(['--version'])

    t.ok(
      logger.logs().find(log => log.message.includes('cli-version-v1'))
    )
  })

  test('simulate help for application', async t => {
    const logger = new MemoryLogger()

    const app = new Application().setVersion('cli-version-v1')
    app.output().withLogger(logger)

    const terminateStub = Sinon.stub(app, 'terminate').returns()
    await app.run(['-h'])

    // TODO

    // t.ok(
    //   logger.logs().find(log => log.message.includes('-v, --version'))
    // )
    // t.ok(
    //   logger.logs().find(log => log.message.includes('-h, --help'))
    // )

    terminateStub.restore()
  })
})

class NoopCommand extends Command {
  configure () {
    this.name('noop')
  }

  // do nothing :)
  run () { }
}

class NotEnabledCommand extends Command {
  configure () {
    this.name('not:enabled')
  }

  isEnabled () { return false }
}

class AppCommand extends Command {
  configure () {
    this.name('app')
  }
}
