'use strict'

const { ConsoleInput } = require('../dist/io/console-input')

async function run () {
  const input = new ConsoleInput()

  console.log(
    await input.ask('What’s your name?')
  )
}

run()
