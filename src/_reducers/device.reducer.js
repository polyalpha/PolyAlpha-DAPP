import { deviceConstants } from '../_constants';
import {isMobileWidth} from '../_components/device'


const deviceState = (isMobile) => ({isMobile, isBrowser: !isMobile});

const defaultState = deviceState(isMobileWidth());

export function device(state = defaultState, action) {
  switch (action.type) {
		case deviceConstants.DEVICE_MOBILE:
      return deviceState(true);
		case deviceConstants.DEVICE_BROWSER:
			return deviceState(false);
    default:
      return state
  }
}


