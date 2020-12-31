import React from 'react';
import './App.less';
import {rootRoutes} from './router/routers';
import {HashRouter as Router} from 'react-router-dom';
import {renderRoutes} from 'react-router-config';
import {Provider} from 'react-redux';
import store from './store';

function App() {
  return (
      <div className="App">
        <Provider store={store}>
          <Router>
            {renderRoutes(rootRoutes)}
          </Router>
        </Provider>
      </div>
  );
}

export default App;
