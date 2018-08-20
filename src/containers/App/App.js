import React, {Component, Fragment} from "react";
import {Router} from "react-router";
import {renderRoutes} from "react-router-config"
import {history} from "../../_helpers";
import {alertActions, userActions} from '../../_actions';
import { connect } from 'react-redux';
import "./App.scss"
import {compose} from "recompose"
import {withUpdateDevice} from "../../_components/device"
import classNames from "classnames"
import LocalData from '../../_services/LocalData';


class App extends Component {

	constructor(props) {
		super(props);
		history.listen(() => {
			this.props.alert.message && this.props.dispatch(alertActions.clear());
		});
		LocalData.setLoggedIn("taran2L", "Pavel Taran", "/i/avatars/adam.png");
		this.props.dispatch(userActions.loggedIn());
	}

	render(){
		const className = classNames({"is-mobile": this.props.device.isMobile, "is-browser": this.props.device.isBrowser});
		return (
			<div className={className}>
				<Router history={history}>
					{renderRoutes(this.props.routes)}
				</Router>
			</div>
		)
	}
}


export const MainBlock = ({route, children}) => (
	<div id="main">
		<div id="main-block">
			{route && renderRoutes(route.routes)}
			{children}
		</div>
	</div>

);

export const Context = React.createContext({
	app: null,
	title:"Default",
});


export const routesWithContext = (roots, app) => (
	roots.map( r => ({...r, component: withContext(r.component, app)}))
);


export const withContext = (WrapperComponent, app) => (
	(props) => <WrapperComponent {...props} Context={Context} app={app} />
);


function mapStateToProps({ alert, auth, device }) {
	return { alert, auth, device };
}

const wrappedApp = compose(withUpdateDevice, connect(mapStateToProps))(App);
export {wrappedApp as App}


