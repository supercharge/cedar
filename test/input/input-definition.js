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

  test('argument', async t => {
    const definition = new InputDefinition([
      new InputArgument('first'),
      new InputArgument('second')
    ])

    t.same(definition.argument('first'), new InputArgument('first'))
    t.same(definition.argument(1), new InputArgument('second'))
  })

  test('throws when retrieving an unavailable argument', async t => {
    const definition = new InputDefinition().addArgument(
      new InputArgument('argument')
    )

    t.equal(definition.hasArgument('argument'), true)
    t.equal(definition.hasArgument('unavailable'), false)
    t.throws(() => {
      return definition.argument('unavailable')
    })
  })

  test('hasArgument', async t => {
    const definition = new InputDefinition([
      new InputArgument('required'),
      new InputArgument('optional')
    ])

    t.equal(definition.hasArgument('required'), true)
    t.equal(definition.hasArgument('optional'), true)
    t.equal(definition.hasArgument('unavailable'), false)
  })

  test('isMissingArgument', async t => {
    const definition = new InputDefinition([
      new InputArgument('required'),
      new InputArgument('optional')
    ])

    t.equal(definition.isMissingArgument('required'), false)
    t.equal(definition.isMissingArgument('optional'), false)
    t.equal(definition.isMissingArgument('unavailable'), true)
  })

  test('argumentNames', async t => {
    const definition = new InputDefinition([
      new InputArgument('first'),
      new InputArgument('second'),
      new InputArgument('third')
    ])

    t.same(definition.argumentNames(), ['first', 'second', 'third'])
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

  test('throws when options have the same shortcut', async t => {
    const definition = new InputDefinition()

    t.doesNotThrow(() => {
      definition.addOption(new InputOption('first').addShortcuts('f'))
    })
    t.throws(() => {
      definition.addOption(new InputOption('second').addShortcuts('f'))
    })
  })

  test('option', async t => {
    const definition = new InputDefinition([
      new InputOption('first')
    ])

    t.equal(true, definition.hasOption('first'))
    t.equal(false, definition.hasOption('second'))
  })

  test('option', async t => {
    const definition = new InputDefinition([
      new InputOption('first'),
      new InputOption('second')
    ])

    t.same(definition.option('first'), new InputOption('first'))
  })

  test('throws when retrieving an unavailable option', async t => {
    const definition = new InputDefinition([
      new InputOption('first')
    ])

    t.doesNotThrow(() => {
      return definition.option('first')
    })
    t.throws(() => {
      return definition.option('second')
    })
  })

  test('hasOption', async t => {
    const definition = new InputDefinition([
      new InputOption('first')
    ])

    t.equal(true, definition.hasOption('first'))
    t.equal(false, definition.hasOption('second'))
  })

  test('isMissingOption', async t => {
    const definition = new InputDefinition([
      new InputOption('required'),
      new InputOption('optional')
    ])

    t.equal(definition.isMissingOption('required'), false)
    t.equal(definition.isMissingOption('optional'), false)
    t.equal(definition.isMissingOption('unavailable'), true)
  })

  test('hasOptionShortcut', async t => {
    const definition = new InputDefinition([
      new InputOption('first').addShortcuts('f')
    ])

    t.equal(true, definition.hasOptionShortcut('f'))
    t.equal(false, definition.hasOptionShortcut('h'))
  })

  test('throws when trying to retrieve option for missing shortcut', async t => {
    const definition = new InputDefinition([
      new InputOption('first').addShortcuts('f')
    ])

    t.throws(() => {
      return definition.optionByShortcut('h')
    })
    t.doesNotThrow(() => {
      return definition.optionByShortcut('f')
    })
  })
})
