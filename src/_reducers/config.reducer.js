import { configConstants } from '../_constants';


const defaultState = {
	ethBalance: 140.5,
	network: "Rinkeby test network",
	gasLimit: 0,
	publicAddress: "0x0c0614cc90b41Cd7111A01CE01ec4DB491F5083c"
};

export function config(state = defaultState, action) {
  switch (action.type) {
		case configConstants.CONFIG_UPDATE:
      return Object.assign({...state}, action.state);
    default:
      return state
  }
}
