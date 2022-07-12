const fs = require('fs');
const path = require('path');
const idkitLib = require('./lib');
const lib = idkitLib.initModule();

const fileName = "png.png";

async function getSUDFile() {
  const user = await lib.initUser();

  const imagePath = path.join(__dirname, fileName );

  // sample fingerprint images
  // const unknownFingerprint = fs.readFileSync( imagePath );

  // get base64 of image
  const b64 = fs.readFileSync( imagePath, 'base64');
  console.log("b64",b64);

  await user.addFingerprint( Buffer.from(b64, "base64"), lib.fingerPosition.UNKNOWN_FINGER);

  // return Promise of serialized user (Buffer of SUD = Serialized User Data)
  const serializedUser = await user.serializeUser(true);
  return serializedUser;
}



// (async () => {
//   const SUDFile = await getSUDFile();
//   fs.writeFileSync( path.join(__dirname, "base64.SUD") , SUDFile);
// })();



module.exports = {
  getSUDFile: getSUDFile,
  dhruv: () => {},
  name: { hello:"world" }
};




