import React from "react";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import LocalData from '../_services/LocalData';

export const withAuth = (WrapperComponent) => {
	const c = (props) => 
	{
		let component;
		let isLoggedIn = LocalData.isLoggedIn();
		if (props.match.path.indexOf('auth') !== -1) {
			if (isLoggedIn) {
				component = <Redirect to={{ pathname: '/chat/discover', state: { from: props.location } }} />;
			} else {
				component = <WrapperComponent {...props} />;
			}
		} else if (props.match.path.indexOf('chat') !== -1 || props.match.path.indexOf('settings') !== -1) {
			if (isLoggedIn) {
				component = <WrapperComponent {...props} />
			} else {
				component = <Redirect to={{ pathname: '/auth', state: { from: props.location } }} />;
			}
		} else {
			if (isLoggedIn) {
				component = <Redirect to={{ pathname: '/chat/discover', state: { from: props.location } }} />;	
			} else {
				component = <Redirect to={{ pathname: '/auth', state: { from: props.location } }} />;
			}
		}
		return component;
	}

	return connect(mapStateToProps)(c)
};



function mapStateToProps(state) {
	const { auth } = state;
	return {auth};
}
