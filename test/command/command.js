'use strict'

const { test } = require('tap')
const { Application, Command } = require('../../dist')

test('Command', async () => {
  test('constructor', async t => {
    const command = new Command('test:command')
    t.equal(command.getName(), 'test:command')
  })
})
