/**
 *
 * @author keyy/1501718947@qq.com 16/11/25 17:45
 * @description
 */
import * as ActionTypes from '../actions/ActionTypes'

const initialState={
  res:null,
  download:null,
  pending:false
};
export default function takePhoto(state=initialState,action) {
  switch (action.type){
    case ActionTypes.UPLOAD_PHOTO_BEGIN:
      return{
        ...state,
        pending:true
      };
    case ActionTypes.UPLOAD_PHOTO_END:
      return {
        ...state,
        res:action,
        pending:false
      };
    case ActionTypes.UPLOAD_PHOTO_FAILED:
      return {
        ...state,
        res:action,
        pending:false
      };
    default:
      return state;
  }
}