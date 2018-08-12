import { userConstants } from '../_constants';
import LocalData from '../_services/LocalData';

function getAddresses() {
  let result = {};
  result.chatAddresses = LocalData.getConenctedAddresses();
  result.bidAddresses = LocalData.getBidAddresses();
  result.myBidAddresses = LocalData.getMyBidAddresses();
  result.newAddresses = LocalData.getNewUserAddresses();
  return result;
}

let initialState = getAddresses();

export function users(state = initialState, action) {
  if (action.type == userConstants.UPDATE_LIST) {
    console.log('get user list');

    return getAddresses();
  }
  return state;
}