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
		return (
			<ReactButton className={this.props.className}>
				{icon}
				{ isLoading ? this.props.loadingContent : this.props.content}
				{this.props.children}
			</ReactButton>
		);
	}
}

export const DivButton = (props) => (
	<button {...props}>
		<Svg id={props.icon} className="icon" />
		{props.children}
	</button>
);

