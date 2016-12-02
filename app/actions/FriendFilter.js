/**
 *
 * @author keyy/1501718947@qq.com 16/11/26 21:35
 * @description
 */
import * as ActionTypes from './ActionTypes'
import {postFetch, getFetch} from '../utils/NetUtil'

export function saveFriendFilter(data,resolve,reject) {
  let params={
    AgeMin:data.minAge,
    AgeMax:data.maxAge,
    HeightMin:data.minHeight,
    HeightMax:data.maxHeight,
    Gender:data.gender,
    PhotoOnly:data.photoOnly
  };

  return(dispatch)=>{
    postFetch('/profile/filter', params, dispatch,
      {type: ActionTypes.FETCH_BEGIN},
      {type: ActionTypes.FETCH_END},
      {type: ActionTypes.FETCH_FAILED},
      resolve,
      reject
    );
  }
}