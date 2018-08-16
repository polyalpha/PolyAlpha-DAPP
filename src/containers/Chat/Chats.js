import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {Chat, SideBar, UserList, Message, MessagesBlock, ChatLayout} from "./Chat"
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import Input from 'react-validation/build/input';
import classnames from "classnames"
import {Link} from "react-router-dom"
import LocalData from "../../_services/LocalData";
import blockConnector from '../../_services/blockConnector.service';
import {KEY, MsgType, MsgStatus, BidType} from '../../_constants/Static';
import {TOKEN_DECIMAL} from '../../_configs/Config';
import Utils from '../../_helpers/Utils';
import { txConstants } from "../../_constants";



const SearchInput = (props) => (
	<input placeholder="Search" className="tabs-search" type="text" name="search" onChange={
		e => console.log(e.target.value)
	}/>
);


class Chats extends Component {
	constructor(props) {
		super(props);
		this.loadUser = this.loadUser.bind(this);
		this.onMessageSent = this.onMessageSent.bind(this);

		this.loadUser(props, false);
	}

	componentWillReceiveProps(props) {
		this.loadUser(props, true);		
	}

	componentDidMount() {
		if (this.messagesBlock) {
			this.messagesBlock.scrollToBottom();
		}
	}

	componentDidUpdate() {
		if (this.messagesBlock) {
			this.messagesBlock.scrollToBottom();
		}
	}

	loadUser(props, fromUpdateProps) {
		let userId = props.match.params.id;

		let tabs = [<SearchInput key="chats-search" />];
		let chatAddresses = props.users.chatAddresses; 
		let chatUsers = LocalData.getUsers(chatAddresses);

		if (userId == undefined && chatAddresses.length > 0) {
			userId = chatAddresses[0];
		}
		this.sidebar = {
			name: "chats",
			tabs, users: chatUsers,
			userId
		};

		let user = LocalData.getUser(userId);
		let messages = user[KEY.MESSAGES];
		if (messages == undefined) {
			messages = [];
		}
		
		if (fromUpdateProps) {
			this.setState({messages, user, userId});
		} else {
			this.state = {messages, user, userId};
		}
		
	}

	onMessageSent = async (message) => {
		let user = LocalData.getUser(this.state.userId);
		let secret = Utils.computeSecret(Buffer.from(LocalData.getPrivateKey(), 'hex'), 
			Buffer.from('04' + user[KEY.USER_PUBKEY], 'hex'));
		let encryptedMessage = '0x' + Utils.encrypt(message, secret);

		let result = await blockConnector.sendMessage(this.state.userId, encryptedMessage);
		result.on(txConstants.ON_APPROVE, (txHash) => {
			LocalData.addMessage(this.state.userId, encryptedMessage, txHash, MsgStatus.PENDING, MsgType.TO);
			this.setState({messages: LocalData.getUser(this.state.userId)[KEY.MESSAGES]});
		}).on(txConstants.ON_RECEIPT, (receipt) => {
			LocalData.addMessage(this.state.userId, encryptedMessage, receipt.transactionHash, MsgStatus.SENT, MsgType.TO, receipt.blockNumber);
			this.setState({messages: LocalData.getUser(this.state.userId)[KEY.MESSAGES]});
		}).on(txConstants.ON_ERROR, (err, txHash) => {
			LocalData.addMessage(this.state.userId, encryptedMessage, txHash, MsgStatus.FAILED, MsgType.TO);
			this.setState({messages: LocalData.getUser(this.state.userId)[KEY.MESSAGES]});
		})
		console.log('send message result')
		console.log(result);
	}

	render() {
		let {messages, user} = this.state;
		let bidAmount = parseInt(user[KEY.BID_AMOUNT] / TOKEN_DECIMAL);
		let mine = user[KEY.BID_TYPE] == BidType.TO;

		this.messageElements = [
			<Message my={mine} bid={bidAmount} isEarned={false} key={1}>{user[KEY.BID_MESSAGE]}</Message>,
		];
		
		if (messages != undefined) {
			for (var i=0;i<messages.length;i++) {
				let mine = messages[i][KEY.MESSAGE_TYPE] == MsgType.TO;
				this.messageElements.push(<Message key={2 + i} my={mine} status={messages[i][KEY.MESSAGE_STATUS]}>{messages[i][KEY.MESSAGE_CONTENT]}</Message>);
			}
		}

		return (
			<ChatLayout {...this.props} sidebar={this.sidebar}>
				{this.state.userId && <MessagesBlock messages={this.messageElements} onMessageSent={this.onMessageSent} ref={messagesBlock => this.messagesBlock = messagesBlock} />}
			</ChatLayout>
		)
	}
};

function mapStateToProps(state) {
	const { auth, users } = state;
	return { auth, users };
}

const connectedChats = connect(mapStateToProps)(Chats);
export { connectedChats as Chats };
