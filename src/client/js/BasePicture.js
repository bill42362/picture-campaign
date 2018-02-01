// BasePicture.js
'use strict';

import BasePicture0205 from '../img/lottery-0205.png';
import BasePicture0211 from '../img/lottery-0211.png';
import BasePicture0215 from '../img/lottery-0215.png';
import BasePicture0220 from '../img/lottery-0220.png';
import BasePictureMobile0205 from '../img/lottery-mobile-0205.png';
import BasePictureMobile0211 from '../img/lottery-mobile-0211.png';
import BasePictureMobile0215 from '../img/lottery-mobile-0215.png';
import BasePictureMobile0220 from '../img/lottery-mobile-0220.png';

const basePicture = new Image();
const basePictureMobile = new Image();

const Date20180205 = new Date(2018, 1, 5);
const Date20180211 = new Date(2018, 1, 11);
const Date20180215 = new Date(2018, 1, 15);
const Date20180220 = new Date(2018, 1, 20);
const Date20180228 = new Date(2018, 1, 28);
const now = Date.now();

if(Date20180205.getTime() <= now && now < Date20180211.getTime()) {
    basePicture.src = BasePicture0205;
    basePictureMobile.src = BasePictureMobile0205;
} else if(Date20180211.getTime() <= now && now < Date20180215.getTime()) {
    basePicture.src = BasePicture0211;
    basePictureMobile.src = BasePictureMobile0211;
} else if(Date20180215.getTime() <= now && now < Date20180220.getTime()) {
    basePicture.src = BasePicture0215;
    basePictureMobile.src = BasePictureMobile0215;
} else if(Date20180220.getTime() <= now && now < Date20180228.getTime()) {
    basePicture.src = BasePicture0220;
    basePictureMobile.src = BasePictureMobile0220;
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
