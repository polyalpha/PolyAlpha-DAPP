import React from "react";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

export const logout = () => {
	const c = (props) => 
	{
		localStorage.clear();
		setTimeout(() => {
			window.location.reload();
		}, 200);
		return(
			<Redirect to={{ pathname: '/auth', state: { from: props.location } }} />
		);
	}
	return connect(mapStateToProps)(c)
};

function mapStateToProps(state) {
	const { auth } = state;
	return {auth};
}
