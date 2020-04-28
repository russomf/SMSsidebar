/**
 * @OnlyCurrentDoc Limits the script to only accessing the current sheet.
 */

/**
 * Title       : SMSsidebar.js
 * Description : A Google Doc sidebar script to send SMS messages using Twilio API
 * Author      : Mark F. Russo, Ph.D.
 * Version     : v1.0.0
 * 
 * Copyright (c) 2020 Mark F. Russo
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const acct_sid     = 'Twilio Account SID';
const auth_token   = 'Twilio Auth Token';
const from_num     = '123-456-7890';
const messages_url = `https://api.twilio.com/2010-04-01/Accounts/${acct_sid}/Messages.json`;
const firstDataRow = 2;
const sidebarHTML  = `
<style>
  * {font-family:helvetica,arial;font-size:11pt;}
  textarea {width:100%;height:400px;}
</style>
<script>
  function sendAll() {
    var msg = document.getElementById('idMsg').value;
    google.script.run.sendAll(msg);
  }
  function sendSelected() {
    var msg = document.getElementById('idMsg').value;
    google.script.run.sendSelected(msg);
  }
</script>
<p>Message:</p>
<textarea id='idMsg'></textarea>
<p>[ <a href='javascript:sendAll()'>Send all</a> ]</p>
<p>[ <a href='javascript:sendSelected()'>Send to selected</a> ]</p>
`;

/**
 * Setup the menu when the sheet is open
 */
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('SMS')
      .addItem('Show sidebar', 'showSidebar')
      .addToUi();
}

/**
 * Show the sidebar
 */
function showSidebar() {
  var html = HtmlService.createHtmlOutput(sidebarHTML)
      .setTitle('SMS Messaging')
      .setWidth(400);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Send one message
 */
function sendSms(to, msg) {

  var payload = {
    "To"   : to,
    "Body" : msg,
    "From" : from_num
  };

  var options = {
    "method" : "post",
    "payload" : payload
  };

  options.headers = { 
    "Authorization" : "Basic " + Utilities.base64Encode(`${acct_sid}:${auth_token}`)
  };

  UrlFetchApp.fetch(messages_url, options);
}

/**
 * Send all messages to all numbers in active sheet
 */
function sendAll(msg) {
  // Get the range of data on the current sheet
  var sheet       = SpreadsheetApp.getActiveSheet();
  var numDataRows = sheet.getLastRow() - firstDataRow + 1;
  var dataRange   = sheet.getRange(firstDataRow, 1, numDataRows, 2);
  var data        = dataRange.getValues();
  
  // Clear column status color
  sheet.getRange('B:B').setBackground(null);
  
  // Send all messages
  for (var i=0; i<numDataRows; i++) {
    try {
      let row = data[i];                            // Get data, send message and set cell color
      let response_data = sendSms(row[1], msg.replace('<NAME>', row[0]));
      sheet.getRange(firstDataRow+i, 2).setBackground('#d9ead3');
    } catch(err) {
      sheet.getRange(firstDataRow+i, 2).setBackground('#f4cccc');
      //Logger.log(err);
      //sheet.getRange(firstDataRow+i, 4).setValue(err.message);
    }
  }
}

/**
 * Send messages to numbers on selected rows
 */
function sendSelected(msg) {
  // Get all data as usual
  var sheet        = SpreadsheetApp.getActiveSheet();
  var sheetLastRow = sheet.getLastRow();
  var numDataRows  = sheetLastRow - firstDataRow + 1;
  var dataRange    = sheet.getRange(firstDataRow, 1, numDataRows, 2);
  var data         = dataRange.getValues();         // Get all data from sheet
  
  // Clear column status color
  sheet.getRange('B:B').setBackground(null);
  
  // Send to selected rows only
  
  // Get selected ranges and iterate over each range individually
  var ranges = sheet.getActiveRangeList().getRanges();
  for(var j=0; j<ranges.length; j++) {
    var range       = ranges[j];                    // Get one range from range list
    var startRngRow = range.getRow()                // Get range row start and num rows
    var numRngRows  = range.getNumRows();
    
    // Iterate over all rows in range and generate row number
    for (var i=0; i<numRngRows; i++) {              // Loop over all row offsets in range
      var sheetRow = startRngRow + i;               // Absolute row in sheet
      if (sheetRow >= firstDataRow && sheetRow <= sheetLastRow) {
        var dataRow  = sheetRow - firstDataRow;     // Row in data array
        
        try {
          let row = data[dataRow];                  // Get data, send message and set cell color
          let response_data = sendSms(row[1], msg.replace('<NAME>', row[0]));
          sheet.getRange(sheetRow, 2).setBackground('#d9ead3');
        } catch(err) {
          sheet.getRange(sheetRow, 2).setBackground('#f4cccc');
          //Logger.log(err);
          //sheet.getRange(sheetRow, 4).setValue(err.message);
        }
      }
    }
  }
}
