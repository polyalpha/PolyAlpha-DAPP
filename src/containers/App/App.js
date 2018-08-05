import React, {Component, Fragment} from "react";
import {Router} from "react-router";
import {renderRoutes} from "react-router-config"
import {history} from "../../_helpers/history";
import { alertActions } from '../../_actions';
import { connect } from 'react-redux';
import "./App.scss"



class App extends Component {

	constructor(props) {
		super(props);
		history.listen(() => {
			this.props.alert.message && this.props.dispatch(alertActions.clear());
		});
	}

	render(){
		return (
			<Fragment>
				<Router history={history}>
					{renderRoutes(this.props.routes)}
				</Router>
			</Fragment>

		)
	}
}

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




function mapStateToProps(state) {
	const { alert, auth, registration } = state;
	return {
		alert,
		auth
	};
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App };

