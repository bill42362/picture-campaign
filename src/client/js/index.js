// index.js
'use strict';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { connect, Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Debug from 'debug';
import PbplusMemberCenter from 'pbplus-member-sdk';
import AuthState from './AuthState.js';
import HeaderNavs from './HeaderNavs.js';
import HeaderAnnounces from './HeaderAnnounces.js';
import App from './App.react.js';
import 'normalize.css';
import '../css/index.less';

Debug.disable();
if('production' != process.env.NODE_ENV) { Debug.enable('picture-campaign:*'); }

const reducer = combineReducers({
    pbplusMemberCenter: PbplusMemberCenter.Reducer,
    authState: AuthState.Reducer,
    headerNavs: HeaderNavs.Reducer,
    headerAnnounces: HeaderAnnounces.Reducer,
});
const store = createStore(reducer, applyMiddleware(ReduxThunk));

store.dispatch(HeaderNavs.Actions.fetchNavs())
.catch(error => { Debug('picture-campaign:index')('fetchNavs()', JSON.stringify(error)); });

store.dispatch(HeaderAnnounces.Actions.fetchAnnounces())
.catch(error => { Debug('picture-campaign:index')('fetchAnnounces()', JSON.stringify(error)); });

store.dispatch(PbplusMemberCenter.Actions.checkAuthState({clientId: process.env.AUTH_CLIENT_ID}))
.then(({ isUserLoggedIn, endpoint }) => {
    store.dispatch(AuthState.Actions.updateAuthState({authState: { isUserLoggedIn, endpoint }}));
})
.catch(error => { Debug('picture-campaign:index')('checkAuthState()', JSON.stringify(error)); });

const campaignButtonActions = {
    login: () => { console.log('login()'); },
};
const getCampaignButtons = state => {
    const loginButton = {
        desktop: {
            props: {
                style: {
                    backgroundColor: 'gray',
                    left: '50%', top: '50%', width: '10%', height: '5%'
                },
                onClick: campaignButtonActions.login,
            },
            content: <div>立即註冊/登入</div>,
        },
    };
    return {
        desktop: [loginButton.desktop],
        mobile: [],
    };
};

const ConnectedApp = connect(
    (state, ownProps) => {
        return {
            campaignButtons: getCampaignButtons(state),
        };
    },
    (dispatch, ownProps) => { return {
    }; }
)(App);

ReactDOM.render(
    <Provider store={store} >
        <ConnectedApp />
    </Provider>,
    document.getElementById('app-root')
);
