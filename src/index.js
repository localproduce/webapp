import React from 'react';
import ReactDOM from 'react-dom';
import Frontpage from './pages/frontpage';
import Produce from './pages/produce';

import './reset.css';
import './global.css';

ReactDOM.render(
  <React.StrictMode>
    <Frontpage />
    <Produce />
  </React.StrictMode>,
  document.getElementById('root')
);
