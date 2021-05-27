'use strict'

const { test } = require('tap')
const { InputOptionBuilder, InputOption } = require('../dist')

test('Input Option Builder', async () => {
  test('description', async t => {
    const option = new InputOption()
    const builder = new InputOptionBuilder(option)
    builder.description('builder description')

    t.equal(option.name(), '')
    t.equal(option.isOptional(), true)
    t.equal(option.description(), 'builder description')
  })

  test('defaultValue', async t => {
    const option = new InputOption()
    const builder = new InputOptionBuilder(option)
    builder.defaultValue('super')

    t.equal(option.name(), '')
    t.equal(option.description(), '')
    t.equal(option.isOptional(), true)
    t.equal(option.defaultValue(), 'super')
  })

  test('optional', async t => {
    const option = new InputOption()
    const builder = new InputOptionBuilder(option)
    builder.optional().description('builder description')

    t.equal(option.name(), '')
    t.equal(option.isOptional(), true)
    t.equal(option.description(), 'builder description')
  })

  test('required', async t => {
    const option = new InputOption('required')
    const builder = new InputOptionBuilder(option)
    builder.required().description('super description').defaultValue('super')

    t.equal(option.name(), 'required')
    t.equal(option.isRequired(), true)
    t.equal(option.defaultValue(), 'super')
    t.equal(option.description(), 'super description')
  })

  test('shortcuts', async t => {
    const option = new InputOption('required')
    const builder = new InputOptionBuilder(option)
    builder.shortcuts('r').required().description('super description').defaultValue('super')

    t.equal(option.name(), 'required')
    t.same(option.shortcuts(), ['r'])
    t.equal(option.isRequired(), true)
    t.equal(option.defaultValue(), 'super')
    t.equal(option.description(), 'super description')

    builder.shortcuts(['h', 'v', 'test'])
    t.same(option.shortcuts(), ['r', 'h', 'v', 'test'])
  })
})
