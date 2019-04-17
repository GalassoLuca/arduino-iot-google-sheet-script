# arduino-iot-google-sheet-script
This repo contains a script (Code.gs) to integrate Arduino IoT Cloud with Google Sheets using web-hooks. 
The script is part of a project in which data read from different sensors are sent to a google spreadsheet in order to 
update tables and charts in real time.

# Google Spreadsheet structure
```
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
```