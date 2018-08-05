import React from "react";
import {Svg} from "../App/Svg"
import ReactButton from 'react-validation/build/button';


export const Button = (props) => (
	<ReactButton {...props}>
		<Svg id={props.icon} className="icon" />
		{props.children}
	</ReactButton>
);

export const DivButton = (props) => (
	<button {...props}>
		<Svg id={props.icon} className="icon" />
		{props.children}
	</button>
);



