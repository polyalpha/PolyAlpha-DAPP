import React, {Fragment, Component} from "react";
import {history} from "../../_helpers/history";
import { connect } from 'react-redux';
import {renderRoutes} from "react-router-config"
import { alertActions, userActions, configActions } from '../../_actions'
import {Svg} from '../App/Svg'
import classnames from 'classnames'
import './Settings.scss'
import {Link} from "react-router-dom"
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';


export const Settings = ({route, className}) => {
		console.log("render Settings", route);
		return (
				<div className={classnames(["config-window", className])}>
					<div className="config-window-bg" />
					<div className="config-window-window">
						<div className="config-window-window-block">
							<div className="config-window-window-close">
								<Svg id="svg-close" />
							</div>
							<div className="config-window-window-block-content">
								{route && renderRoutes(route.routes)}
							</div>
						</div>
					</div>
				</div>
		)
};



const SettingsNetwork = ({config, dispatch}) => {

	let nn = [
		["svg-li-1", "Main ethereum network"],
		["svg-li-2", "Rinkeby test network"],
		["svg-li-3", "Ropsten test network"],
	];

	return (
		<div className="settings-network">
			<h2>Change Ethereum Networks</h2>
			<div className="settings-network-list">
				{nn.map(x=>{
					return (
						<div className="settings-network-list-item">
							<Svg id={x[0]} className="icon"/>
							{x[1]}
						</div>
					)
				})}
			</div>
		</div>
	)
};


const SettingsGas = ({config, dispatch}) => (
	<Fragment>
		<h2>Set gas limit</h2>
		<Form onSubmit={
			(e) => {
				const gasLimit = Number(e.target.querySelector('input').value);
				dispatch(configActions.update({gasLimit}));
				e.preventDefault();
			}
		}>
			<label>
				Enter new gas limit:
				<Input
					autoFocus
					placeholder="0"
					className="input"
					type="text"
					value={config.gasLimit}
					validations={[gasValidation]}
				/>
			</label>
			<div className="buttons">
				<Button>Save</Button>
			</div>
		</Form>
	</Fragment>
);


const gasValidation = (value) => {
	let x = value.toString();
	if (!/^\d+$/.test(x)) {
		return <div className="error">is not number</div>
	}
	if (Number(x) <= 0) {
		return <div className="error">zero</div>
	}
};


function mapStateToProps({ config }) {
	return { config };
}

const connectedSettingsGas = connect(mapStateToProps)(SettingsGas);
export {connectedSettingsGas as SettingsGas}

const connectedSettingsNetwork = connect(mapStateToProps)(SettingsNetwork);
export {connectedSettingsNetwork as SettingsNetwork}
