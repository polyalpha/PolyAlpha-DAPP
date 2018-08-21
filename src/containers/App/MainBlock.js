import React from "react";
import {renderRoutes} from "react-router-config";


export const MainBlock = ({route, children}) => (
	<div id="main">
		<div id="main-block">
			{route && renderRoutes(route.routes)}
			{children}
		</div>
	</div>
);
