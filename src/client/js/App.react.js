// App.react.js
'use strict';
import { connect } from 'react-redux';
import React from 'react';
import Debug from 'debug';
import '../css/app.less';

Debug.disable();
if('production' != process.env.NODE_ENV) { Debug.enable('picture-campaign:*'); }

class App extends React.Component {
    constructor(props) { super(props); }
    render() {
        const { } = this.props;
        return <div className='app'>
            pb+ lottery
        </div>;
    }
}

export default App;
