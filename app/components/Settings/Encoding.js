import React from 'react';

const Encoding = (props) => {

  const { formatMessage, nfiq } = props;

  let imageFormat = 'Unspecified';
  let templateFormat = 'Unspecified';

  if ( Array.isArray(nfiq) ) {
    const imageFormatObj = nfiq.find( data => data.setting === "Biometrics.Format.DefaultImageEncoding" );
    if ( imageFormatObj && imageFormatObj.value ) { imageFormat = imageFormatObj.value; }
    const templateFormatObj = nfiq.find( data => data.setting === "Biometrics.Format.DefaultTemplateType" );
    if ( templateFormatObj && templateFormatObj.value ) { templateFormat = templateFormatObj.value; }
  }



  return (
    <div>
      <h1>{ formatMessage({ id: "SettingsPageEncoding" }) }</h1>

      <div className="input-wrapper">
        <label>{ formatMessage({ id: "SelectedImageFormat" }) }</label>
        <input disabled value={ imageFormat } className="input" />
      </div>

      <div className="input-wrapper">
        <label>{ formatMessage({ id: "SelectedTemplateFormat" }) }</label>
        <input disabled value={ templateFormat } className="input" />
      </div>

    </div>
  )

}


export default Encoding;
