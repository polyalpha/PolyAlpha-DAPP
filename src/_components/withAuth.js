import React from "react";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


export const withAuth = (WrapperComponent) => {
	const c = (props) => props.auth.isAuth
		? (
			<WrapperComponent {...props} />
		) : (
			<Redirect to={{ pathname: '/auth', state: { from: props.location } }} />
		);

	return connect(mapStateToProps)(c)
};



function mapStateToProps(state) {
	const { auth } = state;
	return {auth};
}
