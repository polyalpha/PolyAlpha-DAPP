import React, {Component, Fragment} from "react";
import { connect } from 'react-redux';
import {DivButton} from "./Button";
import {history} from "../../_helpers";
import {MainTitle} from "../App/MainTitle"
import {Link} from "react-router-dom"
import Form from 'react-validation/build/form';
import Textarea from 'react-validation/build/textarea';
import {Button} from './Button';
import ethereumUtil from 'ethereumjs-util';
import LocalData from '../../_services/LocalData';
import BlockConnector from '../../_services/BlockConnector';
import web3 from '../../_services/web3';

class Auth extends Component {

	constructor(props) {
		super(props);
		this.pp = ["Welcome to the next generation decentralised, private and scaleable instant messenger that pays you ABT tokens for your attention.", "When you sign up you will recieve a PolyAlpha messenger address pair on the Ethereum Testnet. If you already have an account, log in with your private key."];
		this.state = {privateKey: ""};
		this.loadContract();
	}

	loadContract = async () => {
		this.blockConnector = new BlockConnector(web3, []);
		await this.blockConnector.load();
		console.log('done load contract: ' + this.blockConnector.contract.options.address);
	}

	keyValidator = () => {
		if (!/^[\da-z]{64}$/.test(this.state.privateKey.toString().trim())) {
			return <div>Bad format secret key</div>;
		} else if (!ethereumUtil.isValidPrivate(Buffer.from(this.state.privateKey, 'hex'))) {
			return <div>Invalid private key</div>;
		}
	};

	signinHandler = (e) => {
		e.preventDefault();
		LocalData.setPrivateKey(this.state.privateKey);
		this.blockConnector.isRegistered();
		//history.push("/chat/discover")
	};

	render() {
		const signin = (
			<Button icon="svg-crown" className="button catamaran">
				I want my bids, log me in
			</Button>
		);

		return (
			<Fragment>
				<MainTitle>{this.props.route.title}</MainTitle>
				<div id="body-index">
					<div className="info catamaran">{this.pp.map((x, i)=><p key={i}>{x}</p>)}</div>
					<div className="buttons-block">
						<div className="signup row">
							<Link to="/auth/signup">
								<DivButton icon="svg-lightning"  className="button catamaran">
									I'm new, create an address pair for me
								</DivButton>
							</Link>
						</div>
						<Form className="signin row" method="POST" onSubmit={this.signinHandler}>
							{this.props.route.path === "/auth/signin" && (
								<Fragment>
									<Textarea
										autoFocus
										placeholder="Enter your private key"
										type="text"
										name="key"
										className="private-key catamaran"
										validations={[this.keyValidator]}
										value={this.privateKey}
										onChange={(e) => this.setState({privateKey: e.target.value})}
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
	}
};

function mapStateToProps(state) {
	const { auth } = state;
	return { auth };
}

const connectedAuth = connect(mapStateToProps)(Auth);
export { connectedAuth as Auth };
