const fs = require('fs');
const path = require('path');
const packageJSON = require('../../package.json');

//     "deploy-innovatrics-license": "node internals/scripts/DeployTheLicense.js"
    // "package-win-release": "npm run app-update-yml && npm run deploy-innovatrics-license && build --win --ia32 --prepackaged ./release/win-ia32-unpacked",


const filePath = path.join(__dirname, '../../', 'release', 'win-ia32-unpacked', 'resources', 'app-update.yml');
// const filePath = path.join(__dirname, '../../', 'release', 'app-update.yml');
console.log("filePath",filePath);

const data = packageJSON.build.publish[0];
const content = `provider: ${data.provider}
url: '${ data.url }'
`;

if ( data.provider === "generic" ) {
  fs.writeFile(filePath, content, function(err) {
    if( err ) {
      return console.log( err );
    }
    console.log("The file was saved!");
  });
}

