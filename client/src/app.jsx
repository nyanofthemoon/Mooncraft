'use strict';

require('./scss/app.scss');

import React    from 'react';
import ReactDOM from 'react-dom';

import App from './jsx/App';

ReactDOM.render(<App />, document.getElementById('app'));