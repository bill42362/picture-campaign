// HeaderAnnounces.js
'use strict';
import 'isomorphic-fetch';

const defaultState = [
    {id: 0, title: '', content: '目前沒有公告', published_timestamp: 0},
];

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_ANNOUNCES':
            return action.payload.announces;
        default:
            return state;
    }
}

const updateAnnounces = ({ announces }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({type: 'UPDATE_ANNOUNCES', payload: { announces }});
        resolve({ announces });
    });
}};

const fetchAnnounces = () => { return (dispatch, getState) => {
    return fetch(`${process.env.COMMON_BASE_URL}/board`, {
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        if(200 !== response.status) { throw new Error('Bad response from server'); }
        const announces = response.message;
        if(announces.length) {
            return dispatch(updateAnnounces({ announces }));
        }
    });
}; };

const Actions = { fetchAnnounces };

export default { Reducer, Actions };
