'use strict'

const { ConsoleInput } = require('../dist/io/console-input')

async function run () {
  const input = new ConsoleInput()

  const name = await input.ask('What’s your name?', builder => {
    builder
      .defaultValue('Marcus')
      .transform(value => Number(value))
  })

  console.log({ name })

  const confirmed = await input.confirm('Proceed?', builder => {
    builder.defaultValue(true)
  })

  console.log({ confirmed })
}

run()
