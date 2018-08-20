import { connect } from 'react-redux';
import React, {Fragment} from "react"
import {alertActions} from "../../_actions";
import classNames from "classnames"


const Alert = ({alert, dispatch}) => {
	const className = classNames(["alert", alert.type]);
	return (
		<Fragment>
			{alert.message && <div onClick={
				() => dispatch(alertActions.clear())
			} id="alert" className={className}>{alert.message}</div>}
		</Fragment>
	)
};

const close = (e) => e.target.remove();

function mapStateToProps(state) {
	const { alert } = state;
	return { alert };
}

const connectedAlert = connect(mapStateToProps)(Alert);
export { connectedAlert as Alert };
