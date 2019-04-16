const test = require('ava')

global.SpreadsheetApp = {
  getActiveSheet: () => ({ getSheetByName: () => ('RawData') })
}

const doPost = require('./Code.gs')

test('should not throw if the input is indefined', t => {
  const result = doPost()

  t.is(result, undefined)
})

test('should not throw if the input does not have the content', t => {
  const result = doPost({})

  t.is(result, undefined)
})