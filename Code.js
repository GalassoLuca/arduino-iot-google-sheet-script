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
    parseValues
  }
} catch (err) { }

function doPost(e) {
  const cloudData = JSON.parse(e.postData.contents)
  let values = cloudData.values
  const messageDate = new Date(values[0].updated_at)

  if (isNaN(messageDate.getFullYear())) {
    throw new Error('Compromised data. (Is it a duplicate?)')
  }

  if (isOldMessage(messageDate)) {
    throw new Error('The message is too old!')
  }

  values = parseValues(values)
  values.unshift({
    name: 'timestamp',
    value: messageDate
  })

  const sheet = SpreadsheetApp.getActiveSheet()
  const headerRow = 30

  const names = values.map(value => value.name)
  const header = updateHeader(sheet, headerRow, names)

  sheet.insertRowAfter(headerRow)
  updateRowStyle(sheet, headerRow + 1)

  updateValues(sheet, headerRow, header, values)

  // deleteLastRow(sheet)
}

function deleteLastRow (sheet) {
  const maxRowsToDisplay = 1440
  const lastRow = sheet.getLastRow()
  if (lastRow > maxRowsToDisplay) {
    sheet.deleteRow(lastRow)
  }
}

function parseValues(values) {
  return values.reduce((acc, cv) => {
    if (!cv.name.startsWith("JSON")) {
      acc.push(cv)
      return acc
    }

    const jsonValues = JSON.parse(cv.value)

    Object.keys(jsonValues).forEach(name => {
      const newValue = JSON.parse(JSON.stringify(cv))

      newValue.name = name
      newValue.value = jsonValues[name]

      acc.push(newValue)
    })

    return acc
  }, [])
}

function updateValues(sheet, headerRow, headerValues, values) {
  values.forEach(({ value, name }) => {
    const colIndex = 1 + headerValues.indexOf(name)

    // if ([true, false].indexOf(value) > -1) {
    if ([true, false].includes(value)) {
      value = value.toString()
    }

    sheet.getRange(headerRow + 1, colIndex).setValue(value)
  })
}

function updateHeader(sheet, headerRow, names) {
  names.forEach(name => {
    const headerValues = getRowValues(sheet, headerRow)

    if (headerValues.filter(String).includes(name)) {
      return
    }

    const lastHeaderCol = headerValues.filter(String).length
    sheet.getRange(headerRow, lastHeaderCol + 1).setValue(name)
  })

  return getRowValues(sheet, headerRow)
}

function updateRowStyle(sheet, row) {
  const firstCol = 1
  const numberOfRows = 1
  const lastCol = sheet.getLastColumn()
  const range = sheet.getRange(row, firstCol, numberOfRows, lastCol)

  // range.setBackground('#ffffff');
  range.setFontColor('#000000')
  range.setFontSize(10)
  range.setFontWeight('normal')

  const timestampCol = 1
  sheet.getRange(row, timestampCol).setNumberFormat("yyyy-MM-dd HH:mm:ss");
}

function getRowValues(sheet, row) {
  const firstCol = 1
  const numberOfRows = 1
  const lastCol = sheet.getLastColumn() || 1
  const rowValues = sheet.getRange(row, firstCol, numberOfRows, lastCol).getValues()[0]

  return rowValues
}

function isOldMessage(messageDate) {
  const maxSupportedDeltaMS = 5 * 1000
  if (Date.now() - messageDate.getTime() > maxSupportedDeltaMS) {
    return true
  }
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function (value) {
    return this.some(v => value === v)
  }
}

if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, 'startsWith', {
    value: function (search, pos) {
      pos = !pos || pos < 0 ? 0 : +pos
      return this.substring(pos, pos + search.length) === search
    }
  })
}