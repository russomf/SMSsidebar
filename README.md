# SMSsidebar
SMSsidebar.js is a Google Apps Script that adds a sidebar to a Doc for sending SMS messages using the Twilio API.

Based on https://www.twilio.com/blog/2016/02/send-sms-from-a-google-spreadsheet.html

## Description

The SMSsidebar.js script will let you send an SMS message to all or a selected subset of entries on a Google sheet. It adds a menu to the sheet which has an option to display a sidebar. The sidebar has a text box into which you can add some text. Below the text box are links to send the text as an SMS message to all mobile numbers on the sheet, or only to the ones you have selected with the mouse. Note that if you add &lt;NAME&gt; to the text of a message, the script will replace that text with the name from a row in the sheet. This way you can personalize each SMS message.

Before you can use the script you must add it to your Google sheet and enter your Twilio SID, Twilio Auth Token and the mobile number from which messages will be sent. These can be entered at the top of the script file.

The script makes some assumptions. It assumes that the recipient name is in the first column of the sheet and the recipient's mobile number is in the second column of the sheet. It also assumes that the first row is used for column headers. 

## Installation

1. Open your Google sheet
2. Select the menu "Tools | Script editor". This will open a script editor in a new browser tab or a new window.
3. Delete any text that is in the editor.
4. Open the SMSsidebar.js script file in a simple text editor.
5. Copy the entire script and paste it into the Script editor.
6. At the top of the pasted script replace `Twilio Account SID` with your account ID, `Twilio Auth Token` with your token and `123-456-7890` with your mobile number. It is very important that you leave the quotes that delimit these data items.
7. Save the script by clicking the disk icon in the upper left of the Script editor and give the script project a name.
8. Go back to the Google Sheet and reload the browser page.
    * In a few seconds you will see a new menu item in your sheet named *SMS*. It will be the last menu item on the right.
9. Click the *SMS* menu and select *Show sidebar*.
10. At some point Google is going to ask your permission to associate the script with the sheet. This will happen only once. When it does, please grant it permission by doing the following:
    * You will see a dialog that says 'This app isn't verified'
    * When you see this click 'Advanced'
    * Click 'Go to &lt;sript name&gt;(unsafe)'
    * Click 'Allow'
    * You will get an email from Google with a Security alert that you granted this permission
11. After granting permission, select the menu item again.
    * A sidebar will show up in the sheet to the right.
12. Enter text to be sent in the text box.
    * Note that if the text of the message contains &lt;NAME&gt;, before sending the message to the mobile number in column 2, the script will replace &lt;NAME&gt; with the corresponding name text in column 1 of the sheet.
13. Send the message by clicking one of the links below the message. 
    * Clicking the [ <u>Send all</u> ] link will send your message to all mobile numbers in the second column.
    * Clicking the [ <u>Send to selected</u> ] link will send your message only to numbers in the selected rows.
    * Note that you can select disjoint rows using Ctrl-Click (or Cmd-Click on a Mac).
14. After an SMS messages is sent it indicates the result by shading the cell.
    * If successful, the cell containing the mobile number is shaded light green.
    * If the message fails to send, the cell containing the mobile number is shaded light red. This allows you to resend failed messages.
