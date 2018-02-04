// formation.js
import Template from './template.json';
import { CFPromise } from './Utils.js';
import AWS from 'aws-sdk';
import Debug from 'debug';

Debug.enable('picture-campaign:*');
AWS.config.loadFromPath('./aws.config.json');

const cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});
const stackName = 'formation-test';

const validateParams = {
    TemplateBody: JSON.stringify(Template),
};
const createParams = {
    StackName: stackName,
    TemplateBody: JSON.stringify(Template),
    TimeoutInMinutes: 10,
    /*
    Parameters: [
        {
            ParameterKey: 'stackName',
            ParameterValue: stackName,
        },
    ],
     */
};
const deleteParams = {
    StackName: stackName,
};

CFPromise({api: 'validateTemplate', params: validateParams})
.then(data => {
    Debug('picture-campaign:validateTemplate success')(JSON.stringify(data));
    return CFPromise({api: 'createStack', params: createParams})
})
.then(data => {
    Debug('picture-campaign:createStack success')(JSON.stringify(data));
})
.catch(error => { Debug('picture-campaign:formation error')(JSON.stringify(error)); });

/*
CFPromise({api: 'deleteStack', params: deleteParams})
.then(data => {
    Debug('picture-campaign:deleteStack success')(JSON.stringify(data));
})
.catch(error => { Debug('picture-campaign:formation error')(JSON.stringify(error)); });
 */
