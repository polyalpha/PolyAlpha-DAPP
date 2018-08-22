import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {MainTitle} from "../App/MainTitle"
import {Svg} from "../App/Svg"
import {Link} from "react-router-dom"
import Form from 'react-validation/build/form';
import Textarea from 'react-validation/build/textarea';
import "./Chat.scss"
import classNames from "classnames"
import {renderRoutes} from "react-router-config";
import {KEY, MsgStatus} from '../../_constants/Static';
import Utils from '../../_helpers/Utils';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import Config from '../../_configs/Config';
import {Browser, Mobile} from "..";
import LocalData from '../../_services/LocalData';
import Static from '../../_services/Static';
import {ImgBg} from ".."
import $ from "jquery"


export const MessageContext = React.createContext("");


export class MessagesBlock extends Component {

	state = {
		message: "",
		isLoading: false,
		isInputDisabled: false,
	};

	constructor(props) {
		super(props);
		this.scrollToBottom = this.scrollToBottom.bind(this);
		const parent = this;
		this.children = React.Children.map(this.props.children, child => {
			return React.cloneElement(child, {parent});
		})
	}


	onMessageChanged = (e) => {
		let message = e.target.value.trim();
		if (this.props.onMessageChanged) {
			this.props.onMessageChanged(message);
		}
		this.setState({message});
	};

	onMessageSent = () => {
		if (this.state.message.length > 0) {
			if (this.props.onMessageSent) {
				this.props.onMessageSent(this.state.message);
				this.clearMessageInput();
			}
		}
	};

	scrollToBottom() {
		Utils.scrollToBottom(this.messagesContainer, 300);
	}

	clearMessageInput = () => {
		this.setState({message: ""});
	};

	setSendLoading = (isLoading) => {
		this.setState({isLoading})
	};

	setInputDisabled = (isDisabled) => {
		this.setState({isInputDisabled: isDisabled});
	};

	render() {

		let i = 0;
		let chatButton = (<Svg id="svg-share" className="button" onClick={this.onMessageSent} />);
		if (this.state.isLoading) {
			chatButton = (<FontAwesomeIcon icon={faSpinner} spin/>);
		}

		return (
			<div className="messages-block">
				<div className="messages" ref={messagesContainer => this.messagesContainer = messagesContainer }>
					<MessageContext.Provider value={this.state.message}>
						{this.props.messages.map(
							msg => React.cloneElement(msg, {key:i++})
						)}
					</MessageContext.Provider>
				</div>
				<Form className="form">
					<div className="block" disabled={this.state.isInputDisabled}>
						<div className="textarea">
					<Textarea
						readOnly={this.state.isInputDisabled}
						placeholder="Type a message..."
						name="message"
						value={this.state.message}
						onChange={this.onMessageChanged}
					/>
						</div>
						<div className="buttons">
							{/* <Svg id="svg-mic" className="button" /> */}

							{chatButton}
							{/* <Svg id="svg-smile" className="button" /> */}
						</div>
					</div>
				</Form>
			</div>
		)
	}
}

export const UserList = ({userId, name, tab, users}) => (
	<div className="users">
		<div className="scroll">
			{users.map(user => {
				let link = `/chat/${name}/${tab}/${user[KEY.USER_ADDRESS]}`;
				if (!tab) {
					link = `/chat/${name}/${user[KEY.USER_ADDRESS]}`
				}

				let numBids = Utils.parseIntSafe(user[KEY.USER_NUM_BIDS]);
				let info = (<div></div>)
				if (user[KEY.BID_AMOUNT] && name === 'bids') {
					info = (<div className="users-bid-abt">
						<div className="users-bid-abt-abt">{Utils.parseIntSafe(user[KEY.BID_AMOUNT]) / Config.TOKEN_DECIMAL} {Config.TOKEN_SYMBOL}</div>
					</div>);
				} else if (user[KEY.USER_BIDS_AMOUNT] && name === 'discover' && tab === 'top') {
					info = (<div className="users-bid-abt">
						<div className="users-bid-abt-bid">{numBids} {numBids == 1 ? 'bid' : 'bids'}</div>
						<div className="users-bid-abt-abt">{Utils.parseIntSafe(user[KEY.USER_BIDS_AMOUNT]) / Config.TOKEN_DECIMAL} {Config.TOKEN_SYMBOL}</div>
					</div>);
				}
				return (
				<Link className={classNames(["user", {selected: String(user[KEY.USER_ADDRESS]) === userId}])} key={user[KEY.USER_ADDRESS]} to={link}>
					<ImgBg src={user[KEY.USER_AVARTAR_URL]} className="avatar" />
					<div className="name">{user[KEY.USER_UNAME]}</div>
					{info}
				</Link>
			)
			}
		)}
		</div>
	</div>
);


const sideBarTabs = [
	{
		name: "bids",
		title: "Bids",
	},
	{
		name: "discover",
		title: "Discover",
	},
	{
		name: "chats",
		title: "Chats",
	}
];


export const SideBar = ({name, children}) => (
	<div className="side-bar">
		{children}
		<div className="menu">
			{sideBarTabs.map(
 				tab => <Link
					className={classNames(["tab", {active: name === tab.name}])}
					key={tab.name}
					to={`/chat/${tab.name}`}
				>{tab.title}</Link>
			)}
		</div>
	</div>
);


