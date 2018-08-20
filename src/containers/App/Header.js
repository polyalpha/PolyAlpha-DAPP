import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {Svg} from "./Svg";
import {Link} from "react-router-dom"
import "./Header.scss"
import $ from "jquery"
import {history} from "../../_helpers/history";
import LocalData from '../../_services/LocalData';
import {Browser, Mobile} from "./Device";



const Header = (props) => (
	<Fragment>
		{props.device.isBrowser && <HeaderBrowser {...props} /> || <HeaderMobile {...props} />}
	</Fragment>
);


class HeaderMain extends Component {

	state = {
		isOpenProfileMenu: false,
		isOpenMenu: false,
		left: 0,
	};

	constructor(props) {
		super(props);
		history.listen(() => {
			this.state.isOpenProfileMenu && this.setState({isOpenProfileMenu: false})
		});
	}

	toggleProfileMenu = () => {
		const isOpenProfileMenu = !this.state.isOpenProfileMenu;
		this.setState({isOpenProfileMenu});
	};

	toggleMenu = () => {
		const isOpenMenu = !this.state.isOpenMenu;
		this.setState({isOpenMenu});
	};

}


@connect(mapStateToProps)
class HeaderBrowser extends HeaderMain {

	onResize = () => {
		let left = $("#main-block").offset().left;
		if (left < 188) left = 188;
		this.setState({left})
	};

	componentDidMount() {
		this.onResize()
	}

	componentWillMount() {
		window.addEventListener("resize", this.onResize)
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.onResize)
	}

	render() {
		return (
			<Fragment>
				<Top>
					<Logo />
					<div className="menu">
						<Navigation style={{left: this.state.left}} />
						{this.props.auth.loggedIn && <UserBar onClick={this.toggleProfileMenu} />}
					</div>
				</Top>
				{this.state.isOpenProfileMenu && <SelectProfileMenu config={this.props.config} />}
			</Fragment>
		)
	}
}


@connect(mapStateToProps)
class HeaderMobile extends HeaderMain {

	render() {
		return (
			<Top>
				<Logo />
				<Svg id="svg-burger" className="menu-burger" onClick={this.toggleMenu} />
				{this.state.isOpenMenu && (
					<div className="menu">
						<Navigation>
							{this.props.auth.loggedIn && (
								<Fragment>
									<div className="navigation-item">
										<UserBar onClick={this.toggleProfileMenu} />
									</div>
									{this.state.isOpenProfileMenu && (
										<div className="navigation-item">
											<SelectProfileMenu config={this.props.config} />
										</div>
									)}
								</Fragment>
							)}
						</Navigation>
					</div>
				)}
			</Top>
		)
	}

}

// HeaderMobile = connect(mapStateToProps)(HeaderMobile);


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


const UserBar = connect(mapStateToProps)(
	({auth, onClick}) => (
		<div className="user-bar">
			<div className="name" onClick={onClick}>
				{auth.user.name} <Svg id="svg-select" className="icon" />
			</div>
			<Browser>
				<Link className="avatar" to="/settings"><img src={auth.user.avatar} /></Link>
			</Browser>
		</div>
	)
);


const Top = ({children}) => (
	<div id="top">
		{children}
	</div>
);

const Logo = () => (
	<Link to="/"><div id="logo">PolyAlpha</div></Link>
);




const Navigation = ({style, children}) => (
	<div className="navigation" style={style || {}}>
		<Link className="navigation-item navigation-item-selected" to="/">Messenger POC</Link>
		<Link className="navigation-item" to="/ico">The DAICO</Link>
		<Link className="navigation-item" to="/feedback">Give Feedback</Link>
		{children}
	</div>
);


function mapStateToProps({ auth, alert, config, device }) {
	return { auth, alert, config, device };
}

const connectedHeader = connect(mapStateToProps)(Header);
export { connectedHeader as Header };
