import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {Header} from "./Header"
import {Footer} from "./Footer"
import {SvgIcons} from "./Svg"
import {Alert} from "./Alert";



@connect(mapStateToProps)
export class Layout extends Component {

	render = () => (
		<Fragment>
			<SvgIcons />
			<Alert />
			<Header />
			{this.props.children}
			<Footer />
		</Fragment>
	)

}


function mapStateToProps({device}) {
	return {device};
}