class TopBar extends Component {

	state = {
		isOpenMore: false
	};

	constructor(props){
		super(props);
		// history.listen(() => {
		// 	this.setState({isOpenMore: false})
		// });
	}

	toggleMore = () => {
		this.setState({isOpenMore: !this.state.isOpenMore})
	};

	render(){
		const title = this.props.title || this.props.user && getChatTitle(this.props.user),
		      address = this.props.user && this.props.user[Static.KEY.USER_ADDRESS];
		return (
			<div className="top-bar">
				{this.props.back && <Link to={this.props.back} className="back"><Svg id="svg-back" className="icon"/>Back</Link>}
				<div className="title">{title}</div>
				{address && this.props.more && (
					<div className="more">
						{/* <div className="more-label" onClick={this.toggleMore}>More</div>
						{this.state.isOpenMore && (
							<div className="more-select">
								<Link className="more-select-item" to={`/users/${address}/block`}>Block user</Link>
								<Link className="more-select-item" to={`/users/${address}/sendtoken`}>Send {Config.TOKEN_SYMBOL}</Link>
							</div>
						)} */}
					</div>
				)}
			</div>
		);
	}
}


export const MainBar = ({children}) => (
	<div className="main">
		<TopBar title="Info" back="/chat" more={true} />
		{children}
	</div>
);



export const AbtValue = ({value, isEarned, className}) => (
	<div className={classNames(["abt-value", className])}>
		<div className="abt-value-block">
			<div className="abt-value-block-middle">
				{isEarned && <div className="abt-value-is-earned">Earned</div>}
				<div className="abt-value-numbers">{value}</div>
				<div className="abt-value-label">{Config.TOKEN_SYMBOL}</div>
			</div>
		</div>
	</div>
);

const ChatSideBarLayout = (props) => {
	let {tabs, tab, name} =  props;
	return (
		<SideBar name={name} >
			<div className="top-bar">
				<div className="tabs">
					{tabs.map(
						t => {
							return !t.name && t || <Link
								className={classNames(["tab", {selected: t.name === tab }])}
								key={t.name}
								to={`/chat/${name}/${t.name}`}
							>{t.title}</Link>
						}
					)}
				</div>
			</div>
			<UserList {...props} />
		</SideBar>
	)
};

const ChatMainLayout = ({children, back, title, more, user}) => (
	<div className="main">
		<TopBar title={title} back={back} more={more} user={user}/>
		{children}
	</div>
);


const getChatTitle = (user) => {
	if (user) {
		let name = user[Static.KEY.USER_NAME],
				uname = user[Static.KEY.USER_UNAME],
				avatar = user[Static.KEY.USER_AVARTAR_URL];
		name = name && name.trim();
		uname = uname && uname.trim();
		return (
			<Fragment>
				{avatar && <ImgBg src={avatar} className="title-avatar icon"/>}
				{name || uname}
			</Fragment>
		)
	}
};


export const ChatLayout = ({children, match, sidebar, back, more}) => {
	const user = match.params.id && LocalData.getUser(match.params.id),
		    bar = <ChatSideBarLayout {...sidebar} />,
			  main = <ChatMainLayout children={children} back={back} more={more} user={user} />;
	return (
		<Fragment>
			<Browser>
				{bar}
				{children && main}
			</Browser>
			<Mobile>
				{children && main || bar}
			</Mobile>
		</Fragment>
	)
};



class Chat extends Component {

	onResize = (e) => {
		const y = window.innerHeight - 73;
		console.log({y})

	};

	componentWillMount() {
		window.addEventListener("resize", this.onResize)
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.onResize)
	}

	render() {
		return (
			<Fragment>
				<Browser>
					<MainTitle>{this.props.title || `Hello ${this.props.auth.user.name}`}</MainTitle>
				</Browser>
				<div id="body-chat">
					<div className="block">
						{this.props.route && renderRoutes(this.props.route.routes)}
					</div>
				</div>
			</Fragment>
		)
	}
}


export const Message = ({children, my, bid, isEarned, button, className, status = MsgStatus.SENT}) => (
	<div className={classNames([className, "chat-message", {"chat-message-my": my, "chat-message-bid": !!bid}])}>
		<div className="chat-message-block">
			<div className="chat-message-block-message">
				<div className="message-text">{children}</div>
				{bid && <AbtValue value={bid} isEarned={isEarned} className="chat-message-block-abt"/>}
			</div>
			<div style={{fontSize: '0.7em'}}>{status === MsgStatus.SENT ? "" : "sending..."}</div>
			{button &&  (
				<div className="chat-message-buttons">
						<button disabled={button.disabled} onClick={button.onClick}  className="chat-message-buttons-button">
							{button.isLoading ? (<FontAwesomeIcon icon={faSpinner} spin style={{marginRight: '14px'}}/>):(<span/>)}
							{button.title}
						</button>
				</div>
			)}
		</div>
	</div>
);

function mapStateToProps({ auth }) {
	return { auth };
}

const connectedChat = connect(mapStateToProps)(Chat);
export { connectedChat as Chat };
