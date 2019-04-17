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
try { module.exports = doPost } catch (err) { }

function doPost(e) {
  const activeSheet = SpreadsheetApp.getActiveSheet()
  const sheet = activeSheet.getSheetByName('RawData')

  const maxRowsToDisplay = 1440
  const headerRow = 1
  const timestampCol = 1

  const cloudData = JSON.parse(e.postData.contents)
  const values = cloudData.values

  const messageDate = new Date(Date.parse(values[0].updated_at))

  /*
  This if statement is due to the fact that duplicate messages arrive from the cloud!
  If that occurs, the timestamp is not read correctly and date variable gets compromised.
  Hence, execute the rest of the script if the year of the date is well defined and it is greater
  then 2018 (or any other year before)
  */
  if (messageDate.getFullYear() > 2018) {

    // discard all messages that arrive 'late'
    if (sheet.getRange(headerRow + 1, 1).getValue() != '') { // for the first time app is run
      var now = new Date(); // now
      var COMM_TIME = 5; // rough overestimate of communication time between cloud and app
      if (now.getTime() - messageDate.getTime() > COMM_TIME * 1000) {
        return
      }
    }

    // this section write property names 
    sheet.getRange(headerRow, 1).setValue('timestamp');
    for (var i = 0; i < values.length; i++) {
      var lastCol = sheet.getLastColumn(); // at the very beginning this should return 1 // second cycle -> it is 2
      if (lastCol == 1) {
        sheet.getRange(headerRow, lastCol + 1).setValue(values[i].name);
      } else {
        // check if the name is already in header
        var found = 0;
        for (var col = 2; col <= lastCol; col++) {
          if (sheet.getRange(headerRow, col).getValue() == values[i].name) {
            found = 1;
            break;
          }
        }
        if (found == 0) {
          sheet.getRange(headerRow, lastCol + 1).setValue(values[i].name);
        }
      }
    }

    // redefine last coloumn and last row since new names could have been added
    var lastCol = sheet.getLastColumn();
    var lastRow = sheet.getLastRow();

    // delete last row to maintain constant the total number of rows
    if (lastRow > maxRowsToDisplay + headerRow - 1) {
      sheet.deleteRow(lastRow);
    }

    // insert new row after deleting the last one
    sheet.insertRowAfter(headerRow);

    // reset style of the new row, otherwise it will inherit the style of the header row
    var range = sheet.getRange('A2:Z2');
    //range.setBackground('#ffffff');
    range.setFontColor('#000000');
    range.setFontSize(10);
    range.setFontWeight('normal');

    // write the timestamp
    sheet.getRange(headerRow + 1, timestampCol).setValue(messageDate).setNumberFormat("yyyy-MM-dd HH:mm:ss");

    // write values in the respective columns
    for (var col = 1 + timestampCol; col <= lastCol; col++) {
      // first copy previous values
      // this is to avoid empty cells if not all properties are updated at the same time
      sheet.getRange(headerRow + 1, col).setValue(sheet.getRange(headerRow + 2, col).getValue());
      for (var i = 0; i < values.length; i++) {
        const currentName = sheet.getRange(HEADER_ROW, col).getValue();
        if (currentName == values[i].name) {
          // turn boolean values into 0/1, otherwise google sheets interprets them as labels in the graph
          if (incValues[i] == true) {
            incValues[i] = 1;
          } else if (incValues[i] == false) {
            incValues[i] = 0;
          }
          sheet.getRange(HEADER_ROW+1, col).setValue(incValues[i]);
        } 
      }
    }

  } else {
    throw new Error('Compromised data (is it a duplicate?)')
  } // end if (date.getYear() > 2018)
}
