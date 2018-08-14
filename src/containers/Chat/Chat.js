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
import {history} from "../../_helpers/history";
import {alertActions} from "../../_actions";
import {MainBlock} from "../App/App";
import {KEY, MsgStatus} from '../../_constants/Static';
import Utils from '../../_helpers/Utils';


export const MessageContext = React.createContext("");


export class MessagesBlock extends Component {

	state = {
		message: ""
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
				this.setState({message: ""});
			}
		}
	}

	scrollToBottom() {
		Utils.scrollToBottom(this.messagesContainer, 300);
	}
	

	render() {

		let i = 0;

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
					<div className="block">
						<div className="textarea">
					<Textarea
						autoFocus
						placeholder="Type a message..."
						name="message"
						value={this.state.message}
						onChange={this.onMessageChanged}
					/>
						</div>
						<div className="buttons">
							{/* <Svg id="svg-mic" className="button" /> */}
							<Svg id="svg-share" className="button" onClick={this.onMessageSent} />
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
			{users.map(user=>(
				<Link className={classNames(["user", {selected: String(user[KEY.USER_ADDRESS]) === userId}])} key={user[KEY.USER_ADDRESS]} to={`/chat/${name}/${tab}/${user[KEY.USER_ADDRESS]}`}>
					<i className="img" style={{backgroundImage: `url(${user[KEY.USER_AVARTAR_URL]})`}} />
					<div className="name">{user[KEY.USER_NAME]}</div>
					{/* {user.bid && (
						<div className="users-bid-abt">
							<div className="users-bid-abt-bid">{user.bid} bids</div>
							<div className="users-bid-abt-abt">{user.abt} ABT</div>
						</div>

					) || (
						user.date && <div className="date">{user.date}</div>
					)} */}
				</Link>
			))}
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
		return (
			<div className="top-bar">
				{this.props.back && <Link to={this.props.back} className="back"><Svg id="svg-back" className="icon"/>Back</Link>}
				<div className="title">{this.props.title}</div>
				{this.props.more && (
					<div className="more">
						<div className="more-label" onClick={this.toggleMore}>More</div>
						{this.state.isOpenMore && (
							<div className="more-select">
								<div className="more-select-item">Block user</div>
								<div className="more-select-item">Send ABT</div>
							</div>
						)}
					</div>
				)}
			</div>
		);
	}
}


export const MainBar = ({children}) => (
	<div className="main">
		<TopBar title="Info" back="/chat" more={true} />
		<div className="scroll">
			{children}
		</div>
	</div>
);



export const AbtValue = ({value, isEarned, className}) => (
	<div className={classNames(["abt-value", className])}>
		<div className="abt-value-block">
			<div className="abt-value-block-middle">
				{isEarned && <div className="abt-value-is-earned">Earned</div>}
				<div className="abt-value-numbers">{value}</div>
				<div className="abt-value-label">ABT</div>
			</div>
		</div>
	</div>
);


export const ChatLayout = ({children, match, sidebar, back}) => {
	let {tabs, tab, name} =  sidebar;
	return (
		<Fragment>
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
				<UserList {...sidebar} />
			</SideBar>
			{children && (
				<div className="main">
					<TopBar title="Info" back={back} more={true} />
					<div className="scroll">
						{children}
					</div>
				</div>
			)}
		</Fragment>
	)
};



const Chat = ({auth, title, route}) => {
	console.log({route})
	return (
		<Fragment>
			<MainTitle>{title || `Hello ${auth.user.name}`}</MainTitle>
			<div id="body-chat">
				<div className="block">
					{route && renderRoutes(route.routes)}
				</div>
			</div>
		</Fragment>
	)
};


export const Message = ({children, my, bid, isEarned, button, className, status = MsgStatus.SENT}) => (
	<div className={classNames([className, "chat-message", {"chat-message-my": my, "chat-message-bid": !!bid}])}>
		<div className="chat-message-block">
			<div className="chat-message-block-message">
				{children}
				{bid && <AbtValue value={bid} isEarned={isEarned} className="chat-message-block-abt"/>}
			</div>
			<div style={{fontSize: '0.7em'}}>{status == MsgStatus.SENT ? "" : "sending..."}</div>
			{button &&  (
				<div className="chat-message-buttons">
					<button {...button} className="chat-message-buttons-button" >{button.title}</button>
				</div>
			)}
		</div>
	</div>
);

function mapStateToProps(state) {
	const { auth } = state;
	return { auth };
}

const connectedChat = connect(mapStateToProps)(Chat);
export { connectedChat as Chat };
