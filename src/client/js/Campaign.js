// Campaign.js
'use strict';

const getActions = (dispatch, state) => {
    return {
        login: () => { console.log('login()'); },
        openMemberCenter: () => { console.log('openMemberCenter()'); },
        fetchPoints: () => { console.log('fetchPoints()'); },
        draw: () => { console.log('draw()'); },
    };
};

export const getButtons = (dispatch, state) => {
    const { isUserLoggedIn } = state.authState;
    const { login, openMemberCenter, fetchPoints, draw } = getActions(dispatch, state);
    const buttons = [
        {
            rwd: 'desktop',
            props: {
                style: {
                    backgroundColor: 'rgba(128, 0, 128, 0.5)',
                    left: '74.6%', top: '30.8%', width: '11%', height: '1.2%'
                },
                onClick: isUserLoggedIn ? openMemberCenter : login,
            },
        },
        {
            rwd: 'desktop',
            props: {
                style: {
                    backgroundColor: 'rgba(128, 128, 0, 0.5)',
                    left: '51%', top: '59%', width: '35%', height: '9%'
                },
                onClick: isUserLoggedIn ? draw : login,
            },
        },
        {
            rwd: 'desktop',
            props: {
                style: {
                    backgroundColor: 'rgba(128, 128, 0, 0.5)',
                    left: '20.4%', top: '69.8%', width: '18.5%', height: '2.3%'
                },
                onClick: isUserLoggedIn ? fetchPoints : login,
            },
        },
        {
            rwd: 'desktop',
            props: {
                style: {
                    backgroundColor: 'rgba(128, 128, 0, 0.5)',
                    left: '60.5%', top: '69.8%', width: '18.5%', height: '2.3%'
                },
                onClick: isUserLoggedIn ? draw : login,
            },
        },
    ];
    return {
        desktop: buttons.filter(button => 'desktop' === button.rwd),
        mobile: buttons.filter(button => 'mobile' === button.rwd),
    };
};

export default { getButtons };
