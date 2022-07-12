import React from 'react';
import { withRouter } from "react-router-dom";
import { storeLog } from '../../utils/logs';

import AppNavbar from "../../components/Navbar/AppNavbar/AppNavbar";
import Footer from "../../components/Footer/Footer";


class ErrorHandler extends React.Component {


	constructor() {
		super();
		this.state = {
			error: null,
			info: null,
		};
		this.goToHomePage = this.goToHomePage.bind(this);
	}

	componentDidCatch( error, info ) {
		// console.log("error", error);
		// console.log("info", info);
		this.setState({ error: error, info: info });
		storeLog({
			date: new Date,
			error: error.toString(),
			stack: JSON.stringify(info),
		}, true);
	}

	componentDidMount() {
		// console.log("ErrorHandler componentDidMount", this.props);
	}

	goToHomePage() {
		this.props.history.push('/');
	}


	render() {

		if ( this.state.error ) {

			const styles = {
				backgroundColor: '#ffd6d7',
				padding: '40px 100px',
				width: '90%',
				margin: '0 auto',
				marginTop: '40px',
				borderRadius: '10px',

			}

			return (
				<div id="Authenticated">

					<AppNavbar {...this.props} />


					<div style={ styles }>
						<div>
							<h2 style={{ fontSize: 20, marginBottom: 20 }}>Error Occoured:</h2>
							<pre style={{ border: '2px solid #999' }}><code>{ this.state.error.toString() }</code></pre>
							<pre style={{ border: '2px solid #999', marginTop: 25 }}><code>{ JSON.stringify( this.state.info, null, 4 ) }</code></pre>
						</div>
					</div>

			      <Footer {...this.props} />

				</div>
			)
		}

		return this.props.children;

	}


}

export default withRouter(ErrorHandler);
