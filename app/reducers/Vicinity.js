/**
 *
 * @author keyy/1501718947@qq.com 16/11/15 14:53
 * @description
 */
import * as ActionTypes from '../actions/ActionTypes'

const initialState = {
  pending: false,
  asyncCoordinating:false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.SAVE_USER_COORDINATE_BEGIN:
      return {
        ...state,
        res: action,
        pending: true,
        asyncCoordinating:true
      };
    case ActionTypes.SAVE_USER_COORDINATE_END:
      return {
        ...state,
        res: action,
        pending: false,
        asyncCoordinating:false
      };
    case ActionTypes.FETCH_USER_NEARBY:
      return {
        ...state,
        res: action,
        pending: true
      };
    case ActionTypes.RECEIVE_USER_NEARBY:
      return {
        ...state,
        res: action,
        pending: false
      };
    case ActionTypes.FETCH_USER_DETAIL_INFO:
      return {
        ...state,
        res:action,
        pending:true
      };
    case ActionTypes.RECEIVE_USER_DETAIL_INFO:
      return {
        ...state,
        res:action,
        pending:false
      };
    default:
      return state
  }
}