// HeaderNavs.js
'use strict';
import 'isomorphic-fetch';

const defaultState = {
    main: [
        {url: '//tv.pbplus.me', color: 'rgb(149, 122, 160)', display: 'TV直播'},
    ],
    sub: []
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_NAVS':
            return Object.assign({}, state, action.payload.navs);
        default:
            return state;
    }
}

const updateNavs = ({ navs }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        dispatch({type: 'UPDATE_NAVS', payload: { navs }});
        resolve({ navs });
    });
}};

const fetchNavs = () => { return (dispatch, getState) => {
    return fetch(`${process.env.COMMON_BASE_URL}/menu/header`, {
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        if(200 !== response.status) { throw new Error('Bad response from server'); }
        const navs = {
            main: response.message.main || response.message,
            sub: response.message.sub || [],
        };
        return dispatch(updateNavs({ navs }));
    });
}; };

const Actions = { fetchNavs };

export default { Reducer, Actions };
