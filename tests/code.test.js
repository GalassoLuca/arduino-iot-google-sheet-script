const { FlatSpreasheetApp } = require('./SpreadsheetApp')

const test = require('ava')
const fixtures = require('./fixtures')
const sinon = require('sinon')

const getActiveSheetSpy = sinon.spy(FlatSpreasheetApp, 'getActiveSheet')
const getSheetByNameSpy = sinon.spy(FlatSpreasheetApp, 'getSheetByName')

const doPost = require('../Code.gs')

test('should have called getActiveSheet()', t => {
  t.true(getActiveSheetSpy.called)
})

test('should have called getSheetByName()', t => {
  t.true(getSheetByNameSpy.called)
  t.is(getSheetByNameSpy.args[0][0], 'RawData')
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

  t.is(error.message, 'Cannot read property \'length\' of undefined')
})

test('should throw if the date of a value is compromised (due to duplicate message)', async t => {
  const error = await t.throws(() => doPost(fixtures.objectWithCorruptedValue))

  t.is(error.message, 'Compromised data (is it a duplicate?)')
})

test('should return undefined if the message is older than 5 seconds', t => {
  const result = doPost(fixtures.objectWithOldValue)

  t.is(result, undefined)
})

test('should not throw if the input is in a well formed format', t => {
  const result = doPost(fixtures.objectWithSingleValue)

  t.is(result, undefined)
})
