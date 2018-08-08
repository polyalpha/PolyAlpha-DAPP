import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {Chat, SideBar, UserList, MainBar, MessagesBlock, MessageContext} from "./Chat"
import Form from 'react-validation/build/form';
import Button from 'react-validation/build/button';
import Input from 'react-validation/build/input';
import classnames from "classnames"
import {Link} from "react-router-dom"


const AbtValue = ({value, className}) => (
	<div className={classnames(["abt-value", className])}>
		<div className="value">
			<div className="numbers">{value}</div>
			<div className="label">ABT</div>
		</div>
	</div>
);


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
		if (!this.props.parent.state.message.length) {
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
		type: "new",
		title: "New Users"
	},
	{
		type: "top",
		title: "Top Users"
	}
];

const DiscoverSideBar = ({userId, type, users}) => (
	<SideBar name="discover">
		<div className="top-bar">
			<div className="tabs">
				{sideBarTabs.map(
					tab=><Link
						className={classnames(["tab", {selected: tab.type === type }])}
						key={tab.type}
						to={`/chat/discover/${tab.type}`}
					>{tab.title}</Link>
				)}
			</div>
		</div>
		<UserList userId={userId} type={type} users={users}/>
	</SideBar>
);


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



const Discover = ({auth, users, match}) => {
	match.params.type = match.params.type || "new";
	users = match.params.type === "new" ? defaultNewUsers : defaultTopUsers;
	console.log(match);
	return (
		<Fragment>
			<DiscoverSideBar type={match.params.type} userId={match.params.id} users={users} />
			<MainBar>
				{match.params.id && (
					<MessagesBlock>
						<CreateNewBid />
					</MessagesBlock>
				) || <DiscoverInfo />}
			</MainBar>
		</Fragment>
	)
};

const defaultNewUsers = [
	{id: 2, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", date:"Yesterday"},
	{id: 3, name: "John Copley", avatar: "/i/avatars/adam.png", date:"Yesterday"},
	{id: 4, name: "MargotRobbie", avatar: "/i/avatars/adam.png", date:"Yesterday"},
	{id: 5, name: "Vincent van Gogh", avatar: "/i/avatars/adam.png", date:"Yesterday"},
];

const defaultTopUsers = [
	{id: 2, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", bid: 100, abt:"2.33"},
	{id: 3, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", bid: 60, abt:"0.02"},
	{id: 4, name: "PolyAlpha Assistant", avatar: "/i/avatars/adam.png", bid: 80, abt:"3.01"},
];


function mapStateToProps(state) {
	const { auth } = state;
	return { auth };
}

const connectedDiscover = connect(mapStateToProps)(Discover);
export { connectedDiscover as Discover };
