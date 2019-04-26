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
    isOldMessage,
    updateHeader,
    doPost,
  }
} catch (err) { }

function doPost (e) {
  const cloudData = JSON.parse(e.postData.contents)
  const { values } = cloudData
  const messageDate = new Date(values[0].updated_at)

  if (isNaN(messageDate.getFullYear())) {
    throw new Error('Compromised data. (Is it a duplicate?)')
  }

  if (isOldMessage(messageDate)) {
    // return
  }

  // this section write property names
  // sheet.getRange(headerRow + 1, timestampCol).setValue(messageDate).setNumberFormat("yyyy-MM-dd HH:mm:ss");
  values.unshift({
    name: 'timestamp',
    value: messageDate
  })

  const sheet = SpreadsheetApp.getActiveSheet()
  const headerRow = 1
  const names = values.map(value => value.name)

  updateHeader(sheet, headerRow, names)

  const maxRowsToDisplay = 1440
  if (sheet.getLastRow() > maxRowsToDisplay) {
    sheet.deleteRow(lastRow)
  }

  sheet.insertRowAfter(headerRow)

  updateRowStyle(sheet, 2)

  // write values in the respective columns
  const lastCol = sheet.getLastColumn()
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
  names.forEach(name => {
    const headerValues = getRowValues(sheet, headerRow)

    // if (headerValues.includes(name)) {
    if (headerValues.filter(String).indexOf(name) > -1) {
      return
    }

    // bug when there is an empty cell
    const lastCol = headerValues.filter(String).length
    sheet.getRange(headerRow, lastCol + 1).setValue(name)
  })
}

function updateRowStyle(sheet, row) {
  const lastCol = sheet.getLastColumn()
  const range = sheet.getRange(row, 1, 1, lastCol)

  // range.setBackground('#ffffff');
  range.setFontColor('#000000')
  range.setFontSize(10)
  range.setFontWeight('normal')
}

function getRowValues(sheet, row) {
  const lastCol = sheet.getLastColumn()
  const rowValues = sheet.getRange(row, 1, 1, lastCol).getValues()[0]

  return rowValues
}

function isOldMessage (messageDate) {
  const maxSupportedDeltaMS = 5 * 1000
  if (Date.now() - messageDate.getTime() > maxSupportedDeltaMS) {
    return true
  }
}