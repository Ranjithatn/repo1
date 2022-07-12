const fs = require('fs');
const path = require('path');

const filePathOld = path.join(__dirname, '../../', 'release', 'win-ia32-unpacked', 'Universal Criminal Workstation.exe');
const filePathNew = path.join(__dirname, '../../', 'release', 'win-ia32-unpacked', 'UniversalCriminalWorkstation.exe');


fs.renameSync(filePathOld, filePathNew);


