

export function toDataURL(url) {
  return fetch(url)
    .then(response => response.blob())
    .then(
      blob =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );
}

export function parseFingerprintsData(data) {
  let returned = [];
  data.PersonData.FingerprintBiometrics.FingerprintBiometric.forEach(
    parentPrint => {
      if (parentPrint.Children && parentPrint.Children.Child) {
        if (parentPrint.Children.Child.length > 1) {
          let fpData = extractFpData(parentPrint);
          returned.push(fpData);
        }
        parentPrint.Children.Child.forEach(childPrint => {
          let fpData = extractFpData(childPrint);
          returned.push(fpData);
        });
      }
    }
  );
  return returned;
}

export function makePalmsData(data) {
  try {
    return data.map(palm => {
      if (palm.Position.toLowerCase().includes("upper") && palm.Children.Child.length) {
        const originalPosition = palm.Position;
        let interdigital = palm.Children.Child.filter(child => child.Position.toLowerCase().includes("interdigital"))[0];
        interdigital.Position = originalPosition;
        interdigital.Annotation = palm.Annotation;
        interdigital.Image.Quality = palm.Image.Quality;
        return interdigital;
      } else {
        return palm;
      }
    })
  } catch(e) {
    console.error("----- palm prints failed:", e);
  }
}

function extractFpData(fpData) {
  return {
    image: fpData.Image,
    position: fpData.Position,
    annotation: fpData.Annotation,
    impression: fpData.Impression
  }
}