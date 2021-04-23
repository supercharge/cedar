'use strict'

const { Application } = require('../dist')
const HelloCommand = require('./hello-command')

async function run () {
  const app = new Application('Supercharge Console Example').setVersion('v1.2.3')

  app
    .register('inspire', command => {
      command.setDescription('Print an inspiring message')
    })
    .add(new HelloCommand())

  await app.run()
}

run()
