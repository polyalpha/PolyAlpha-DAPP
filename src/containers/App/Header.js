import React from "react";
import { connect } from 'react-redux';
import {Svg} from "./Svg";
import {Link} from "react-router-dom"


const Header = (props) => {
	return (
		<div id="top">
			<Link to="/"><div id="logo" className="catamaran">PolyAlpha</div></Link>
			<div id="menu" className="catamaran">
				<a className="selected animate" href="#">Messenger POC</a>
				<a className="animate" href="#">The DAICO</a>
				<a className="animate" href="#">Give Feedback</a>
			</div>
			{props.auth.loggingIn && (
				<div id="user-bar">
					<span className="name catamaran animate">
						{props.auth.user.name} <Svg id="svg-select" className="icon" />
					</span>
					<a className="avatar" href="#"><img src={props.auth.user.avatar} /></a>
				</div>
			)}
		</div>
	)
};


function mapStateToProps(state) {
	const { auth, alert } = state;
	return { auth, alert };
}

const connectedHeader = connect(mapStateToProps)(Header);
export { connectedHeader as Header };
