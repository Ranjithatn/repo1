
// GenerateSettingsJsonFile
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../', 'release', 'win-ia32-unpacked', 'UCW_Settings.json');


const content = `
{
  "serverConnection": "",
  "ipAddress": "",
  "logging": "",
  "logFile": "",
  "protocol": "",
  "captureDevice": "",
  "workstationName": "",
  "location": "",
  "clientSSLCert": "enabled",
  "thumbnailSize": "400",
  "defaultScanner": "",
  "osArchitecture": ""
}
`;




  fs.writeFile(filePath, content, function(err) {
    if( err ) {
      return console.log( "Error occoured while creating settings file:", err );
    }
    console.log("Settings file was successfully saved!");
  });




