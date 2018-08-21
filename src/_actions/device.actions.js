import { deviceConstants } from '../_constants';

export const deviceActions = {
	mobile,
	browser
};


function mobile() {
    return { type: deviceConstants.DEVICE_MOBILE };
}

function browser() {
	return { type: deviceConstants.DEVICE_BROWSER };
}

