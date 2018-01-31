// App.react.js
'use strict';
import { connect } from 'react-redux';
import React from 'react';
import Debug from 'debug';
import PbplusMemberCenter from 'pbplus-member-sdk';
import AuthState from './AuthState.js';
import Header from './Header.react.js';
import '../css/app.less';

import BasePicture from '../img/lottery-0201.png';
import BasePictureMobile from '../img/lottery-mobile-0201.png';

Debug.disable();
if('production' != process.env.NODE_ENV) { Debug.enable('picture-campaign:*'); }

const basePicture = new Image();
basePicture.src = BasePicture;
const basePictureMobile = new Image();
basePictureMobile.src = BasePictureMobile;

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
    componentDidMount() {
        const { onLoadAction } = this.props;
        onLoadAction();
    }
    render() {
        const { campaignButtons } = this.props;
        return <div className='app'>
            <ConnectedHeader />
            <div className='content'>
                <div className='base-picture-wrapper'>
                    <img className='base-picture' src={BasePicture} />
                </div>
                <div className='base-picture-mobile-wrapper'>
                    <img className='base-picture-mobile' src={BasePictureMobile} />
                </div>
                <div className='campaign-buttons-wrapper'>
                    <div
                        className='campaign-buttons'
                        style={{width: basePicture.width}}
                    >
                        {campaignButtons.desktop.map((button, index) => {
                            return <div
                                className='campaign-button' key={index} role='button'
                                {...button.props}
                            >{button.content}</div>;
                        })}
                    </div>
                </div>
                <div className='campaign-buttons-mobile-wrapper'>
                    <div
                        className='campaign-buttons-mobile'
                        style={{width: basePictureMobile.width}}
                    >
                        {campaignButtons.mobile.map((button, index) => {
                            return <div
                                className='campaign-button' key={index} role='button'
                                {...button.props}
                            >{button.content}</div>;
                        })}
                    </div>
                </div>
            </div>
            <div className='pbplus-member-center-wrapper'>
                <PbplusMemberCenter.Container />
            </div>
        </div>;
    }
}

export default App;
