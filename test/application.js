'use strict'

const { test } = require('tap')
const { Application } = require('../dist')

test('Console Application', async () => {
  test('version', async t => {
    const app = new Application()

    app.setVersion('1.1.2')
    t.equal(app.version(), '1.1.2')

    app.setVersion()
    t.equal(app.version(), '')

    app.setVersion(null)
    t.equal(app.version(), '')

    app.setVersion(4)
    t.equal(app.version(), 4)
  })
})
