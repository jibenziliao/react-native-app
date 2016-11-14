/**
 *
 * @author keyy/1501718947@qq.com 16/11/8 17:35
 * @description
 */
import * as ActionTypes from '../actions/ActionTypes'

const initialState={
  pending:false
};

export default function init(state=initialState,action) {
  switch (action.type){
    case ActionTypes.APP_INITIAL_BEGIN:
      return{
        ...state,
        pending:true
      }
    default:
      return state;
  }
}