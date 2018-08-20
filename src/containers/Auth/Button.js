import React from "react";
import {Component} from 'react';
import {Svg} from "../App/Svg"
import ReactButton from 'react-validation/build/button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


export class Button extends Component {
	render() {
		let {isLoading} = this.props;
		let icon;
		if (isLoading) {
			icon = (<FontAwesomeIcon icon={faSpinner} spin style={{marginRight: '14px'}}/>);
		} else {
			icon = (<Svg id={this.props.icon} className="icon" />);
		}
		const title = isLoading ? this.props.loadingContent : this.props.content;
		return (
			<ReactButton className={this.props.className}>
				<div className="button-icon">{icon}</div>
				<div className="button-title">{ title || this.props.children}</div>
			</ReactButton>
		);
	}
}

export const DivButton = ({children, icon, ...props}) => (
	<button {...props}>
		<div className="button-icon"><Svg id={icon} className="icon" /></div>
		<div className="button-title">{children}</div>
	</button>
);

