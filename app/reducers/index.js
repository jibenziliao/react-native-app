/**
 *
 * @author keyy/1501718947@qq.com 16/11/8 15:28
 * @description
 */
import {combineReducers} from 'redux'
import InitialApp from './InitialApp'
import Vicinity from './Vicinity'
import UserProfile from './UserProfile'
import Login from './Login'

const rootReducer = combineReducers({
  InitialApp,
  Vicinity,
  UserProfile,
  Login
});

export default rootReducer;
