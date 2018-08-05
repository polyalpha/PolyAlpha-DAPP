import { connect } from 'react-redux';
import React from "react"
import {alertActions} from "../../_actions";


const Alert = ({alert, dispatch}) => {
	return <div onClick={
		() => dispatch(alertActions.clear())
	} id="alert" className={`alert ${alert.type && alert.type}`}>{alert.message && alert.message}</div>
};

const close = (e) => e.target.remove();

function mapStateToProps(state) {
	const { alert } = state;
	return { alert };
}

const connectedAlert = connect(mapStateToProps)(Alert);
export { connectedAlert as Alert };
