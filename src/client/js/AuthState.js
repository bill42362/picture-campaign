// AuthState.js
'use strict';

const defaultState = {isUserLoggedIn: false, endpoint: '#'};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_PBPLUS_AUTH_STATE':
            return Object.assign({}, state, action.payload.authState);
            break;
        default:
            return state;
    }
}

const updateAuthState = ({ authState }) => {
    return {type: 'UPDATE_PBPLUS_AUTH_STATE', payload: { authState }};
};

const Actions = { updateAuthState };

export default { Reducer, Actions };
