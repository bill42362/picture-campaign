// BasePicture.js
'use strict';

import BasePicture0205 from '../img/lottery-0201.png';
import BasePictureMobile0205 from '../img/lottery-mobile-0201.png';
import BasePicture0211 from '../img/lottery-0211.png';
import BasePictureMobile0211 from '../img/lottery-mobile-0211.png';

const basePicture = new Image();
const basePictureMobile = new Image();

const Date20180205 = new Date(2018, 1, 5);
const Date20180211 = new Date(2018, 1, 11);
const Date20180221 = new Date(2018, 1, 21);
const now = Date.now();

if(Date20180205.getTime() < now && now < Date20180211.getTime()) {
    basePicture.src = BasePicture0205;
    basePictureMobile.src = BasePictureMobile0205;
} else if(Date20180211.getTime() < now && now < Date20180221.getTime()) {
    basePicture.src = BasePicture0211;
    basePictureMobile.src = BasePictureMobile0211;
} else {
    basePicture.src = BasePicture0205;
    basePictureMobile.src = BasePictureMobile0205;
}

export const BasePicture = basePicture;
export const BasePictureMobile = basePictureMobile;
export default {
    BasePicture: basePicture,
    BasePictureMobile0201: basePictureMobile
};
