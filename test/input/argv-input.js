'use strict'

const { test } = require('tap')
const { ArgvInput, InputDefinition, InputArgument, InputOption } = require('../../dist')

test('Argv Input', async () => {
  test('uses process.argv', async t => {
    process.argv = [
      '/usr/local/bin/node',
      '/Users/marcus/Dev/supercharge-console/test/application.js',
      'test:command',
      'supercharge'
    ]

    const input = new ArgvInput()

    try {
      input.parse()
    } catch (error) { } // ignore error

    t.equal(input.firstArgument(), 'test:command')
    t.same(input.parsed._, ['test:command', 'supercharge'])
  })

  test('parse command name', async t => {
    const input = new ArgvInput(['test:command'])

    input.bind(new InputDefinition())
    t.equal(input.firstArgument(), 'test:command')
  })

  test('parse arguments', async t => {
    const input = new ArgvInput(['test:command', 'supercharge'])

    input.bind(new InputDefinition([new InputArgument('name')]))

    t.equal(input.arguments().has('name'), true)
    t.equal(input.arguments().missing('test'), true)

    input.bind(new InputDefinition([new InputArgument('testing')]))

    t.equal(input.arguments().has('testing'), true)
    t.equal(input.arguments().missing('test'), true)
  })

  test('throws when not expecting arguments but input has some', async t => {
    const input = new ArgvInput(['test:command', 'argument1'])

    t.throws(() => {
      input.bind(new InputDefinition())
    }, 'No arguments expected')
  })

  test('throws when expecting less arguments then provided', async t => {
    const input = new ArgvInput(['test:command', 'argument1', 'argument2'])

    t.throws(() => {
      input.bind(new InputDefinition([new InputArgument('argument1')]))
    }, 'Too many arguments:')
  })

  test('parse options', async t => {
    const input = new ArgvInput(['test:command', '-h'])

    input.bind(new InputDefinition([new InputOption('h')]))

    t.equal(input.options().has('h'), true)
    t.equal(input.options().get('h'), true)
  })

  test('get parsed option', async t => {
    const input = new ArgvInput(['test:command', '-h'])

    input.bind(new InputDefinition([new InputOption('h')]))

    t.equal(input.option('h'), true)
    t.equal(input.option('f'), undefined)
  })

  test('throws when not expecting options but input has some', async t => {
    const input = new ArgvInput(['test:command', '-h'])

    t.throws(() => {
      input.bind(new InputDefinition())
    })
  })
})
