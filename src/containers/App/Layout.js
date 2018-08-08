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
			<div id="main">
				<div id="main-block">
					{children}
				</div>
			</div>
			<Footer />
		</Fragment>
	)
};


function mapStateToProps(state) {
	const { alert, routing, auth } = state;
	return { alert, routing, auth };
}

const connectedLayout = connect(mapStateToProps)(Layout);
export { connectedLayout as Layout };
