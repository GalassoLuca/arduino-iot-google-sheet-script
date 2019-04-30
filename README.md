# Description
This repo contains a script (Code.gs) to integrate Arduino IoT Cloud with Google Sheets using web-hooks. 
The script is part of a project in which data read from different sensors are sent to a google spreadsheet in order to 
update tables and charts in real time.

# Arduino Code
Requirements
1. Arduino MKR WiFi 1010
2. Arduino MKR Env Shield

[Arduino Cloud – HouseMonitor](https://create.arduino.cc/editor/GalassoLuca/e077d89f-25ce-4a5f-8d73-e486b654cba6/preview)

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

# Init
`npm install`

# Test
`npm test`

# Build the file
`npm run build`

# Google Sheet configuration
1. Create new Google Sheet
2. Go to `Tools` > `Script Editor`
3. Copy+Paste `Code.gs` code into it
4. Go to `Publish` > `Deploy as web app...`
   1. For `Project version` select `New`
   2. For `Execute the app as:` select your account
   3. For `Who has access to the app:` select `Anyone, even anonymous`
   4. Click the button `Publush`/`Update`
5. Copy your `Current web app URL` that is your WebHook
6. Paste webhook link into your Arduino Dashboard (below variables in the edit section)

[This is my Spreadsheet](https://docs.google.com/spreadsheets/d/1sEhbH3fKr8hfL_KI2ciFB2GzFZUWk9ZH4xPxGBNf5Ec/edit?usp=sharing)
