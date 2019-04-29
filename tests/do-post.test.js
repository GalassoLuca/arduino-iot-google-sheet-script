require('./SpreadsheetApp')
const { serial: test } = require('ava')
const sinon = require('sinon')
const fixtures = require('./fixtures')
const { doPost } = require('../Code.js')

const getActiveSheetSpy = sinon.spy(SpreadsheetApp, 'getActiveSheet')

test('should not call getActiveSheet() outside doPost() because it is instable if it is called in a parallel way', t => {
  t.false(getActiveSheetSpy.called)
})

test('should call getActiveSheet() after calling doPost() if the message is valid', t => {
  doPost(fixtures.objectWithEnvVarsOnly)

  t.true(getActiveSheetSpy.called)
})

test('should throw if the input is indefined', async t => {
  const error = await t.throws(doPost)

  t.is(error.message, 'Cannot read property \'postData\' of undefined')
})

test('should throw if the input does not have the content', async t => {
  const error = await t.throws(() => doPost({}))

  t.is(error.message, 'Cannot read property \'contents\' of undefined')
})

test('should throw if the input does not have values', async t => {
  const error = await t.throws(() => doPost(fixtures.objectWithoutValues))

  t.is(error.message, 'Cannot read property \'0\' of undefined')
})

test('should throw if the date of a value is compromised (due to duplicate message)', async t => {
  const error = await t.throws(() => doPost(fixtures.objectWithCorruptedValue))

  t.is(error.message, 'Compromised data. (Is it a duplicate?)')
})

test('should return undefined if the message is older than 5 seconds', t => {
  const result = doPost(fixtures.objectWithOldValue)

  t.is(result, undefined)
})

test('should not throw if the input is in a well formed format', t => {
  const result = doPost(fixtures.objectWithSingleValue)

  t.is(result, undefined)
})
