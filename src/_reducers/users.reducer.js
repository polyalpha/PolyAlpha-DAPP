// import { userConstants } from '../_constants';
import LocalData from '../_services/LocalData';

export function users(state = {}, action) {
  console.log('get user list');

  let updatedState = {};
  updatedState.chatAddresses = LocalData.getConenctedAddresses();
  updatedState.bidAddresses = LocalData.getBidAddresses();
  updatedState.myBidAddresses = LocalData.getMyBidAddresses();
  updatedState.newAddresses = LocalData.getNewUserAddresses();
  return updatedState;
}