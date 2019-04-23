const test = require('ava')
const { isOldMessage } = require('../Code.js')

test('should return false if the given date is the current timestamp', t => {
  const isOld = isOldMessage(new Date())

  t.falsy(isOld)
})

test('should return false if the date has 1 second of delay', t => {
  const dateWithOneSecondDelay = new Date(Date.now() - 1000)
  const isOld = isOldMessage(dateWithOneSecondDelay)

  t.falsy(isOld)
})

test('should return false if the date has more then 5 second of delay', t => {
  const dateWithOneSecondDelay = new Date(Date.now() - 5001)
  const isOld = isOldMessage(dateWithOneSecondDelay)

  t.true(isOld)
})
