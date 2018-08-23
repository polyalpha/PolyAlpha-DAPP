import React, {Fragment, Component} from "react";
import {history} from "../../_helpers/history";
import { connect } from 'react-redux';
import {renderRoutes} from "react-router-config"
import { alertActions, userActions, configActions } from '../../_actions'
import {Svg} from '../App/Svg'
import classNames from 'classnames'
import './Settings.scss'
import {Link} from "react-router-dom"
import Form from 'react-validation/build/form';
import Input from 'react-validation/build/input';
import Button from 'react-validation/build/button';
import {MainTitle} from "..";
import LocalData from "../../_services/LocalData";
import {ENV} from '../../_configs/Config';
import {ImgBg} from "..";


export class SettingsLayout extends Component {

  static defaultProps = {
    title: "Settings"
  };

	render() {
    console.log("render Settings", this.props.route, this.props.children);
    return (
      <div className={classNames("settings-block", this.props.className)}>
        {this.props.title && <MainTitle>{this.props.title}</MainTitle>}
        <div className={classNames(["config-window", this.props.className])}>
          <div className="window">
            <div className="block">
              <div className="content">
                <div className="settings-main">
                  {this.props.children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
	}

}

export const SettingsMain = () => (
  <SettingsLayout title="Settings">
    <h2>{LocalData.getUsername()}, here are the configurations for your messenger.</h2>
    <div>
      <div className="item">Your Ethereum balance is: <b>{LocalData.getBalance()} ETH</b></div>
      <div className="item">Your PADT token balance is: <b>{LocalData.getTokenBalance()} PADT</b></div>
      <div className="item">You are on the <b>{ENV.NetworkName}</b></div>
      <div className="item">Your public address is <b className="break">{LocalData.getAddress()}</b></div>
    </div>
  </SettingsLayout>
);


export const SettingsPublicAddress = () => (
  <SettingsLayout title="Address" className="settings-address">
    <h2>Your public address is</h2>
    <div>
      <ImgBg src="/i/address-icon.png" className="address-icon icon" /><b className="break">{LocalData.getAddress()}</b>
    </div>
  </SettingsLayout>
);


const SettingsNetwork = ({config, dispatch}) => {

	let nn = [
		["svg-li-1", "Main ethereum network"],
		["svg-li-2", "Rinkeby test network"],
		["svg-li-3", "Ropsten test network"],
	];

	return (
		<SettingsLayout title="Network" className="settings-network">
			<h2>Change Ethereum Networks</h2>
			<div className="settings-network-list">
				{nn.map(x=>{
					return (
						<div key={x[1]} className="settings-network-list-item">
							<Svg id={x[0]} className="icon"/>
							{x[1]}
						</div>
					)
				})}
			</div>
		</SettingsLayout>
	)
};


const SettingsGas = ({config, dispatch}) => (
	<SettingsLayout title="Gas" className="settings-gas">
		<h2>Set gas limit</h2>
		<Form onSubmit={
			(e) => {
				const gasLimit = Number(e.target.querySelector('input').value);
				dispatch(configActions.update({gasLimit}));
				e.preventDefault();
			}
		}>
			<label>
        <div className="label-message">Enter new gas limit:</div>
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
	</SettingsLayout>
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

