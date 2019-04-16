const test = require('ava')

global.SpreadsheetApp = {
  getActiveSheet: () => ({ getSheetByName: () => ('RawData') })
}

const Code = require('./Code.gs')

test('unicorns are truthy', t => {
  t.truthy('unicorn'); // Assertion
});