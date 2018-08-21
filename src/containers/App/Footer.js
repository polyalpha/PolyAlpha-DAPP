import React, {Fragment} from "react";
import {connect} from 'react-redux';
import "./Footer.scss"


const Footer = ({device}) => (
	<Fragment>
		<div className="logo-bg-gradient">
			<div id="logo-bg"  />
			{device.isBrowser && <div id="gradient" />}
		</div>
		{device.isBrowser && (
			<div id="footer">
				<div className="text catamaran">If you experience any bugs or require help please send a message to “PolyAlpha.io Assistant”.</div>
			</div>
		)}
	</Fragment>
);

function mapStateToProps({device}) {
	return {device};
}


const connectedFooter = connect(mapStateToProps)(Footer);
export {connectedFooter as Footer}
