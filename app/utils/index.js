import fs from "fs";
import path from "path";


export function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


const licensePath = path.join("C:","ProgramData", "Innovatrics", "iengine.lic");
const licenseFile = path.join(__dirname, '../', '../', "iengine.lic" );

// check if license file is present
export const checkIfLicenseExists = () => {
  // console.log("checkIfLicenseExists", __dirname, licensePath, licenseFile);
  if ( ! fs.existsSync(licensePath) && fs.existsSync(licenseFile) ) {
    console.log("license doesnt exist, but is present in app")
    fs.createReadStream( licenseFile ).pipe( fs.createWriteStream(licensePath) );
  } else {
    // console.log("adding license failed");
  }

}

/*
  "D:\-\win-ia32-unpacked\resources\app.asar"
*/
