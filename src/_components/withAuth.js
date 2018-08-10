import React from "react";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

export const withAuth = (WrapperComponent) => {
	const c = (props) => 
	{
		return props.auth.loggedIn
		? (
			// <WrapperComponent {...props} />
			<Redirect to={{ pathname: '/chat/discover', state: { from: props.location } }} />
		) : (
			<Redirect to={{ pathname: '/auth', state: { from: props.location } }} />
		);
	}

	return connect(mapStateToProps)(c)
};



function mapStateToProps(state) {
	const { auth } = state;
	return {auth};
}
