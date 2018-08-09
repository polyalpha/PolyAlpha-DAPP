import { configConstants } from '../_constants';

export const configActions = {
    update,
};

function update(state) {
    return { type: configConstants.CONFIG_UPDATE, state };
}

