const fs = require('fs');
const path = require('path');
const idkitLib = require('./lib');
// const lib = idkitLib.initModule();
const Jimp = require('jimp').default;
const Configuration = require('../app/utils/electron');
// lib.setParameter(lib.config.CFG_WSQ_BITRATE, 500);


const initLib = (errorHandler) => {
  try {
    const lib = idkitLib.initModule();
    lib.setParameter(lib.config.CFG_WSQ_BITRATE, 100);
    return lib;
  } catch (e) {
    if ( e && e.message === "50000 No license was found." ) {
      errorHandler && errorHandler();
      return false;
    }
  }
}


// generate the SUD file
// async function getSUDFile(b64, errorHandler) {
//   const lib = initLib(errorHandler);
//   const user = await lib.initUser();
//   await user.addFingerprint( Buffer.from(b64, "base64"), lib.fingerPosition.UNKNOWN_FINGER);
//   const serializedUser = await user.serializeUser(true);
//   return serializedUser;
// }
async function getSUDFile(b64, errorHandler) {
  const lib = initLib(errorHandler);
  const user = await lib.initUser();
  // await user.addFingerprint( Buffer.from(b64, "base64"), lib.fingerPosition.UNKNOWN_FINGER); // UNKNOWN_PRINT
  await user.addFingerprint( Buffer.from(b64, "base64"), lib.fingerPosition.UNKNOWN_PRINT);
  const serializedUser = await user.serializeUser(true);
  return serializedUser;
}
// 





// get WSQ image from SUD file
// async function getWSQimageFromSUD(sud, errorHandler) {
//   const lib = initLib(errorHandler);
//   const user = await lib.deserializeUser(sud);
//   const fingerprintImage = await user.getFingerprintImage(lib.fingerPosition.UNKNOWN_FINGER, lib.imageFormat.FORMAT_WSQ);
//   // lib.sync.terminateModule();

//   return fingerprintImage;
// };
async function getWSQimageFromSUD(sud, errorHandler) {
  const lib = initLib(errorHandler);
  const user = await lib.deserializeUser(sud);
  const fingerprintImage = await user.getFingerprintImage(0, lib.imageFormat.FORMAT_WSQ);
  // lib.sync.terminateModule();
  return fingerprintImage;
};





// this will get the png image from SUD file.
// async function getPNGimageFromSUD(sud, errorHandler) {
//   const lib = initLib(errorHandler);
//   const user = await lib.deserializeUser( sud );
//   const fingerprintImage = await user.getFingerprintImage(lib.fingerPosition.UNKNOWN_FINGER, lib.imageFormat.FORMAT_PNG);
//   // lib.sync.terminateModule();
//   return fingerprintImage;
// }
async function getPNGimageFromSUD(sud, errorHandler) {
  const lib = initLib(errorHandler);
  const user = await lib.deserializeUser( sud );
  const fingerprintImage = await user.getFingerprintImage(0, lib.imageFormat.FORMAT_PNG);
  // lib.sync.terminateModule();
  return fingerprintImage;
}



// get ICS template from SUD file
async function getICStemplateFromSUD(sud, errorHandler) {
  const lib = initLib(errorHandler);
  const user = await lib.deserializeUser(sud);
  const template = await user.exportUserTemplate(lib.templateFormat.FORMAT_ICS);
  return template;
};





// supported finger types for WSQ Conversion
const supportedTypes = [ "Finger", "Slap", "Palm" ];


