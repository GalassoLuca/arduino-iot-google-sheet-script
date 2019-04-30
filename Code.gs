'use strict';

try {
  module.exports = {
    isOldMessage: isOldMessage,
    updateHeader: updateHeader,
    doPost: doPost,
    parseValues: parseValues
  };
} catch (err) {}

function doPost(e) {
  var cloudData = JSON.parse(e.postData.contents);
  var values = parseValues(cloudData.values);
  var messageDate = new Date(values[0].updated_at);

  if (isNaN(messageDate.getFullYear())) {
    throw new Error('Compromised data. (Is it a duplicate?)');
  }

  if (isOldMessage(messageDate)) {
    return;
  }

  values.unshift({
    name: 'timestamp',
    value: messageDate
  });

  var sheet = SpreadsheetApp.getActiveSheet();
  var headerRow = 1;
  var names = values.map(function (value) {
    return value.name;
  });

  var header = updateHeader(sheet, headerRow, names);

  var maxRowsToDisplay = 1440;
  if (sheet.getLastRow() > maxRowsToDisplay) {
    sheet.deleteRow(lastRow);
  }

  sheet.insertRowAfter(headerRow);
  updateRowStyle(sheet, headerRow + 1);

  updateValues(sheet, headerRow, header, values);
}

function parseValues(values) {
  return values.reduce(function (acc, cv) {
    if (cv.name !== 'MKR_env_shield_variables') {
      acc.push(cv);
      return acc;
    }

    var mkrObj = JSON.parse(cv.value);

    Object.keys(mkrObj).forEach(function (name) {
      var newValue = Object.assign({}, cv);

      newValue.name = name;
      newValue.value = mkrObj[name];
      acc.push(newValue);
    });

    return acc;
  }, []);
}

function updateValues(sheet, headerRow, headerValues, values) {
  values.forEach(function (_ref) {
    var value = _ref.value,
        name = _ref.name;

    var colIndex = 1 + headerValues.indexOf(name);

    if ([true, false].includes(value)) {
      value = value.toString();
    }

    sheet.getRange(headerRow + 1, colIndex).setValue(value);
  });
}

function updateHeader(sheet, headerRow, names) {
  names.forEach(function (name) {
    var headerValues = getRowValues(sheet, headerRow);

    if (headerValues.filter(String).includes(name)) {
      return;
    }

    var lastHeaderCol = headerValues.filter(String).length;
    sheet.getRange(headerRow, lastHeaderCol + 1).setValue(name);
  });

  return getRowValues(sheet, headerRow);
}

function updateRowStyle(sheet, row) {
  var lastCol = sheet.getLastColumn();
  var range = sheet.getRange(row, 1, 1, lastCol);

  range.setFontColor('#000000');
  range.setFontSize(10);
  range.setFontWeight('normal');

  var timestampCol = 1;
  sheet.getRange(row, timestampCol).setNumberFormat("yyyy-MM-dd HH:mm:ss");
}

function getRowValues(sheet, row) {
  var firstCol = 1;
  var lastCol = sheet.getLastColumn();
  var numberOfRows = 1;
  var rowValues = sheet.getRange(row, firstCol, numberOfRows, lastCol).getValues()[0];

  return rowValues;
}

function isOldMessage(messageDate) {
  var maxSupportedDeltaMS = 5 * 1000;
  if (Date.now() - messageDate.getTime() > maxSupportedDeltaMS) {
    return true;
  }
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function (value) {
    return this.some(function (v) {
      return value === v;
    });
  };
}
