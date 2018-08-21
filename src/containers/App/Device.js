import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';



const Mobile = ({children, device}) => (
	<Fragment>
		{device.isMobile && children}
	</Fragment>
);


const Browser = ({children, device}) => (
	<Fragment>
		{device.isBrowser && children}
	</Fragment>
);


function mapStateToProps({ device }) {
	return { device };
}

const connectedMobile = connect(mapStateToProps)(Mobile);
export { connectedMobile as Mobile };


const connectedBrowser = connect(mapStateToProps)(Browser);
export { connectedBrowser as Browser };
