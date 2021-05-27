'use strict'

const { test } = require('tap')
const { InputArgumentBuilder, InputArgument } = require('../dist')

test('Input Argument Builder', async () => {
  test('description', async t => {
    const argument = new InputArgument()
    const builder = new InputArgumentBuilder(argument)
    builder.description('builder description')

    t.equal(argument.name(), '')
    t.equal(argument.isOptional(), true)
    t.equal(argument.description(), 'builder description')
  })

  test('defaultValue', async t => {
    const argument = new InputArgument()
    const builder = new InputArgumentBuilder(argument)
    builder.defaultValue('super')

    t.equal(argument.name(), '')
    t.equal(argument.description(), '')
    t.equal(argument.isOptional(), true)
    t.equal(argument.defaultValue(), 'super')
  })

  test('optional', async t => {
    const argument = new InputArgument()
    const builder = new InputArgumentBuilder(argument)
    builder.optional().description('builder description')

    t.equal(argument.name(), '')
    t.equal(argument.isOptional(), true)
    t.equal(argument.description(), 'builder description')
  })

  test('required', async t => {
    const argument = new InputArgument('required')
    const builder = new InputArgumentBuilder(argument)
    builder.required().description('super description').defaultValue('super')

    t.equal(argument.name(), 'required')
    t.equal(argument.isRequired(), true)
    t.equal(argument.defaultValue(), 'super')
    t.equal(argument.description(), 'super description')
  })
})
