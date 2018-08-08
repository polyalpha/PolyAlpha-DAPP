import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {Svg} from "./Svg";
import {Link} from "react-router-dom"
import "./Header.scss"
import $ from "jquery"
import ReactDOM from 'react-dom';
import {history} from "../../_helpers/history";
import {alertActions} from "../../_actions";


const SelectProfileMenu = (props) => (
	<div className="user-bar-select">
		<div className="user-bar-select-bg" />
		<div className="user-bar-select-menu">
			<Link to="/profile/balance" className="user-bar-select-menu-li">Eth balance: 150.5 ETH</Link>
			<Link to="/profile/network" className="user-bar-select-menu-li">Change network</Link>
			<Link to="/profile/public" className="user-bar-select-menu-li">View Public address</Link>
			<Link to="/profile/gas" className="user-bar-select-menu-li">Set gas limit</Link>
			<Link to="/auth/logout" className="user-bar-select-menu-li">Log out</Link>
		</div>
	</div>
)


class UserBar extends Component {

	state = {
		isOpenMenu: false
	};

	constructor(props) {
		super(props);
		this.toggleMenu = this.toggleMenu.bind(this);
		history.listen(() => {
			this.state.isOpenMenu && this.setState({isOpenMenu: false})
		});
	}

	toggleMenu() {
		this.setState({isOpenMenu: !this.state.isOpenMenu})
	}

	render() {

		return (
			<Fragment>
				<div id="user-bar">
					<div className="name catamaran animate" onClick={this.toggleMenu}>
						{this.props.user.name} <Svg id="svg-select" className="icon" />
					</div>
					<Link className="avatar" to="/profile"><img src={this.props.user.avatar} /></Link>
				</div>
				{this.state.isOpenMenu && <SelectProfileMenu />}
			</Fragment>
		)
	}
};


const Header = ({auth, root}) => {
	console.log({root})
	return (
		<div id="top">
			<Link to="/"><div id="logo" className="catamaran">PolyAlpha</div></Link>
			<div id="menu" className="catamaran">
				<a className="selected animate" href="#">Messenger POC</a>
				<a className="animate" href="#">The DAICO</a>
				<a className="animate" href="#">Give Feedback</a>
			</div>
			{auth.loggedIn && <UserBar root={root} user={auth.user} />}
		</div>
	)
};


function mapStateToProps(state) {
	const { auth, alert } = state;
	return { auth, alert };
}

const connectedHeader = connect(mapStateToProps)(Header);
export { connectedHeader as Header };
