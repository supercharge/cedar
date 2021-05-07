'use strict'

const { Application } = require('../dist')
const HelloCommand = require('./hello-command')

async function run () {
  const app = new Application('Supercharge Console Example').setVersion('v1.1.3')

  app
    .register('make:migration')
    .register('make:model', command => {
      command.description('Scaffolds a new model instance for the given name.')
    })
    .register('inspire', command => {
      command.description('Print an inspiring message')
    })
    .register('work', command => {
      command.description('Do the work.')
      command.run = () => {
        throw new Error('This does not work!')
      }
    })
    .add(new HelloCommand())

  await app.run()
}

run()
