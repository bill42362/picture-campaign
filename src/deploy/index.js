// index.js
import { deployS3 } from './Utils.js';
import AWS from 'aws-sdk';

AWS.config.loadFromPath('./aws.config.json');

deployS3(new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: 'picture-campaign'}
}));
