/**
 *
 * @author keyy/1501718947@qq.com 16/11/15 15:08
 * @description
 */
import * as ActionTypes from '../actions/ActionTypes'

const initialState={
  res:null,
  idGen:0,
  images:{},
  pending:false
};
export default function getUserProfile(state=initialState,action) {
  switch (action.type){
    case ActionTypes.FETCH_USER_PROFILE:
      return {
        ...state,
        res:action,
        pending:true
      };
    case ActionTypes.RECEIVE_USER_PROFILE:
      return {
        ...state,
        res:action.json,
        pending:false
      };
    case ActionTypes.FETCH_SAVE_USER_PROFILE:
      return {
        ...state,
        pending:true,
      };
    case ActionTypes.RECEIVE_SAVE_USER_PROFILE:
      return {
        ...state,
        pending:false,
        res:action
      };
    default:
      return state;
  }
}