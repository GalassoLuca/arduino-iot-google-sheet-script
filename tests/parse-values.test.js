require('./SpreadsheetApp')
const test = require('ava')
const fixtures = require('./fixtures')
const { parseValues } = require('../Code.js')

test('should not modify variables if they do not contain `MKR_env_shield_variables`', t => {
  const inValues = getValues(fixtures.objectWithSingleValue)
  const outValues = parseValues(inValues)

  t.deepEqual(outValues, inValues)
})

test('should reurn `MKR_env_shield_variables` variables', t => {
  const inValues = getValues(fixtures.objectWithEnvVarsOnly)
  const outValues = parseValues(inValues)

  t.deepEqual(outValues, fixtures.MKR_values)
})

test('should reurn correct variables if the input contains also `MKR_env_shield_variables`', t => {
  const inValues = getValues(fixtures.objectWithVarsIncludingEnvVars)
  const outValues = parseValues(inValues)

  const expectedValues = fixtures.MKR_values
  expectedValues.unshift(fixtures.humidityValue)
  expectedValues.unshift(fixtures.temperatureValue)

  t.deepEqual(outValues, fixtures.MKR_values)
})

function getValues(e) {
  const cloudData = JSON.parse(e.postData.contents)
  return cloudData.values
}