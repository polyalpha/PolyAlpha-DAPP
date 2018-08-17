import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {Svg} from "./Svg";
import {Link} from "react-router-dom"
import "./Header.scss"
import $ from "jquery"
import ReactDOM from 'react-dom';
import {history} from "../../_helpers/history";
import {alertActions} from "../../_actions";
import LocalData from '../../_services/LocalData';


const SelectProfileMenu = ({config}) => (
	<div className="user-bar-select">
		<div className="user-bar-select-bg" />
		<div className="user-bar-select-menu">
			<Link to="/settings" className="user-bar-select-menu-li">{`Eth balance: ${LocalData.getBalance()} ETH`}</Link>
			{/* <Link to="/settings/network" className="user-bar-select-menu-li">Change network</Link> */}
			{/* <Link to="/settings/public" className="user-bar-select-menu-li">View Public address</Link> */}
			{/* <Link to="/settings/gas" className="user-bar-select-menu-li">Set gas limit</Link> */}
			<Link to="/auth/logout" className="user-bar-select-menu-li">Log out</Link>
		</div>
	</div>
)


class UserBar extends Component {

	render() {

		return (
			<Fragment>
				<div id="user-bar">
					<div className="name catamaran animate" onClick={this.props.onClick}>
						{this.props.user.name} <Svg id="svg-select" className="icon" />
					</div>
					<Link className="avatar" to="/settings"><img src={this.props.user.avatar} /></Link>
				</div>

			</Fragment>
		)
	}
};


class Header extends Component {

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

	toggleMenu = () => {
		this.setState({isOpenMenu: !this.state.isOpenMenu})
	};

	render(){
		const root = this;
		return (
			<Fragment>
				<div id="top">
					<Link to="/"><div id="logo" className="catamaran">PolyAlpha</div></Link>
					<div id="menu" className="catamaran">
						<a className="selected animate" href="/">Messenger POC</a>
						<a className="animate" href="#">The DAICO</a>
						<a className="animate" href="#">Give Feedback</a>
					</div>
					{this.props.auth.loggedIn && <UserBar root={root} user={this.props.auth.user} onClick={this.toggleMenu}/>}
				</div>
				{this.state.isOpenMenu && <SelectProfileMenu config={this.props.config} />}
			</Fragment>
		)
	}
}


function mapStateToProps({ auth, alert, config }) {
	console.log({ auth, alert, config })
	return { auth, alert, config };
}

const connectedHeader = connect(mapStateToProps)(Header);
export { connectedHeader as Header };
