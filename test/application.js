'use strict'

const tap = require('tap')
const { Application } = require('../dist')

tap.test('Application', async t => {
  await t.rejects(() => {
    return new Application().run(['test-command', '--name=Marcus', '-a 30', '-v'])
  })
})
