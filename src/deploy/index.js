// index.js
var fs = require('fs');
var AWS = require('aws-sdk');
var Mime = require('mime');

const srcPath = `${__dirname}/../../src/client`;
const distPath = `${__dirname}/../../dist/client`;
const deployS3 = (s3) => {
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
deployS3(new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: 'picture-campaign'}
}));
