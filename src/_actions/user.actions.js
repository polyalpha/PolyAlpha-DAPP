import { userConstants } from '../_constants';

export const userActions = {
    updateUserList
};

function updateUserList() {
    console.log('update user list action');
    return {type: userConstants.UPDATE_LIST};
}
