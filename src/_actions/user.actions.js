import { userConstants } from '../_constants';

export const userActions = {
    updateUserList,
    loggedIn
};

function updateUserList() {
    console.log('update user list action');
    return {type: userConstants.UPDATE_LIST};
}

function loggedIn() {
    return {type: userConstants.LOGIN_SUCCESS};
}