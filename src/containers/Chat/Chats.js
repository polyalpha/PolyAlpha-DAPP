import React, {Component} from "react";
import { connect } from 'react-redux';
import {Message, MessagesBlock, ChatLayout} from "./Chat"
import LocalData from "../../_services/LocalData";
import blockConnector from '../../_services/blockConnector.service';
import {KEY, MsgType, MsgStatus, BidType} from '../../_constants/Static';
import {TOKEN_DECIMAL} from '../../_configs/Config';
import Utils from '../../_helpers/Utils';
import { txConstants } from "../../_constants";
import {history} from '../../_helpers/history';



const SearchInput = (props) => (
	<input placeholder="Search" className="tabs-search" type="text" name="search" onChange={
		e => props.onChange && props.onChange(e)
	}/>
);



@connect(mapStateToProps)
export class Chats extends Component {
	constructor(props) {
		super(props);

		this.tabs = [<SearchInput key="chats-search" onChange={this.searchOnChanged} />];

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

	searchOnChanged = (e) => {
		this.setState({searchTerm: e.target.value});
	}

	loadUser = (props, fromUpdateProps) => {
		let userId = props.match.params.id;

		let chatAddresses = props.users.chatAddresses;
		let chatUsers = LocalData.getUsers(chatAddresses);

		if (!userId && chatAddresses.length > 0 && this.props.device.isBrowser) {
			let id = chatAddresses[0];
			const path = "/chat/chats/"+id;
			if (this.props.location.pathname !== path) {
				// history.push(path);
			}
		}

		let user = LocalData.getUser(userId);
		let messages = user[KEY.MESSAGES];
		if (!messages) {
			messages = [];
		}

		if (fromUpdateProps) {
			this.setState({messages, user, userId, users: chatUsers});
		} else {
			this.state = {messages, user, userId, users: chatUsers, searchTerm: ""};
		}
	}

	onMessageSent = async (message) => {
		this.messagesBlock.setSendLoading(true);

		let user = LocalData.getUser(this.state.userId);
		let secret = Utils.computeSecret(Buffer.from(LocalData.getPrivateKey(), 'hex'),
			Buffer.from('04' + user[KEY.USER_PUBKEY], 'hex'));
		let encryptedMessage = '0x' + Utils.encrypt(message, secret);

		let result = await blockConnector.sendMessage(this.state.userId, encryptedMessage);

		result.on(txConstants.ON_APPROVE, (txHash) => {
			this.messagesBlock.setSendLoading(false);
			LocalData.addMessage(this.state.userId, encryptedMessage, txHash, MsgStatus.PENDING, MsgType.TO);
			// LocalData.addBid(this.state.userId, encryptedMessage,10,BidType.TO, txHash);
			this.setState({messages: LocalData.getUser(this.state.userId)[KEY.MESSAGES]});
		}).on(txConstants.ON_RECEIPT, (receipt) => {
			LocalData.addMessage(this.state.userId, encryptedMessage, receipt.transactionHash, MsgStatus.SENT, MsgType.TO, receipt.blockNumber);
			this.setState({messages: LocalData.getUser(this.state.userId)[KEY.MESSAGES]});
		}).on(txConstants.ON_ERROR, (err, txHash) => {
			LocalData.addMessage(this.state.userId, encryptedMessage, txHash, MsgStatus.FAILED, MsgType.TO);
			this.setState({messages: LocalData.getUser(this.state.userId)[KEY.MESSAGES]});
		})
	}

	checkUsername = (user) => {
		if (this.state.searchTerm.length == 0) {
			return true;
		} else {
			return (user[KEY.USER_UNAME].toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) !== -1);
		}
	}

	// createHandler = async (e) => {
	// 	// e.preventDefault();
	// 	// this.setState({isLoading: true});
	// 	LocalData.addBid(this.state.userId, encryptedMessage,10, txHash, MsgStatus.PENDING, MsgType.TO);

		
	// };

	render() {
		let {messages, user} = this.state;
		let bidAmount = parseInt(user[KEY.BID_AMOUNT] / TOKEN_DECIMAL);
		let mine = user[KEY.BID_TYPE] === BidType.TO;

		this.messageElements = [
			<Message my={mine} bid={bidAmount} txHash={user[KEY.BID_TXHASH]} isEarned={false} key={1}>{user[KEY.BID_MESSAGE]}</Message>,
		];

		if (messages && messages.length) {
			for (let i=0;i<messages.length;i++) {
				let mine = messages[i][KEY.MESSAGE_TYPE] === MsgType.TO;
				this.messageElements.push(<Message key={2 + i} my={mine} txHash={messages[i][KEY.MESSAGE_TXHASH]} 
					status={messages[i][KEY.MESSAGE_STATUS]}>{messages[i][KEY.MESSAGE_CONTENT]}</Message>);
			}
		}

		this.sidebar = {
			name: "chats",
			tabs: this.tabs, users: this.state.users.filter(this.checkUsername),
			userId: this.props.match.params.id66
		};

		return (
			<ChatLayout {...this.props} sidebar={this.sidebar} back="/chat/chats" more={true}>
				{this.state.userId && <MessagesBlock
					messages={this.messageElements}
					onMessageSent={this.onMessageSent}
					ref={messagesBlock => this.messagesBlock = messagesBlock}
				/>}
			</ChatLayout>
		)
	}
};

function mapStateToProps({ auth, users, device }) {
	return { auth, users, device };
}
