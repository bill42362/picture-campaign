// App.react.js
'use strict';
import { connect } from 'react-redux';
import React from 'react';
import Debug from 'debug';
import PbplusMemberCenter from 'pbplus-member-sdk';
import AuthState from './AuthState.js';
import Header from './Header.react.js';
import '../css/app.less';

Debug.disable();
if('production' != process.env.NODE_ENV) { Debug.enable('picture-campaign:*'); }

const ConnectedHeader = connect(
    state => { return {
        headerNavs: state.headerNavs,
        headerAnnounces: state.headerAnnounces,
        loginEndpoint: `${state.authState.endpoint}&token_id=${state.pbplusMemberCenter.userUuid}`,
        isUserLoggedIn: state.authState.isUserLoggedIn,
    }; },
    dispatch => ({
        logout: () => {
            dispatch(PbplusMemberCenter.Actions.renewUserUUID());
            dispatch(AuthState.Actions.updateAuthState({authState: {isUserLoggedIn: false}}));
        },
        displayPbplusMemberCenter: () => dispatch(PbplusMemberCenter.Actions.display()),
    })
)(Header);

class App extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { } = this.props;
        return <div className='app'>
            <ConnectedHeader />
            pb+ lottery
        </div>;
    }
}

export default App;
