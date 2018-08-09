import { configConstants } from '../_constants';


const defaultState = {
	ethBalance: 140.5,
	network: "NETWORK",
	gasLimit: 0,
};

export function config(state = defaultState, action) {
  switch (action.type) {
		case configConstants.CONFIG_UPDATE:
      return Object.assign({...state}, action.state);
    default:
      return state
  }
}
