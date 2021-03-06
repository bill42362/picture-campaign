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
import Campaign from './Campaign.js';
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
    campaign: Campaign.Reducer,
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

const ConnectedApp = connect(
    (state, ownProps) => {
        return {
            basePicture: state.campaign.basePicture,
            basePictureMobile: state.campaign.basePictureMobile,
            campaignButtons: Campaign.getButtons(store.dispatch, state),
            drawResult: state.campaign.drawResult,
            drawResultImage: state.campaign.drawResultImage,
            drawResultContents: state.campaign.drawResultContents,
        };
    },
    (dispatch, ownProps) => { return {
        onLoadAction: () => {
            if(Campaign.Actions.onLoadAction) {
                return dispatch(Campaign.Actions.onLoadAction());
            }
        },
        closeCampaignResult: () => {
            return dispatch(Campaign.Actions.updateCampaignState({campaignState: {
                drawResult: undefined,
                drawResultContents: [],
            }}));
        },
    }; }
)(App);

ReactDOM.render(
    <Provider store={store} >
        <ConnectedApp />
    </Provider>,
    document.getElementById('app-root')
);
