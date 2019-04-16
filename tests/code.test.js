const test = require('ava')
const fixtures = require('./fixtures')

global.SpreadsheetApp = {
  getActiveSheet: () => ({ getSheetByName: () => ('RawData') })
}

const doPost = require('../Code.gs')

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

test.only('should return `OK` if the input has values', t => {
  const result = doPost(fixtures.objectWithSingleValue)

  t.is(result, 'OK')
})