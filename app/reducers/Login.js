/**
 *
 * @author keyy/1501718947@qq.com 16/11/15 15:09
 * @description
 */
import * as ActionTypes from '../actions/ActionTypes'

const initialState={
  hasSendValidCode:false,
  hasValid:false,
  res:null,
  pending:false
};
export default function getValidCode(state=initialState,action) {
  switch (action.type){
    case ActionTypes.FETCH_VALID_CODE:
      return {
        ...state,
        pending:true
      };
    case ActionTypes.RECEIVE_VALID_CODE:
      return {
        ...state,
        hasSendValidCode:true,
        res:action,
        pending:false
      };
    case ActionTypes.VALID_CODE_BEGIN:
      return {
        ...state,
        pending:true
      };
    case ActionTypes.VALID_CODE_END:
      return {
        ...state,
        hasValid:true,
        res:action,
        pending:false
      };
    default:
      return state;
  }
}