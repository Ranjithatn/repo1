const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

exec('git rev-parse HEAD', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  if ( stdout ) {
    saveGitHash(stdout);
  }
  // console.log("git hash is", stdout )
});



function saveGitHash(hash) {
  const loc = path.join( __dirname, '../', '../', 'app', 'config', 'gitHash.json' );
  const jsonData = JSON.stringify({ hash: hash.trim() });

  try {
    fs.writeFileSync( loc, jsonData );
  } catch(err) {
    console.error( "error occoured while writing git hash to file.", err );
  }

}







