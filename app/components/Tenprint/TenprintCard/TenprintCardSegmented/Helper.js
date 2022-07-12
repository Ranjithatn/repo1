

function repositionBiometrics(biometrics) {
  const output = [];
  biometrics.forEach( item => {
    if ( item.name.indexOf('THUMB') != -1 ) { output[0] = item; }
    else if ( item.name.indexOf('INDEX') != -1 ) { output[1] = item; }
    else if ( item.name.indexOf('MIDDLE') != -1 ) { output[2] = item; }
    else if ( item.name.indexOf('RING') != -1 ) { output[3] = item; }
    else if ( item.name.indexOf('LITTLE') != -1 ) { output[4] = item; }
  });

  return output;
}


// function sortAndRepositionBiometrics(biometrics) {
//   const left = biometrics.filter(item => { return item.name.indexOf('L.') != -1; });
//   const right = biometrics.filter(item => { return item.name.indexOf('R.') != -1; });

//   const leftRepos = repositionBiometrics(left);
//   console.log("leftRepos",leftRepos);

//   // output = [...left,...right];
//   return [...left,...right];
// }


export default {
  repositionBiometrics
}