async function generateSUD(data, errorHandler) {
  console.log("generateSUD::data",data);
  if ( data.biometrics && data.biometrics.length === 0 ) {
    return data;
  }


  return new Promise( (resolve, reject) => {

    const bio = [ ...data.biometrics ]
    const updated = [];

    const filtered = bio.filter( item => item.image );
    console.log("filtered.length",filtered.length);


    let timer = 0;


    bio.forEach( async (finger, index) => {
      console.log("finger",finger);
      if ( finger.image && supportedTypes.includes(finger.type) ) {
        const sud = await getSUDFile( finger.image, errorHandler );
        // const sudBase64 = sud.toString('base64');

        // generate template for all the biometrics as well.
        const ics = await getICStemplateFromSUD( sud, errorHandler );
        const icsBase64 = ics.toString('base64');

        updated.push({
          type: finger.type,
          impression: finger.impression,
          position: finger.position,
          encoding: "ICS",
          image: icsBase64,
          isTemplate: true,
          quality: finger.quality,
        });


        const wsq = await getWSQimageFromSUD( sud, errorHandler );
        const wsqBase64 = wsq.toString('base64');
        const settings = Configuration.settings();
        let thumbnailSize = settings.thumbnailSize || 400;
            thumbnailSize = parseInt(thumbnailSize);
        console.log("thumbnailSize",thumbnailSize);

        const updatedFinger = {...finger};
        updatedFinger.image = wsqBase64; //sudBase64; // wsqBase64;
        updatedFinger.encoding = "WSQ";

        // generate the thumbnail
        const thumb = await Jimp.read( Buffer.from(finger.image, "base64") );
        // const thumb = await Jimp.read( Buffer.from(finger.image, "base64") );
        const thumbnail = thumb.resize( thumbnailSize , Jimp.AUTO);
        const thumbnailB64 = await thumbnail.getBase64Async(Jimp.AUTO);
        const thumbSplit = thumbnailB64.split(',');
        console.log("thumbnail::thumbSplit", thumbSplit);

        const thumbnailSud = await getSUDFile( thumbSplit[1], errorHandler );
        console.log("thumbnailSud",thumbnailSud);
        const thumbnailWsq = await getWSQimageFromSUD( thumbnailSud, errorHandler );
        console.log("thumbnailWsq",thumbnailWsq);
        const thumbnailWsqBase64 = thumbnailWsq.toString('base64');
        console.log("thumbnailWsqBase64.length",thumbnailWsqBase64.length);

        updatedFinger.thumbNail = thumbnailWsqBase64;

        updated.push( updatedFinger );


        // // generate template for all the biometrics as well.
        // const ics = await getICStemplateFromSUD( sud );
        // const icsBase64 = ics.toString('base64');

        // updated.push({
        //   type: finger.type,
        //   impression: finger.impression,
        //   position: finger.position,
        //   encoding: "ICS",
        //   image: icsBase64,
        //   isTemplate: true,
        //   quality: finger.quality,
        //   hello: "world",
        // });


        timer++;
      }

      // in case of mugshot, we just need to generate thumbnail of mugshot
      else if ( finger.type === "Mugshot" ) {

        const thumb = await Jimp.read( Buffer.from(finger.image, "base64") );
        // const thumb = await Jimp.read( Buffer.from(finger.image, "base64") );
        const thumbnail = thumb.resize( 400 , Jimp.AUTO);
        const thumbnailB64 = await thumbnail.getBase64Async(Jimp.AUTO);
        const thumbSplit = thumbnailB64.split(',');
        console.log("thumbnail::mugshot::thumbSplit", thumbSplit);

        const updatedFinger = {...finger};
        updatedFinger.thumbNail = thumbSplit[1];

        updated.push( updatedFinger );
        timer++;
      }

      else {
        updated.push( finger );
        timer++;
      }

      if ( bio.length === timer ) {
        console.log("done, returning updated", updated);
        resolve(updated);

        return updated;
      }

    });


  });


}



// this will be used when url === "/action/create" and actionType === "Register Latent"
function registerLatentUpdates( params ) {

  if ( params.length === 0 ) {
    return params;
  }

  const parameters = [...params];

  console.log("::registerLatentUpdates::", parameters);
  return new Promise( async (resolve, reject) => {

      const bioImage = parameters && Array.isArray(parameters) && parameters.find( item => item.key === "FingerImage" );
      console.log("bioImage",bioImage);
      const updated = [];
      let count = 0;
      parameters.forEach( async (item) => {
        if ( item.key === "FingerImage" ) {
          const sud = await getSUDFile( item.value, errorHandler );
          const wsq = await getWSQimageFromSUD( sud, errorHandler );
          const wsqBase64 = wsq.toString('base64');
          updated.push({
            key: "FingerImage",
            value: wsqBase64,
          });
          count++;
        }
        else if ( item.key === "LatentTemplate" ) {
          const sud = await getSUDFile( bioImage.value );
          const ics = await getICStemplateFromSUD( sud );
          const icsBase64 = ics.toString('base64');
          updated.push({
            key: "LatentTemplate",
            value: icsBase64,
          });
          count++;
        }
        else if ( item.key === "ImageFormat" ) {
          updated.push({
            key: "ImageFormat",
            value: "WSQ",
          });
          count++;
        }

        else {
          updated.push(item);
          count++;
        }

        console.log("count,params.length", count, params.length);
        if ( count === params.length ) {
          console.log("done!!! updated",updated);
          resolve(updated);
          return updated;
        }

      });

  });
}




