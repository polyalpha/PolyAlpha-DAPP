import React, {Component, Fragment} from "react";
import {Button} from "./Button";
import {SignupForm} from "./SignupForm"
import { connect } from 'react-redux';
import {MainTitle} from "../App/MainTitle"



class Signup extends Component {
	render() {
		return (
			<Fragment>
				<MainTitle>{this.props.route.title}</MainTitle>
				<div id="body-index">
					<div className="buttons-block">
						<div className="signup">
							<div className="block">
								<SignupForm handler />
							</div>
						</div>
					</div>
				</div>
			</Fragment>
		)
	}
}


function mapStateToProps(state) {
	const { auth } = state;
	return { auth };
}

const connectedSignup = connect(mapStateToProps)(Signup);
export { connectedSignup as Signup };


