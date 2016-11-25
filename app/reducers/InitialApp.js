/**
 *
 * @author keyy/1501718947@qq.com 16/11/8 17:35
 * @description
 */
import * as ActionTypes from '../actions/ActionTypes'

const initialState = {
  hasInitial: false,
  pending: false,
};
export default function initialApp(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.APP_INITIAL_BEGIN:
      return {
        ...state,
        pending: true
      };
    case ActionTypes.APP_INITIAL_END:
      return {
        ...state,
        hasInitial: true,
        res: action,
        pending: false
      };
    case ActionTypes.FETCH_BEGIN:
      return {
        ...state,
        pending: true
      };
    case ActionTypes.FETCH_END:
      return {
        ...state,
        res: action,
        pending: false
      };
    case ActionTypes.FETCH_FAILED:
      return {
        ...state,
        res: action,
        pending: false
      };
    case ActionTypes.GET_ITEM_BEGIN:
      return {
        ...state,
        pending: false
      };
    case ActionTypes.GET_ITEM_END:
      return {
        ...state,
        res: action,
        pending: false
      };
    case ActionTypes.GET_ITEM_FAILED:
      return {
        ...state,
        res: action,
        pending: false
      };
    default:
      return state;
  }
}