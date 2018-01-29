// Utils.js
'use strict';
import CryptoCore from 'crypto-js/core';
import HmacSha512 from 'crypto-js/hmac-sha512';
import AES from 'crypto-js/aes';

const AES_SALT = 'miyalovelovelove';
export const getCheckerHash = ({ target = '' }) => HmacSha512(target, 'facepalm cat').toString();
export const aesEncrypt = ({ target = '' }) => AES.encrypt(target, AES_SALT).toString();
export const aesDecrypt = ({ target = '' }) => AES.decrypt(target, AES_SALT).toString(CryptoCore.enc.Utf8);

export const validateValue = ({ value, updateStatus, validators }) => { return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        let resolvePromise = new Promise(resolve => { resolve(); });
        if(0 !== validators.length) {
            resolvePromise = resolvePromise
            .then(dispatch(updateStatus({isPassed: false, status: 'checking', info: ''})));
            validators.forEach(validator => {
                resolvePromise = resolvePromise
                .then(() => validator({ value, state: getState()}))
                .then(({ isPassed, status, info }) => {
                    if(!isPassed) {
                        throw { isPassed, status, info };
                    } else {
                        return { isPassed, status, info };
                    }
                });
            });
        } else {
            resolvePromise = resolvePromise
            .then(() => { return {isPassed: true, status: 'success', info: ''}; });
        }
        resolvePromise
        .then(({ isPassed, status, info }) => {
            dispatch(updateStatus({ isPassed, status, info }));
            resolve({ value });
        })
        .catch(reason => {
            if(!reason.status) {
                dispatch(updateStatus({isPassed: false, status: 'danger', info: 'Error'}));
            } else {
                dispatch(updateStatus(reason));
            }
            reject(reason);
        });
    });
}; };

export const getUrlSearches = () => {
    const result = {};
    const searches = window.location.search.slice(1).split('&').filter(search => search);
    searches.forEach(search => {
        const pair = search.split('=');
        result[pair[0]] = pair[1];
    });
    return result;
}

export const makeSearchString = (search) => {
    const searchKeys = Object.keys(search);
    if(0 === searchKeys.length) { return ''; }
    return searchKeys.map(key => `${key}=${search[key]}`).join('&');
}
