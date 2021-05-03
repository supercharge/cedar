'use strict'

const { ConsoleInput } = require('../dist/io/console-input')

async function run () {
  const input = new ConsoleInput()

  const name = await input.ask('What’s your name?', builder => {
    builder
      .defaultValue('Marcus')
      .transform(value => String(value).toUpperCase())
  })

  const age = await input.ask('What’s your age?', builder => {
    builder
      .defaultValue(123)
      .transform(value => Number(value))
  })

  const confirmed = await input.confirm('Proceed?', builder => {
    builder.defaultValue(true)
  })

  console.log({ name, age, confirmed })
}

run()
