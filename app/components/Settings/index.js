import React from 'react';

import QualityThreshold from './QualityThreshold';
import Encoding from './Encoding';
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import "./index.scss";

import { nfiqQualityThresholdSelector } from '../../selectors/app';
import { requestNFIQQualityThreshold } from '../../actions/app';

export class Settings extends React.Component {

	constructor() {
		super();
		this.state = {
			active: 'qualityThreshold',
		};
		this.handleNavClick = this.handleNavClick.bind(this);
	}


	handleNavClick(event, id) {
		this.setState({ active: id });
	}

	componentDidMount() {
		// fetch the quality threshold
		this.props.requestNFIQQualityThreshold();
	}


	render() {

		// console.log("this.props",this.props);

		const { formatMessage } = this.props.intl;

		const sidebar = [
			{ id: 'qualityThreshold', title: formatMessage({ id: "QualityThreshold" }) },
      // { id: 'encoding', title: formatMessage({ id: "SettingsPageEncoding" }) },
		];

		return (
			<div id="tenprint">
			<div style={{ position: 'relative', flexGrow: 1 }}>
			<div className="component--settings VerifierWorkflow-Wrapper tenprintverify-main">

				<div className="left">
					<nav>
						{ sidebar.map( (item, index) => {
							return (
								<div
									key={ item.id }
									// className="tab"
									onClick={ (e) => { this.handleNavClick(e, item.id) } }
									className={`tab ${ this.state.active === item.id ? 'active' : '' }`}
								>{ item.title }</div>
							)
						} ) }
					</nav>
				</div>


				<div className={`VerifierWorkflowWrapper-main component--settings-content ${ this.props.locale.dir || 'ltr' }`}>
					{ this.state.active === "qualityThreshold" && <QualityThreshold formatMessage={formatMessage} nfiq={ this.props.nfiq_quality_threshold } /> }
          { this.state.active === "encoding" && <Encoding formatMessage={formatMessage} nfiq={ this.props.nfiq_quality_threshold } /> }
				</div>

			</div>
			</div>
			</div>
		)

	}


}

// export default Settings;
const mapState = state => ({
	locale: state.locale,
	nfiq_quality_threshold: nfiqQualityThresholdSelector(state),
});
export default connect(mapState, { requestNFIQQualityThreshold })( injectIntl(Settings) );

