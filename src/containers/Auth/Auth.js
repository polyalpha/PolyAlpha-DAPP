import React, {Component, Fragment} from "react";
import { connect } from 'react-redux';
import {DivButton} from "./Button";
import {history} from "../../_helpers";
import {MainTitle} from "../App/MainTitle"
import {Link} from "react-router-dom"
import Form from 'react-validation/build/form';
import Textarea from 'react-validation/build/textarea';
import {Button} from './Button';


const Auth = (props) => {

	let pp = ["Welcome to the next generation decentralised, private and scaleable instant messenger that pays you ABT tokens for your attention.", "When you sign up you will recieve a PolyAlpha messenger address pair on the Ethereum Testnet. If you already have an account, log in with your private key."];

	const signin = (
		<Button icon="svg-crown" className="button catamaran">
			I want my bids, log me in
		</Button>
	);

	return (
		<Fragment>
			<MainTitle>{props.route.title}</MainTitle>
			<div id="body-index">
				<div className="info catamaran">{pp.map((x, i)=><p key={i}>{x}</p>)}</div>
				<div className="buttons-block">
					<div className="signup row">
						<Link to="/auth/signup">
							<DivButton icon="svg-lightning"  className="button catamaran">
								I'm new, create an address pair for me
							</DivButton>
						</Link>
					</div>
					<Form className="signin row" method="POST" onSubmit={signinHandler}>
						{props.route.path === "/auth/signin" && (
							<Fragment>
								<Textarea
									autoFocus
									placeholder="Enter your private key"
									type="text"
									name="key"
									className="private-key catamaran"
									validations={[keyValidator]}
									value="9792f5415b9848c500548328bfef34e0ca6f3604e67eaf33f3295f0465221ee7"
									rows={1}
								/>
								{signin}
							</Fragment>

						) || (
							<Fragment>
								<Link to="/auth/signin">{signin}</Link>
							</Fragment>
						)}

					</Form>
				</div>
			</div>
		</Fragment>
	)
};


const signinHandler = (e) => {
	window.WWW = e;
	e.preventDefault();
	history.push("/chat/discover")

};


const keyValidator = (value) => {
	if (!/^[\da-z]{64}$/.test(value.toString().trim())) {
		return <div>Bad format secret key</div>;
	}
};


function mapStateToProps(state) {
	const { auth } = state;
	return { auth };
}

const connectedAuth = connect(mapStateToProps)(Auth);
export { connectedAuth as Auth };
