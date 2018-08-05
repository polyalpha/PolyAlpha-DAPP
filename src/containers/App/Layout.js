import React, {Fragment} from "react";
import { connect } from 'react-redux';
import {Header} from "./Header"
import Footer from "./Footer"
import {SvgIcons} from "./Svg"
import {Alert} from "./Alert";

//
const Layout =  ({children}) => {
	return (
		<Fragment>
			<SvgIcons />
			<Alert />
			<Header />
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
	const { alert, routing } = state;
	return { alert, routing };
}

const connectedLayout = connect(mapStateToProps)(Layout);
export { connectedLayout as Layout };
