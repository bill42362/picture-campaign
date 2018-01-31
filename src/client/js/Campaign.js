// Campaign.js
'use strict';
import React from 'react';
import PbplusMemberCenter from 'pbplus-member-sdk';
import Debug from 'debug';

import '../css/campaign.less';
import DrawResultJackpot from '../img/draw_result_jackpot.png';
import DrawResultNotWinning from '../img/draw_result_not_winning.png';

Debug.disable();
if('production' != process.env.NODE_ENV) { Debug.enable('picture-campaign:*'); }

const getActions = (dispatch, state) => {
    const loginEndpoint = `${state.authState.endpoint}&token_id=${state.pbplusMemberCenter.userUuid}`;
    return {
        login: () => { location = loginEndpoint; },
        openMemberCenter: () => dispatch(PbplusMemberCenter.Actions.display()),
        fetchPoints: () => {
            return dispatch(fetchPoints())
            .then(() => dispatch(updateCampaignState({campaignState: {isPointsFetched: true}})));
        },
        draw: () => { return dispatch(draw()); },
    };
};

export const getButtons = (dispatch, state) => {
    const { isUserLoggedIn } = state.authState;
    const { isPointsFetched, points } = state.campaign;
    const { login, openMemberCenter, fetchPoints, draw } = getActions(dispatch, state);
    const loginEndpoint = `${state.authState.endpoint}&token_id=${state.pbplusMemberCenter.userUuid}`;
    const buttons = [
        {
            rwd: 'desktop',
            props: {
                style: {left: '74.6%', top: '30.8%', width: '11%', height: '1.2%'},
            },
            content: <a className='join' href='http://x.pbplus.me/point/' title='加入點數計畫' />,
        },
        {
            rwd: 'desktop',
            props: {
                style: {left: '51%', top: '59%', width: '35%', height: '9%'},
                onClick: isUserLoggedIn ? draw : login,
            },
        },
        {
            rwd: 'desktop',
            props: {
                style: {left: '20.4%', top: '69.8%', width: '18.5%', height: '2.3%'},
                onClick: isUserLoggedIn ? fetchPoints : login,
            },
            content: isUserLoggedIn
                ? isPointsFetched
                    ? <div className='points'>
                        <span className='points-title'>目前</span>
                        <span className='points-number'>{points}</span>
                        <span className='points-title'>點</span>
                    </div>
                    : <div className='fetch-points'>查看點數</div>
                : <a className='login' href={loginEndpoint} title='查看點數'>查看點數</a>,
        },
        {
            rwd: 'desktop',
            props: {
                style: {left: '60.5%', top: '69.8%', width: '18.5%', height: '2.3%'},
                onClick: isUserLoggedIn ? draw : login,
            },
            content: <div className='draw' title='點擊抽獎'>點擊抽獎</div>,
        },
        {
            rwd: 'mobile',
            props: {
                style: {left: '71.4%', top: '29.9%', width: '19.4%', height: '1.3%'},
            },
            content: <a className='join' href='http://x.pbplus.me/point/' title='加入點數計畫' />,
        },
        {
            rwd: 'mobile',
            props: {
                style: {left: '20%', top: '75%', width: '58%', height: '8%'},
                onClick: isUserLoggedIn ? draw : login,
            },
        },
        {
            rwd: 'mobile',
            props: {
                style: {left: '31%', top: '59.3%', width: '34%', height: '2.5%'},
                onClick: isUserLoggedIn ? fetchPoints : login,
            },
            content: isUserLoggedIn
                ? isPointsFetched
                    ? <div className='points'>
                        <span className='points-title'>目前</span>
                        <span className='points-number'>{points}</span>
                        <span className='points-title'>點</span>
                    </div>
                    : <div className='fetch-points'>查看點數</div>
                : <a className='login' href={loginEndpoint} title='查看點數'>查看點數</a>,
        },
        {
            rwd: 'mobile',
            props: {
                style: {left: '31%', top: '84.6%', width: '34%', height: '2.5%'},
                onClick: isUserLoggedIn ? draw : login,
            },
            content: <div className='draw' title='點擊抽獎'>點擊抽獎</div>,
        },
    ];
    return {
        desktop: buttons.filter(button => 'desktop' === button.rwd),
        mobile: buttons.filter(button => 'mobile' === button.rwd),
    };
};

