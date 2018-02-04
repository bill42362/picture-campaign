// Utils.js
import fs from 'fs';
import Mime from 'mime';
import AWS from 'aws-sdk';

const srcPath = `${__dirname}/../../src/client`;
const distPath = `${__dirname}/../../dist/client`;

export const deployS3 = (s3) => {
    var deployTargets = [
        {sourcePath: `${srcPath}/html`, s3Folder: '', charset: '; charset=UTF-8'},
        {sourcePath: `${distPath}/js`, s3Folder: 'js/', charset: '; charset=UTF-8'},
        {sourcePath: `${distPath}/css`, s3Folder: 'css/', charset: '; charset=UTF-8'},
        {sourcePath: `${distPath}/img`, s3Folder: 'img/', charset: ''},
        {sourcePath: `${distPath}/img/icon`, s3Folder: 'img/icon/', charset: ''},
        {sourcePath: `${distPath}/fonts`, s3Folder: 'fonts/', charset: ''},
    ];
    deployTargets.forEach(function(target) {
        fs.readdir(target.sourcePath, function(err, filenames) {
            if(err) { console.log('readdir() err:', err); return; }
            filenames.forEach(function(filename) {
                var filepath = target.sourcePath + '/' + filename;
                fs.readFile(filepath, function(err, filedata) {
                    if(err) { console.log('readFile() err:', err); return; }
                    s3.upload(
                        {
                            Key: target.s3Folder + filename,
                            Body: filedata,
                            ContentType: Mime.lookup(filepath) + target.charset,
                            ServerSideEncryption: 'AES256'
                        },
                        function(error, response) {
                            if(err) { console.log('upload() err:', err, err.stack); return; }
                        }
                    );
                });
            });
        });
    });
};

AWS.config.loadFromPath('./aws.config.json');
const cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
export const CFPromise = ({ api, params }) => {
    return new Promise((resolve, reject) => {
        cloudformation[api](params, (error, data) => {
            if(error) { reject(error); }
            else { resolve(data); }
        });
    });
};

export default { deployS3 };
