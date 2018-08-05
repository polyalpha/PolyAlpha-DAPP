import React, {Component} from "react";
import {renderRoutes} from "react-router-config";
import {Layout} from "./Layout";


export class Root extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Layout>
				{renderRoutes(this.props.route.routes)}
			</Layout>
		)
	}
}


