import React from 'react';

const QualityThreshold = (props) => {

	const { formatMessage, nfiq } = props;

	let nfiqSlap = 0;
	let nfiqFlat = 0;
	if ( Array.isArray(nfiq) ) {
		nfiqSlap = nfiq.find( data => data.setting === "ImageQuality.SlapQualityThreshold.NFIQ" ).value;
		nfiqFlat = nfiq.find( data => data.setting === "ImageQuality.FingerQualityThreshold.NFIQ" ).value;
  }


	return (
		<div>
			<h1>{ formatMessage({ id: "NFIQQualityThreshold" }) }</h1>

			<div className="input-wrapper">
				<label>{ formatMessage({ id: "NFIQQualityThresholdSlap" }) }</label>
				<input disabled value={ nfiqSlap } className="input" />
			</div>

			<div className="input-wrapper">
				<label>{ formatMessage({ id: "NFIQQualityThresholdFlat" }) }</label>
				<input disabled value={ nfiqFlat } className="input" />
			</div>

		</div>
	)

}


export default QualityThreshold;
