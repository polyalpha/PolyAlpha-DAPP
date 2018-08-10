import { userConstants } from '../_constants';
import LocalData from '../_services/LocalData';

// let user = JSON.parse(localStorage.getItem('user'));
let user = {};
user.name = 'Not set';
user.avatar = "/i/avatars/adam.png";
const initialState = user ? { loggedIn: LocalData.isLoggedIn(), user } : {
	loggedIn: false,
	user: {
		name: "User Name",
		avatar: "/i/avatars/adam.png"
	}
};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.LOGOUT:
      return {};
    default:
      return state
  }
}
