'use strict'

const { test } = require('tap')
const { InputOption } = require('../../dist')

test('Input Option', async () => {
  test('name', async t => {
    t.equal(new InputOption().name(), '')
    t.equal(new InputOption('supercharge').name(), 'supercharge')
  })

  test('description', async t => {
    t.equal(new InputOption().description(), '')
    t.equal(new InputOption().setDescription('super charged!').description(), 'super charged!')
  })

  test('required', async t => {
    t.equal(new InputOption().isRequired(), false)
    t.equal(new InputOption().markAsRequired().isRequired(), true)

    const argument = new InputOption()
    argument.meta.required = undefined
    t.equal(argument.isRequired(), false)
  })

  test('optional', async t => {
    t.equal(new InputOption().isOptional(), true)
    t.equal(new InputOption().isRequired(), false)
    t.equal(new InputOption().markAsOptional().isOptional(), true)
  })

  test('default value', async t => {
    t.equal(new InputOption().defaultValue(), undefined)
    t.equal(new InputOption().setDefaultValue('Marcus').defaultValue(), 'Marcus')
  })

  test('shortcut', async t => {
    t.same(new InputOption().shortcuts(), [])
    t.same(new InputOption().addShortcuts().shortcuts(), [])
    t.same(new InputOption().addShortcuts('r').shortcuts(), ['r'])
    t.same(new InputOption().addShortcuts(['r', 'h']).shortcuts(), ['r', 'h'])
  })
})
