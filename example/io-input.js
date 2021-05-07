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

  const choice = await input.choice('What color do you like?', [
    {
      title: 'Marcus', value: 'marcus', disabled: true
    },
    {
      title: 'Norman', value: 'norman', description: 'this dude ey'
    },
    {
      title: 'Christian', value: 'christian'
    }

    // fluent interface idea:
    // choice.add('Norman').value('norman').description('this dude ey!')
    // choice.add('Christian').value('christian')
  ])

  const password = await input.password('Enter your password', builder => {
    builder.defaultValue('tester')
  })

  const passwordRepeat = await input.password('Repeat your password (will not be not visible)', builder => {
    builder.defaultValue('tester').invisible()
  })

  const secret = await input.secure('Enter your secret token')

  console.log({ name, age, confirmed, choice, password, passwordRepeat, secret })
}

run()
