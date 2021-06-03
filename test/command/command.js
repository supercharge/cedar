'use strict'

const Sinon = require('sinon')
const { test } = require('tap')
const { MemoryLogger } = require('@supercharge/console-io')
const { Application, Command, InputArgumentBuilder, InputOptionBuilder, ArgvInput } = require('../../dist')

test('Command', async () => {
  test('constructor', async t => {
    const command = new Command('test:command')
    t.equal(command.getName(), 'test:command')
  })

  test('name', async t => {
    const command = new Command().name('test:command')
    t.equal(command.getName(), 'test:command')
  })

  test('description', async t => {
    const command = new Command()
    t.equal(command.hasDescription(), false)

    command.description('test command')
    t.equal(command.hasDescription(), true)
    t.equal(command.getDescription(), 'test command')
  })

  test('throws when a command does not have a name', async t => {
    const app = new Application()
    const command = new Command('')

    t.throws(() => {
      app.add(command)
    })
  })

  test('setApplication', async t => {
    const app = new Application()
    const command = new Command('')
    t.throws(() => command.application())

    command.setApplication(app)
    t.equal(command.application(), app)
  })

  test('addArgument returns the argument builder instance', async t => {
    const command = new Command('')
    const argument = command.addArgument('name')

    t.equal(argument instanceof InputArgumentBuilder, true)
    t.equal(command.definition().hasArgument('name'), true)
  })

  test('addArgument returns command when using the argument builder', async t => {
    const command = new Command('')
    const result = command.addArgument('name', () => { })

    t.equal(result instanceof Command, true)
    t.equal(command.definition().hasArgument('name'), true)
  })

  test('throws when not providing an argument name', async t => {
    const command = new Command('')
    t.throws(() => command.addArgument())
  })

  test('argument', async t => {
    const command = new Command('')
    command.addArgument('name').defaultValue('Supercharge')
    t.equal(command.argument('name'), 'Supercharge')
  })

  test('argument', async t => {
    class TestCommand extends Command {
      configure () {
        this
          .name('test:command')
          .addArgument('name', builder => builder.defaultValue('Supercharge'))
      }

      run () { }
    }

    const command = new TestCommand()
    await command.handle(new ArgvInput(['test:command', 'Marcus']))
    t.equal(command.argument('name'), 'Marcus')
  })

  test('throws when accessing an undefined argument', async t => {
    const command = new Command()
    t.throws(() => command.argument('name'), 'The argument "name" does not exist in command "Command"')
  })

  test('addOption returns the option builder instance', async t => {
    const command = new Command('')
    const option = command.addOption('dry-run')

    t.equal(option instanceof InputOptionBuilder, true)
    t.equal(command.definition().hasOption('dry-run'), true)
  })

  test('addOption returns command when using the argument builder', async t => {
    const command = new Command('')
    const result = command.addOption('dry-run', builder => { })

    t.equal(result instanceof Command, true)
    t.equal(command.definition().hasOption('dry-run'), true)
  })

  test('throws when not providing an option name', async t => {
    const command = new Command('')
    t.throws(() => command.addOption(), 'Missing option name in command "Command"')
  })

  test('option', async t => {
    const command = new Command('')
    command.addOption('dry-run').defaultValue('whynot')
    t.equal(command.option('dry-run'), 'whynot')
  })

  test('option', async t => {
    class TestCommand extends Command {
      configure () {
        this
          .name('test:command')
          .addOption('dry-run', builder => builder.defaultValue('whynot'))
      }

      run () { }
    }

    const command = new TestCommand()
    await command.handle(new ArgvInput(['test:command', '--dry-run=abc']))
    t.equal(command.option('dry-run'), 'abc')
  })

  test('throws when accessing an undefined argument', async t => {
    const command = new Command()
    t.throws(() => command.option('dry-run'), 'The option "dry-run" does not exist in command "Command"')
  })

  test('is disabled', async t => {
    const command = new HiddenCommand('')
    t.equal(command.isEnabled(), false)
  })

  test('throws when run is not implemented', async t => {
    const command = new Command()
    t.throws(() => command.run(), 'You must implement the "run" method in your "Command" command')
  })

  test('run', async t => {
    const processExitStub = Sinon.stub(process, 'exit').returns()

    let ran = false

    class TestCommand extends Command {
      configure () {
        this.name('test:command')
      }

      run () { ran = true }
    }

    await new Application().add(
      new TestCommand()
    ).run(['test:command'])

    t.equal(ran, true)

    processExitStub.restore()
  })

  test('throws when the command does not define the given argument', async t => {
    const processExitStub = Sinon.stub(process, 'exit')
    let ran = false

    class TestCommand extends Command {
      configure () {
        this.name('test:command')
      }

      run () { ran = true }
    }

    const app = new Application().add(new TestCommand())

    const logger = new MemoryLogger()
    app.output().withLogger(logger)
    await app.run(['test:command', 'argument1'])

    t.ok(
      logger.logs().find(log => log.message.includes('No arguments expected'))
    )
    t.equal(ran, false)
    t.equal(processExitStub.calledOnce, true)
    t.equal(processExitStub.calledWith(1), true)

    processExitStub.restore()
  })

  test('ignores validation errors', async t => {
    const processExitStub = Sinon.stub(process, 'exit')

    let ran = false

    class TestCommand extends Command {
      configure () {
        this
          .name('test:command')
          .ignoreValidationErrors()
      }

      run () { ran = true }
    }

    await new Application()
      .add(new TestCommand())
      .run(['test:command', 'argument1'])

    t.equal(ran, true)
    t.equal(processExitStub.calledOnce, true)
    t.equal(processExitStub.calledWith(0), true)

    processExitStub.restore()
  })

  test('throws when missing input', async t => {
    const command = new Command()
    t.throws(() => {
      command.meta.input = null
      command.input()
    })
  })
})

class HiddenCommand extends Command {
  isEnabled () {
    return false
  }
}
