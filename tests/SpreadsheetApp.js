global.SpreadsheetApp = {
  getActiveSheet: () => ({
    getSheetByName: (sheetName) => ({
      getRange: (start, end) => ({
        getValue: () => { },
        setValue: (value) => ({
          setNumberFormat: (format) => {}
        }),
        setFontColor: (color) => { },
        setFontSize: (size) => { },
        setFontWeight: (weight) => { }
      }),
      getLastColumn: () => { },
      getLastRow: () => { },
      insertRowAfter: () => { }
    })
  })
}
