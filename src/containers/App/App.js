import React, {Component} from "react";
import {Router} from "react-router";
import {renderRoutes} from "react-router-config"
import {history} from "../../_helpers";
import {alertActions} from '../../_actions';
import { connect } from 'react-redux';
import "./App.scss"
import {withUpdateDevice} from "../../_components/device"
import classNames from "classnames";



@withUpdateDevice
@connect(mapStateToProps)
export class App extends Component {

	componentWillMount() {
		this.historyUnlisten = history.listen(() => {
			this.props.alert.message && this.props.dispatch(alertActions.clear());
		});
	}

	componentWillUnmount() {
		this.historyUnlisten()
	}

	componentDidMount() {
		this.setClassNames(this.props)
	}

	componentWillReceiveProps(props) {
		this.setClassNames(props)
	}

	setClassNames = ({device}) => {
		const className = classNames("layout-block", {"is-mobile": device.isMobile, "is-browser": device.isBrowser});
		console.log("setClassNames", {className});
		document.getElementsByTagName("body")[0].setAttribute("class", className)
	};

	render(){
		return (
			<Router history={history}>
				{renderRoutes(this.props.routes)}
			</Router>
		)
	}
}


function mapStateToProps({alert, auth}) {
	return {alert, auth};
}


