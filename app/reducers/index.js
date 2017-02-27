/**
 *
 * @author keyy/1501718947@qq.com 16/11/8 15:28
 * @description
 */
import {combineReducers} from 'redux'
import InitialApp from './InitialApp'
import Photo from './Photo'

const rootReducer = combineReducers({
  InitialApp,
  Photo
});

export default rootReducer;
