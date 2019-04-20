/*
* Copyright 2018 ARDUINO SA (http://www.arduino.cc/)
* This file is part of arduino-iot-google-sheet-script.
* Copyright (c) 2019
* Authors: Marco Passarello
*
* This software is released under:
* The GNU General Public License, which covers the main part of
* arduino-iot-google-sheet-script
* The terms of this license can be found at:
* https://www.gnu.org/licenses/gpl-3.0.en.html
*
* You can be released from the requirements of the above licenses by purchasing
* a commercial license. Buying such a license is mandatory if you want to modify or
* otherwise use the software for commercial activities involving the Arduino
* software without disclosing the source code of your own applications. To purchase
* a commercial license, send an email to license@arduino.cc.
*
*/

// module is not supported in Google Apps Script, but we need to export it in order to test it
try {
  module.exports = {
    doPost,
    updateHeader
  }
} catch (err) { }

function doPost (e) {
  const maxRowsToDisplay = 1440
  const headerRow = 1

  const sheet = SpreadsheetApp.getActiveSheet()

  const cloudData = JSON.parse(e.postData.contents)
  const values = cloudData.values

  const messageDate = new Date(values[0].updated_at)

  if (isNaN(messageDate.getFullYear())) {
    throw new Error('Compromised data (is it a duplicate?)')
  }

  // discard all messages that arrive 'late'
  if (sheet.getRange(headerRow + 1, 1).getValue() !== '') { // for the first time app is run
    const maxSupportedDeltaMS = 5 * 1000
    if (Date.now() - messageDate.getTime() > maxSupportedDeltaMS) {
      return
    }
  }

  // this section write property names
  // sheet.getRange(headerRow + 1, timestampCol).setValue(messageDate).setNumberFormat("yyyy-MM-dd HH:mm:ss");
  values.unshift({
    name: 'timestamp',
    value: messageDate
  })

  // TODO create updateHeader()
  const names = values.map(value => value.name)
  updateHeader(sheet, headerRow, names)

  // redefine last coloumn and last row since new names could have been added
  var lastCol = sheet.getLastColumn()
  var lastRow = sheet.getLastRow()

  // delete last row to maintain constant the total number of rows
  if (lastRow > maxRowsToDisplay) {
    sheet.deleteRow(lastRow)
  }

  // insert new row after deleting the last one
  sheet.insertRowAfter(headerRow)

  // reset style of the new row, otherwise it will inherit the style of the header row
  var range = sheet.getRange('A2:Z2')
  // range.setBackground('#ffffff');
  range.setFontColor('#000000')
  range.setFontSize(10)
  range.setFontWeight('normal')

  // write values in the respective columns
  for (var col = 1; col <= lastCol; col++) {
    // first copy previous values
    // this is to avoid empty cells if not all properties are updated at the same time
    sheet.getRange(headerRow + 1, col).setValue(sheet.getRange(headerRow + 2, col).getValue())
    for (var i = 0; i < values.length; i++) {
      const currentName = sheet.getRange(headerRow, col).getValue()
      if (currentName == values[i].name) {
        // turn boolean values into 0/1, otherwise google sheets interprets them as labels in the graph
        if ([true, false].includes(values[i].value)) {
          values[i].value = values[i].value.toString()
        }
        sheet.getRange(headerRow + 1, col).setValue(values[i].value)
      }
    }
  }
}

function updateHeader (sheet, headerRow, names) {
  for (var i = 0; i < names.length; i++) {
    const name = names[i]
    const lastCol = sheet.getLastColumn() // at the very beginning this should return 1 // second cycle -> it is 2

    for (var col = 1; col <= lastCol; col++) {
      if (sheet.getRange(headerRow, col).getValue() === name) {
        return
      }
    }

    sheet.getRange(headerRow, lastCol + 1).setValue(name)
  }
}