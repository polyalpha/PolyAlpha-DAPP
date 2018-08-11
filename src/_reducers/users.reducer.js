import { userConstants } from '../_constants';
import LocalData from '../_services/LocalData';

export function users(state = {}, action) {
  state.chatAddresses = LocalData.getConenctedAddresses();
  state.bidAddresses = LocalData.getBidAddresses();
  state.myBidAddresses = LocalData.getMyBidAddresses();
  state.newAddresses = LocalData.getNewUserAddresses();
  return state;
}