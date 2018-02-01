// Campaign.js
'use strict';
import React from 'react';
import Debug from 'debug';
import PbplusMemberCenter from 'pbplus-member-sdk';

import '../css/campaign.less';
import { BasePicture, BasePictureMobile } from './BasePicture.js';
import DrawResultJackpot from '../img/draw_result_jackpot.png';
import DrawResultNotWinning from '../img/draw_result_not_winning.png';
import DrawResultInsufficientPoints from '../img/draw_result_insufficient_points.png';
import DrawResultNotCampaignTime from '../img/draw_result_something_go_wrong.png';
import DrawResultSomethingGoWrong from '../img/draw_result_something_go_wrong.png';

Debug.disable();
if('production' != process.env.NODE_ENV) { Debug.enable('picture-campaign:*'); }

const defaultDrawStates = {
    drawResult: undefined,
    drawResultImage: undefined,
    drawResultContents: [],
};
const defaultState = Object.assign({}, defaultDrawStates, {
    basePicture: BasePicture, basePictureMobile: BasePictureMobile,
    isPointsFetched: false, points: 0,
});

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
        return dispatch(updateCampaignState({campaignState: getDrawStates({ response, dispatch })}));
    })
    .then(() => dispatch(fetchPoints()))
    .catch(error => { Debug('picture-campaign:Campaign')('onLoadAction()', JSON.stringify(error)); });
}; };

const onLoadAction = () => { return (dispatch, getState) => {
    const { userUuid: uuid } = getState().pbplusMemberCenter;
}; };

const Actions = { updateCampaignState, onLoadAction };

const getDrawStates = ({ dispatch, response }) => {
    switch(response.status) {
        case 601:
            return Object.assign({}, defaultDrawStates, {
                drawResult: 'not_campaign_time',
                drawResultImage: DrawResultNotCampaignTime,
            });
            break;
        case 602:
            return Object.assign({}, defaultDrawStates, {
                drawResult: 'insufficient_points',
                drawResultImage: DrawResultInsufficientPoints,
            });
            break;
        case 603:
            return Object.assign({}, defaultDrawStates, {
                drawResult: 'not_winning',
                drawResultImage: DrawResultNotWinning,
            });
            break;
        case 200:
            return Object.assign({}, defaultDrawStates, {
                drawResult: 'jackpot',
                drawResultImage: DrawResultJackpot,
                drawResultContents: [
                    {
                        props: {
                            style: {
                                left: '10%', top: '34%', width: '80%', height: '8%',
                                color: '#535353', fontSize: '34px', textAlign: 'left',
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
                                left: '68.8%', top: '83%', width: '18%', height: '7%', cursor: 'pointer',
                            },
                            onClick: () => {
                                dispatch(PbplusMemberCenter.Actions.updateActiveTab({activeTab: 'personal-data'}));
                                return dispatch(PbplusMemberCenter.Actions.display());
                            },
                        },
                    },
                ],
            });
            break;
        default:
            return Object.assign({}, defaultDrawStates, {
                drawResult: 'something_go_wrong',
                drawResultImage: DrawResultSomethingGoWrong,
            });
            break;
    }
};

const getButtonActions = (dispatch, state) => {
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
    const { login, openMemberCenter, fetchPoints, draw } = getButtonActions(dispatch, state);
    const loginEndpoint = `${state.authState.endpoint}&token_id=${state.pbplusMemberCenter.userUuid}`;
    const joinButton = <a className='join' href='http://x.pbplus.me/point/' title='加入點數計畫' />;
    const chanceButton = <div className='draw' title='機會'>機會</div>;
    const destinyButton = <div className='draw' title='命運'>命運</div>;
    const pointButton = isUserLoggedIn
        ? isPointsFetched
            ? <div className='points'>
                <span className='points-title'>目前</span>
                <span className='points-number'>{points}</span>
                <span className='points-title'>點</span>
            </div>
            : <div className='fetch-points'>查看點數</div>
        : <a className='login' href={loginEndpoint} title='查看點數'>查看點數</a>;
    const buttons = [
        {
            rwd: 'desktop',
            props: {style: {left: '68.1%', top: '36.2%', width: '13%', height: '1.5%'}},
            content: joinButton,
        },
        {
            rwd: 'desktop',
            props: {
                style: {left: '20.4%', top: '69.8%', width: '18.5%', height: '2.3%'},
                onClick: isUserLoggedIn ? fetchPoints : login,
            },
            content: pointButton,
        },
        {
            rwd: 'desktop',
            props: {
                style: {left: '51%', top: '59%', width: '35%', height: '10%'},
                onClick: isUserLoggedIn ? draw : login,
            },
        },
        {
            rwd: 'desktop',
            props: {
                style: {left: '54.5%', top: '69.8%', width: '13.2%', height: '2.3%'},
                onClick: isUserLoggedIn ? draw : login,
            },
            content: chanceButton,
        },
        {
            rwd: 'desktop',
            props: {
                style: {left: '70.8%', top: '69.8%', width: '13.2%', height: '2.3%'},
                onClick: isUserLoggedIn ? draw : login,
            },
            content: destinyButton,
        },
        {
            rwd: 'mobile',
            props: {style: {left: '68.7%', top: '29.37%', width: '19.5%', height: '1.31%'}},
            content: joinButton,
        },
        {
            rwd: 'mobile',
            props: {
                style: {left: '31%', top: '59.3%', width: '34%', height: '2.5%'},
                onClick: isUserLoggedIn ? fetchPoints : login,
            },
            content: pointButton,
        },
        {
            rwd: 'mobile',
            props: {
                style: {left: '20%', top: '74%', width: '57%', height: '10%'},
                onClick: isUserLoggedIn ? draw : login,
            },
        },
        {
            rwd: 'mobile',
            props: {
                style: {left: '22%', top: '84.6%', width: '23%', height: '2.5%'},
                onClick: isUserLoggedIn ? draw : login,
            },
            content: chanceButton,
        },
        {
            rwd: 'mobile',
            props: {
                style: {left: '50.8%', top: '84.6%', width: '23%', height: '2.5%'},
                onClick: isUserLoggedIn ? draw : login,
            },
            content: destinyButton,
        },
    ];
    return {
        desktop: buttons.filter(button => 'desktop' === button.rwd),
        mobile: buttons.filter(button => 'mobile' === button.rwd),
    };
};

export default { getButtons, Reducer, Actions };
