import { userConstants } from '../_constants';
import LocalData from '../_services/LocalData';

const initialState = { loggedIn: LocalData.isLoggedIn(), user: LocalData.getCurrentUser() };

export function authentication(state = initialState, action) {
  switch (action.type) {
    // case userConstants.LOGIN_REQUEST:
    //   return {
    //     loggingIn: true,
    //     user: action.user
    //   };
    case userConstants.LOGIN_SUCCESS: 
      return {
        loggedIn: true,
        user: LocalData.getCurrentUser()
      };
    // case userConstants.LOGIN_FAILURE:
    //   return {};
    case userConstants.LOGOUT:
      return {};
    default:
      return state
  }
}