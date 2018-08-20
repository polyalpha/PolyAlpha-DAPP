import React, {Component} from "react";
import {connect} from "react-redux";
import {deviceActions} from "../_actions";


export const MAX_MOBILE_WIDTH = 800;

export const isMobileWidth = () => window.innerWidth <= MAX_MOBILE_WIDTH;


export const withUpdateDevice = (WrapperComponent) => {

	class DeviceComponent extends Component {

		onResize = () => {
			const isMobile = isMobileWidth();
			if (this.props.device.isMobile !== isMobile) {
				this.props.dispatch(isMobile ? deviceActions.mobile() : deviceActions.browser())
			}
		};

		componentWillMount() {
			window.addEventListener("resize", this.onResize);
		}

		componentWillUnmount() {
			window.removeEventListener("resize", this.onResize)
		}

		render() {
			return <WrapperComponent {...this.props} />
		}
	}

	return connect(mapStateToProps)(DeviceComponent)

};



function mapStateToProps({device}) {
	return {device};
}
