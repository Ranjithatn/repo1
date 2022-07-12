// DeployTheLicense
// License Path: C:\ProgramData\Innovatrics\iengine.lic


const fs = require('fs');
const path = require('path');


const licensePath = "C:\license.lic";

const deployPath = path.join(__dirname, '../../', 'release', 'win-ia32-unpacked', 'Test.lic');

fs.createReadStream( licensePath ).pipe( fs.createWriteStream(deployPath) );
console.log("license successfully deployed.");