async function convertWSQtoPNG(data, path, errorHandler) {
  console.log("convertWSQtoPNG::data, path",data, path);

  return new Promise( async (resolve, reject) => {

    try {

      // let filtered = [];

      if ( path === "biometrics" ) {
        if ( ! data.biometrics ) { resolve(data); }
        if ( data.biometrics && data.biometrics.length === 0 ) { resolve( data ); }
        // filtered = data.biometrics.filter( item => item.encoding === "WSQ" );
      } else if ( path === "probe.biometrics" ) {
        if ( ! data.probe || ! data.probe.biometrics ) { resolve(data); }
        if ( data.probe && data.probe.biometrics && data.probe.biometrics.length === 0 ) { resolve( data ); }
        // filtered = data.probe.biometrics.filter( item => item.encoding === "WSQ" );
      }



      if ( path === "probe.biometrics" && data.fingerprintMatches && data.fingerprintMatches.length > 0 ) {

        data.fingerprintMatches.forEach( async (match) => {
          for ( const person of match.matchInfos ) {
            if ( person.image && supportedTypes.includes(person.fingerprintType) && (person.encoding === "WSQ" || person.encoding === "") ) {
              const wsq = person.image;
              const sud = await getSUDFile( wsq, errorHandler );

              const png = await getPNGimageFromSUD( sud, errorHandler );
              const pngBase64 = png.toString('base64');

              person.image = pngBase64;
              person.encoding = "PNG";
            }
          }
        });

      }


      if ( path === "probe.biometrics" && data.probe && data.probe.biometrics ) {
        for ( const finger of data.probe.biometrics ) {
          console.log("probe.biometrics::finger--------", finger);
          if ( finger.thumbNail && supportedTypes.includes(finger.type) && finger.encoding === "WSQ" ) {

            const wsq = finger.thumbNail;
            const sud = await getSUDFile( wsq, errorHandler );

            const png = await getPNGimageFromSUD( sud, errorHandler );
            const pngBase64 = png.toString('base64');

            finger.thumbNail = pngBase64;
            finger.encoding = "PNG";
          }
        }

        // convert matches from wsq to png as well
        if ( data.fingerprintMatches.length > 0 ) {
          for ( const user of data.fingerprintMatches ) {
            console.log("user.matchInfos",user.matchInfos);
            if ( user.matchInfos && user.matchInfos.length > 0 ) {

              for ( const finger of user.matchInfos ) {
                console.log("data.fingerprintMatches::finger--------", finger);
                if ( finger.thumbNail && finger.encoding === "WSQ" ) {
                  try {
                    const wsq = finger.thumbNail;
                    const sud = await getSUDFile( wsq, errorHandler );

                    const png = await getPNGimageFromSUD( sud, errorHandler );
                    const pngBase64 = png.toString('base64');

                    finger.thumbNail = pngBase64;
                    finger.encoding = "PNG";

                  } catch (e) {
                    console.log("data.fingerprintMatches::finger :: error occoured", e);
                  }

                  console.log("data.fingerprintMatches::finger:final",finger);
                }
                else if ( finger.image && finger.encoding === "WSQ" ) {
                  try {
                    const wsq = finger.image;
                    const sud = await getSUDFile( wsq, errorHandler );

                    const png = await getPNGimageFromSUD( sud, errorHandler );
                    const pngBase64 = png.toString('base64');

                    finger.image = pngBase64;
                    finger.encoding = "PNG";

                  } catch (e) {
                    console.log("data.fingerprintMatches::finger :: error occoured", e);
                  }

                  console.log("data.fingerprintMatches::finger:final",finger);
                }






              }

            }
          }
        }


      }
      else if ( path === "biometrics" && data && data.biometrics ) {
        for ( const finger of data.biometrics ) {
          console.log("biometrics::finger--------", finger);
          if ( finger.thumbNail && supportedTypes.includes(finger.type) && finger.encoding === "WSQ" ) {

            const wsq = finger.thumbNail;
            const sud = await getSUDFile( wsq, errorHandler );

            const png = await getPNGimageFromSUD( sud, errorHandler );
            const pngBase64 = png.toString('base64');

            finger.thumbNail = pngBase64;
            finger.encoding = "PNG";
          }
        }
      }

      else if ( path === "matchedBiometrics" ) {
        console.log("matchedBiometrics",data);
        if ( data.probe && data.probe.encoding === "WSQ" ) {
          const wsq = data.probe.image;
          const sud = await getSUDFile( wsq, errorHandler );

          const png = await getPNGimageFromSUD( sud, errorHandler );
          const pngBase64 = png.toString('base64');

          data.probe.image = pngBase64;
          data.probe.encoding = "PNG";
        }
        if ( data.matched && data.matched.encoding === "WSQ" ) {
          const wsq = data.matched.image;
          const sud = await getSUDFile( wsq, errorHandler );

          const png = await getPNGimageFromSUD( sud, errorHandler );
          const pngBase64 = png.toString('base64');

          data.matched.image = pngBase64;
          data.matched.encoding = "PNG";
        }
      }


      console.log("-----------------------------------------data",data);

      return resolve(data);

    }
    catch (e) {
      console.log("convertWSQtoPNG::error occoured", e);
      reject(e);
    }

  });


}




async function generatePNG( sud, errorHandler ) {
  const data = await getPNGimageFromSUD( sud, errorHandler );
  return data;
}



module.exports = {
  generateSUD: generateSUD,
  convertWSQtoPNG: convertWSQtoPNG,
  registerLatentUpdates: registerLatentUpdates,
  generatePNG: generatePNG,
};




/*

async function exportIsoTemplateFromUser(sud) {
  // initialize idkit module
  const lib = idkitLib.initModule();
  // create User from .sud file (Buffer)
  const user = await lib.deserializeUser(sud);
  // export template
  const isoTemplate = await user.exportUserTemplate(lib.templateFormat.FORMAT_ISO);
  // terminate module (release from memory)
  lib.sync.terminateModule();

  return isoTemplate;
}

(async () => {
  const sud = fs.readFileSync('./example.SUD');
  const image = await getWSQimageFromUser(sud);
  const template = await exportIsoTemplateFromUser(sud);
  fs.writeFileSync('image.wsq', image);
  fs.writeFileSync('isoTemplate.iso', template);
})();

*/
