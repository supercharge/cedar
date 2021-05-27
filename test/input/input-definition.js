'use strict'

const { test } = require('tap')
const { InputDefinition, InputArgument, InputOption } = require('../../dist')

test('Input Definition', async () => {
  test('constructor', async t => {
    t.same(new InputDefinition().options().toArray(), [])
    t.same(new InputDefinition().arguments().toArray(), [])

    const definition = new InputDefinition([
      new InputArgument('argument1'),
      new InputArgument('argument2'),
      new InputOption('option1'),
      new InputOption('option2')
    ])

    t.equal(definition.options().size(), 2)
    t.equal(definition.hasOption('option2'), true)
    t.equal(definition.hasOption('option2'), true)

    t.equal(definition.arguments().size(), 2)
    t.equal(definition.hasArgument('argument1'), true)
    t.equal(definition.hasArgument('argument2'), true)
  })

  test('addArgument', async t => {
    const definition = new InputDefinition().addArgument(
      new InputArgument('argument')
    )

    t.equal(definition.arguments().size(), 1)
    t.equal(definition.hasArgument('argument'), true)
    t.same(definition.arguments().toArray(), [new InputArgument('argument')])
  })

  test('throws when arguments have the same name', async t => {
    const definition = new InputDefinition()

    t.doesNotThrow(() => {
      definition.addArgument(new InputArgument('argument'))
    })
    t.throws(() => {
      definition.addArgument(new InputArgument('argument'))
    })
  })

  test('throws when a required argument follows an optional one', async t => {
    const definition = new InputDefinition()

    definition.addArgument(new InputArgument('optional').markAsOptional())

    t.throws(() => {
      definition.addArgument(new InputArgument('required').markAsRequired())
    })
  })

  test('addOption', async t => {
    const definition = new InputDefinition().addOption(
      new InputOption('option')
    )

    t.equal(definition.options().size(), 1)
    t.equal(definition.hasOption('option'), true)
    t.same(definition.options().toArray(), [new InputOption('option')])
  })

  test('throws when options have the same name', async t => {
    const definition = new InputDefinition()

    t.doesNotThrow(() => {
      definition.addOption(new InputOption('option'))
    })
    t.throws(() => {
      definition.addOption(new InputOption('option'))
    })
  })
})
