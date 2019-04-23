require('./SpreadsheetApp')
const { serial: test } = require('ava')
const sinon = require('sinon')
const { updateHeader } = require('../Code.js')

const getRangeSpy = sinon.spy(SpreadsheetApp, 'getRange')
const setValueSpy = sinon.spy(SpreadsheetApp, 'setValue')
const getLastColumnStub = sinon.stub(SpreadsheetApp, 'getLastColumn')

test.beforeEach(() => {
  getRangeSpy.resetHistory()
  setValueSpy.resetHistory()
  getLastColumnStub.resetHistory()
})

test('should insert a name if the spreadsheet is empty', t => {
  const headerRow = 1
  const names = ['temperature']
  const sheet = SpreadsheetApp.getActiveSheet()

  updateHeader(sheet, headerRow, names)

  t.true(getRangeSpy.called)
  t.is(getRangeSpy.args[0].length, 2)
  t.true(setValueSpy.called)
  t.is(setValueSpy.firstCall.args.length, 1)
  t.is(setValueSpy.firstCall.args[0], 'temperature')
})

test('should insert multiple name if the spreadsheet is empty', t => {
  const headerRow = 1
  const names = ['temperature', 'humidity']
  const sheet = SpreadsheetApp.getActiveSheet()

  updateHeader(sheet, headerRow, names)

  t.true(getRangeSpy.called)
  t.is(getRangeSpy.args[0].length, 2)
  t.true(setValueSpy.called)
  t.is(setValueSpy.firstCall.args.length, 1)
  t.is(setValueSpy.firstCall.args[0], 'temperature')
  t.is(setValueSpy.secondCall.args.length, 1)
  t.is(setValueSpy.secondCall.args[0], 'humidity')
})

test('should not insert duplicate row names', t => {
  const duplicateRowName = 'temperature'
  getLastColumnStub.returns(2)
  const getValueSpy = sinon.stub(SpreadsheetApp, 'getValue').returns(duplicateRowName)

  const headerRow = 1
  const names = [duplicateRowName, 'humidity']
  const sheet = SpreadsheetApp.getActiveSheet()

  updateHeader(sheet, headerRow, names)

  t.true(getRangeSpy.called)
  t.is(getRangeSpy.args[0].length, 2)
  t.true(setValueSpy.called)
  t.is(setValueSpy.args.length, 1)
  t.is(setValueSpy.firstCall.args.length, 1)
  t.is(setValueSpy.firstCall.args[0], 'humidity')

  getValueSpy.resetHistory()
})

