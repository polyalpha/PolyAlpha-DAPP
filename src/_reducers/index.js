import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { config } from './config.reducer';
import { device } from './device.reducer';

const rootReducer = combineReducers({
  auth: authentication,
  registration,
  users,
  alert,
  config,
	device
});

export default rootReducer;
