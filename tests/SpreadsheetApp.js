const FlatSpreasheetApp = {}

FlatSpreasheetApp.getActiveSheet = (sheetName) => ({
  getRange: FlatSpreasheetApp.getRange,
  getLastColumn: FlatSpreasheetApp.getLastColumn,
  getLastRow: FlatSpreasheetApp.getLastRow,
  insertRowAfter: FlatSpreasheetApp.insertRowAfter
})

FlatSpreasheetApp.getRange = (start, end) => ({
  getValue: FlatSpreasheetApp.getValue,
  getValues: FlatSpreasheetApp.getValues,
  setValue: FlatSpreasheetApp.setValue,
  setFontColor: FlatSpreasheetApp.setFontColor,
  setFontSize: FlatSpreasheetApp.setFontSize,
  setFontWeight: FlatSpreasheetApp.setFontWeight
})

FlatSpreasheetApp.getValue = () => { }
FlatSpreasheetApp.getValues = () => [[]]

FlatSpreasheetApp.setValue = (value) => ({
  setNumberFormat: FlatSpreasheetApp.setNumberFormat
})

FlatSpreasheetApp.setNumberFormat = (format) => { }
FlatSpreasheetApp.setFontColor = (color) => { }
FlatSpreasheetApp.setFontSize = (size) => { }
FlatSpreasheetApp.setFontWeight = (weight) => { }
FlatSpreasheetApp.getLastColumn = () => { }
FlatSpreasheetApp.getLastRow = () => { }
FlatSpreasheetApp.insertRowAfter = () => { }

global.SpreadsheetApp = FlatSpreasheetApp
