import React, {Fragment} from "react";
import { connect } from 'react-redux';
import {Header} from "./Header"
import Footer from "./Footer"
import {SvgIcons} from "./Svg"
import {Alert} from "./Alert";
import {MainTitle} from "./MainTitle"

//
const Layout =  ({children, root}) => {
	return (
		<Fragment>
			<SvgIcons />
			<Alert />
			<Header root={root}/>
			{children}
			<Footer />
		</Fragment>
	)
};


function mapStateToProps({ alert, routing, auth }) {
	return { alert, routing, auth };
}

const connectedLayout = connect(mapStateToProps)(Layout);
export { connectedLayout as Layout };
