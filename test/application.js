'use strict'

const { test } = require('tap')
const { Application } = require('../dist')

test('Application', async t => {
  await t.rejects(() => {
    return new Application().run(['test-command', '--name=Marcus', '-a 30', '-v'])
  })
})
