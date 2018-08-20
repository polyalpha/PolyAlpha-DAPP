import React, {Fragment} from "react";
import {Browser} from "./Device";


export default () => (
	<Fragment>
		<div id="logo-bg" />
		<Browser>
			<div id="gradient" />
			<div id="footer">
				<div className="text catamaran">If you experience any bugs or require help please send a message to “PolyAlpha.io Assistant”.</div>
			</div>
		</Browser>

	</Fragment>
);

