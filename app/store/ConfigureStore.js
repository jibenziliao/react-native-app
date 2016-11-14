/**
 *
 * @author keyy/1501718947@qq.com 16/11/8 15:27
 * @description
 */
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';
import createLogger from 'redux-logger';

const middlewares = [thunk];

if (process.env.NODE_ENV === 'development') {
  const logger = createLogger();
  middlewares.push(logger);
}
// const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

const enhancer = compose(
  applyMiddleware(...middlewares)
);
export default function configureStore(initialState) {
  // const store = createStoreWithMiddleware(rootReducer, initialState);
  // Note: passing enhancer as last argument requires redux@>=3.1.0
  const store = createStore(rootReducer, initialState, enhancer);
  // If you have other enhancers & middlewares
  return store;
}
