import React, {Component} from "react";
import {renderRoutes} from "react-router-config";
import {Layout} from "./Layout";


export class Root extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const root=this;
		return (
			<Layout root={root}>
				{renderRoutes(this.props.route.routes)}
			</Layout>
		)
	}
}


