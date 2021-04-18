'use strict'

const test = require('ava')
const { Application } = require('../dist')

test('Application', async t => {
  await t.throwsAsync(() => {
    return new Application().run(['test-command', '--name=Marcus', '-a 30', '-v'])
  })

  t.pass()
})
