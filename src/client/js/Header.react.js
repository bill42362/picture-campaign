// Header.react.js
'use strict';
import { connect } from 'react-redux';
import React from 'react';
import HeaderBar from 'header-bar';
import '../css/header.less';

import HamburgerIcon from '../img/hamburger.svg';
import XIcon from '../img/icon_x.svg';
import Logo from '../img/logo.svg';
import FacebookIcon from '../img/facebook.svg';
import YoutubeIcon from '../img/youtube.svg';
import LineIcon from '../img/line.svg';
import EarthIcon from '../img/earth_icon.png';
import PeopleIcon from '../img/people_icon.png';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }
    logout(e) {
        e.preventDefault(); e.stopPropagation();
        if(this.props.logout) { this.props.logout(); }
        return false;
    }
    render() {
        const {
            headerAnnounces,
            isUserLoggedIn, loginEndpoint, displayPbplusMemberCenter
        } = this.props;
        let authButton = <div data-button={true}>
            <a href={loginEndpoint} title='login' role='button'>登入</a>
        </div>;
        if(isUserLoggedIn) {
            authButton = <div data-button={true}>
                <a href='#' title='logout' role='button' onClick={this.logout}>登出</a>
            </div>;
        }
        return <div className='header'>
            <HeaderBar
                hamburger={{src: HamburgerIcon, title: 'Menu'}}
                menuCloser={{src: XIcon, title: 'Close menu'}}
            >
                <a href='//tw.pbplus.me' target='_self' data-logo={true}><img src={Logo} title='Home'/></a>
                <a
                    href='//www.facebook.com/pbplus.me/' target='_blank'
                    data-subnav={true} data-color='rgb(62, 86, 155)'
                ><img src={FacebookIcon}/></a>
                <a
                    href='//www.youtube.com/channel/UCgoWlpZfUggQ3CLzrTqtkGw' target='_blank'
                    data-subnav={true} data-color='rgb(229, 26, 0)'
                ><img src={YoutubeIcon}/></a>
                <a
                    href='https://line.me/R/ti/p/%40kav1208b' target='_blank'
                    data-subnav={true} data-color='rgb(0, 181, 9)'
                ><img src={LineIcon}/></a>
                <div data-submenu_button={true} data-submenu_key='announce' data-submenu_type='list'>
                    <img src={EarthIcon} style={{height: '1.4em', borderRadius: '0.7em'}}/>
                </div>
                <div data-submenu_item={true} data-submenu_key='announce' data-submenu_position='header'>
                    <div>公告</div>
                </div>
                {headerAnnounces.map((announce, index) => {
                    return <div data-submenu_item={true} data-submenu_key='announce' key={index}>
                        <div className='announce'>
                            <div className='announce-title'>{announce.title}</div>
                            <div className='announce-content'>{announce.content}</div>
                        </div>
                    </div>;
                })}
                {isUserLoggedIn ? <a data-subnav={true} data-color='dimgray' style={{cursor: 'pointer'}}>
                    <img title='使用者中心' src={PeopleIcon} role='button' onClick={displayPbplusMemberCenter} />
                </a> : <span />}
                {authButton}
            </HeaderBar>
        </div>;
    }
}

export default Header;
