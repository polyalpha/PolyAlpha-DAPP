import React, {Fragment, Component} from "react";
import { connect } from 'react-redux';
import {Chat, SideBar, UserList, MainBar, MessagesBlock} from "./Chat"
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



export class CreateNewBid extends Component {

	state = {
		value: 0,
		message: null,
	};

	addHandler = (e) => {
		this.state.value += parseInt(e.target.innerText);
		this.state.value = this.state.value < 0 ? 0 : this.state.value;
		this.setState({value: this.state.value});
		e.preventDefault()
	};

	createHandler = (e) => {
		let message = <BidMessage bid={100} cancelHandler={this.cancelHandler}>I know a new coffeeshop  ☕️, which just opened. Do you want to check it out after New York fashion week?</BidMessage>;
		this.setState({message})
	};

	cancelHandler = (e) => {
		this.setState({message:null})
	};

	render() {
		return (
			<Fragment>
				{this.state.message && this.state.message || (
					<div className="create-new-bid">
						<h2 className="raleway">Create New Bid</h2>
						<h3 className="catamaran">Enter the amount of ABT tokens for your new bid</h3>
						<div className="token-value">
							{this.state.value <= 0
								? (<i className="logo-image" />)
								: (<AbtValue value={this.state.value} />)}
						</div>
						<Form className="form" onSubmit={this.createHandler}>
							<Input type="hidden" value={this.state.value} validations={[abcValidator]}/>
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


const discoverSideBarTabs = [
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
				{discoverSideBarTabs.map(
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



const Discover = ({auth, users, route, match, ...props}) => {
	users = match.params.type === "new" ? defaultNewUsers : defaultTopUsers;
	return (
		<Chat title={`Hello ${auth.user.name}`}>
			<DiscoverSideBar type={match.params.type} userId={match.params.id} users={users} />
			<MainBar>
				{match.params.id && (
					<MessagesBlock>
						<CreateNewBid />
					</MessagesBlock>
				) || <DiscoverInfo />}
			</MainBar>
		</Chat>
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
