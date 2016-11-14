/**
 *
 * @author keyy/1501718947@qq.com 16/11/8 15:27
 * @description
 */
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import configureStore from './store/ConfigureStore';
import App from './containers/App';

const store = configureStore();

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

export default Root;