const defaultState = {
    isPointsFetched: false, points: 0,
    drawResult: undefined, drawResultImage: undefined, drawResultContents: []
};

const Reducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'UPDATE_CAMPAIGN_STATE':
            return Object.assign({}, state, action.payload.campaignState);
            break;
        default:
            return state;
    }
}

const updateCampaignState = ({ campaignState }) => {
    return {type: 'UPDATE_CAMPAIGN_STATE', payload: { campaignState }};
};

const fetchPoints = () => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    return fetch(`${process.env.MEMBER_CENTER_BASE_URL}/points`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ uuid })
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        if(200 === response.status) {
            const { points } = response.message;
            dispatch(updateCampaignState({campaignState: { points }}));
            return { points };
        }
        else { throw new Error('Bad response from server'); }
    })
    .catch(error => { Debug('picture-campaign:Campaign')('fetchPoints()', JSON.stringify(error)); });
}; };

const draw = () => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    return fetch(`${process.env.API_BASE_URL}/campaign/draw_201802`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ uuid })
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        if(200 === response.status) {
            // 中獎
            return dispatch(updateCampaignState({campaignState: {
                drawResult: 'jackpot',
                drawResultImage: DrawResultJackpot,
                drawResultContents: [
                    {
                        props: {
                            style: {
                                left: '20%', top: '37%', width: '80%', height: '8%', fontSize: '34px', textAlign: 'left'
                            },
                        },
                        content: <div className='draw-result-award'>
                            「
                            <span className='draw-result-award-name'>{response.message}</span>
                            」乙份
                        </div>,
                    },
                    {
                        props: {
                            style: {
                                left: '69.5%', top: '81.5%', width: '17.5%', height: '7%', fontSize: '32px', cursor: 'pointer'
                            },
                            onClick: () => {
                                dispatch(PbplusMemberCenter.Actions.updateActiveTab({activeTab: 'personal-data'}));
                                return dispatch(PbplusMemberCenter.Actions.display());
                            },
                        },
                    },
                ],
            }}));
        }
        else if(601 === response.status) {
            // 非活動時間
            return dispatch(updateCampaignState({campaignState: {
                drawResult: 'not_campaign_time',
            }}));
        }
        else if(602 === response.status) {
            // 點數不足
            return dispatch(updateCampaignState({campaignState: {drawResult: 'insufficient_points'}}));
        }
        else if(603 === response.status) {
            // 沒中
            return dispatch(updateCampaignState({campaignState: {
                drawResult: 'not_winning',
                drawResultImage: DrawResultNotWinning,
                drawResultContents: [],
            }}));
        }
        else {
            return dispatch(updateCampaignState({campaignState: {drawResult: 'something_go_wrong'}}));
        }
    })
    .then(() => dispatch(fetchPoints()))
    .catch(error => { Debug('picture-campaign:Campaign')('onLoadAction()', JSON.stringify(error)); });
}; };

const onLoadAction = () => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
    return fetch(`${process.env.API_BASE_URL}/campaign/new_member_add_points_201802`, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ uuid })
    })
    .then(response => {
        if(response.status >= 400) { throw new Error('Bad response from server'); }
        return response.json();
    })
    .then(response => {
        if(200 === response.status) { return response; }
        else { throw new Error('Bad response from server'); }
    })
    .catch(error => { Debug('picture-campaign:Campaign')('onLoadAction()', JSON.stringify(error)); });
}; };

const Actions = { updateCampaignState, onLoadAction };

export default { getButtons, Reducer, Actions };
