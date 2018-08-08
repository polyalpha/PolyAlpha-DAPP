import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {Chat, SideBar, UserList, MainBar, MessagesBlock, MessageContext, ChatLayout, AbtValue} from "./Chat"
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import Input from 'react-validation/build/input';
import classnames from "classnames"
import {Link} from "react-router-dom"




const abcValidator = (value) => {
	if (parseInt(value || 0) <= 0) {
		return <div>Bad value</div>;
	}
};

const required = (value) => {
	if (!value.toString().trim().length) {
		// We can return string or jsx as the 'error' prop for the validated Component
		return <div>Require</div>;
	}
};



export class CreateNewBid extends Component {

	state = {
		isSubmitted: false,
		bid: 0,
		message: "",
	};

	constructor(props) {
		super(props)
	}

	addHandler = (e) => {
		let bid = this.state.bid + parseInt(e.target.innerText);
		bid = bid < 0 ? 0 : bid;
		this.setState({bid});
		e.preventDefault()
	};

	createHandler = (e) => {
		let message = this.state.message;
		this.setState({isSubmitted: true, message});
		e.preventDefault();
	};

	cancelHandler = (e) => {
		this.setState({isSubmitted: false});
		e.preventDefault();
	};

	messageValidator = () => {
		console.log("textValidator");
		if (!this.state.message.length) {
			return <div>Bad text</div>;
		}
	};

	render() {
		return (
			<Fragment>
				{this.state.isSubmitted && (
					<BidMessage bid={this.state.bid} cancelHandler={this.cancelHandler}>{this.state.message}</BidMessage>
				) || (
					<div className="create-new-bid">
						<h2 className="raleway">Create New Bid</h2>
						<h3 className="catamaran">Enter the amount of ABT tokens for your new bid</h3>
						<div className="token-value">
							{this.state.bid <= 0
								? (<i className="logo-image" />)
								: (<AbtValue value={this.state.bid} />)}
						</div>
						<Form className="form" onSubmit={this.createHandler}>
							<Input type="hidden" name="value" value={this.state.bid} validations={[abcValidator, this.messageValidator]}/>
							<MessageContext.Consumer>
								{message => {
									this.state.message = message;
									return <Input type="hidden" name="value" value={message} validations={[required]}/>;
								}}
							</MessageContext.Consumer>

							<div className="values">
								<button className="button" onClick={this.addHandler}>-10</button>
								<button className="button" onClick={this.addHandler}>+10</button>
							</div>
							<Button className="submit">Submit bid</Button>
						</Form>
					</div>
				)}
			</Fragment>
		)
	}
}


const BidMessage = ({bid, children, cancelHandler}) => (
	<div className="bid-message">
		<div className="bid-message-message">
			<div className="bid-message-message-block">{children}</div>
			<AbtValue value={bid} className="bid-message-message-bid"/>
		</div>
		<div className="bid-message-buttons">
			<button className="cancel" onClick={cancelHandler}>Cancel bid</button>
		</div>
	</div>
);


const sideBarTabs = [
	{
		name: "new",
		title: "New Users"
	},
	{
		name: "top",
		title: "Top Users"
	}
];


const DiscoverInfo = (props) => (
	<div className="info-block">
		<div className="user-info">
			<i className="img" style={{backgroundImage: "url(/i/avatars/adam.png)"}} />
			<div className="name">PolyAlpha Assistant</div>
			<div className="date">last seen yesterday</div>
		</div>
		<div className="buttons">
			<a href="#" className="button">Chat</a>
		</div>
		<div className="info">
			<div className="title">Information</div>
			<div className="text">
				<p>To use this messenger, select a user on the list on the left to bid to chat. If you need help, just
					message me.</p>
				<p>Chatting to people not in your contacts requires a bid but this is free for this proof of concept
					DAPP.</p>
				<p>Friends in your contacts are free to communicate with.</p>
				<p>This DAPP runs on Ethereum test next so messages are not fast or private.</p>
				<p>Enjoy PolyAlpha and please send us your thoughts.</p>
			</div>
		</div>
	</div>
)



const Discover = ({users, match, ...props}) => {
	match.params.tab = match.params.tab || sideBarTabs[0].name;
	users = users && users || defaultUsers[sideBarTabs.findIndex(x=>x.name === match.params.tab )];

	let sidebar = {
		name: "discover",
		tab: match.params.tab,
		tabs: sideBarTabs,
		users,
		userId: match.params.id,
	};

	let messages = [<CreateNewBid />];

	return (
		<ChatLayout {...props} sidebar={sidebar} back="/chat/discover">
			{match.params.id && (
				<MessagesBlock messages={messages}/>
			) || <DiscoverInfo />}
		</ChatLayout>
	)
};

const defaultUsers = [
	[
		{id: 2, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", date:"Yesterday"},
		{id: 3, name: "John Copley", avatar: "/i/avatars/adam.png", date:"Yesterday"},
		{id: 4, name: "MargotRobbie", avatar: "/i/avatars/adam.png", date:"Yesterday"},
		{id: 5, name: "Vincent van Gogh", avatar: "/i/avatars/adam.png", date:"Yesterday"},
	],
	[
		{id: 2, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", bid: 100, abt:"2.33"},
		{id: 3, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", bid: 60, abt:"0.02"},
		{id: 4, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", bid: 80, abt:"3.01"},
	]
];


function mapStateToProps(state) {
	const { auth } = state;
	return { auth };
}

const connectedDiscover = connect(mapStateToProps)(Discover);
export { connectedDiscover as Discover };
