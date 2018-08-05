import React, {Fragment, Component} from "react";
import {history} from "../../_helpers/history";
import { connect } from 'react-redux';
import { alertActions, userActions } from '../../_actions';


class Home extends Component {
	render() {
		console.log("Home", this)
		return (
			<Fragment>

				<div>
					<button onClick={
						() => history.push("/auth/signup")
					}>go</button>
					<button onClick={
						() => this.props.dispatch(alertActions.success("OK!"))
					}>alert</button>
					<button onClick={
						() => this.props.dispatch(userActions.login("user", "password"))
					}>login</button>
				</div>

			</Fragment>
		)
	}
}


function mapStateToProps(state) {
	return {auth: state.auth};
}

const connectedHome = connect(mapStateToProps)(Home);
export { connectedHome as Home };



