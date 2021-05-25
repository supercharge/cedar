'use strict'

const { test } = require('tap')
const { InputArgument } = require('../dist')

test('Input Argument', async () => {
  test('name', async t => {
    t.equal(new InputArgument().name(), '')
    t.equal(new InputArgument('supercharge').name(), 'supercharge')
  })

  test('description', async t => {
    t.equal(new InputArgument().description(), '')
    t.equal(new InputArgument().setDescription('super charged!').description(), 'super charged!')
  })

  test('required', async t => {
    t.equal(new InputArgument().isRequired(), false)
    t.equal(new InputArgument().markAsRequired().isRequired(), true)

    const argument = new InputArgument()
    argument.meta.required = undefined
    t.equal(argument.isRequired(), false)
  })

  test('optional', async t => {
    t.equal(new InputArgument().isOptional(), true)
    t.equal(new InputArgument().isRequired(), false)
    t.equal(new InputArgument().markAsOptional().isOptional(), true)
  })

  test('default value', async t => {
    t.equal(new InputArgument().defaultValue(), undefined)
    t.equal(new InputArgument().setDefaultValue('Marcus').defaultValue(), 'Marcus')
  })
})
