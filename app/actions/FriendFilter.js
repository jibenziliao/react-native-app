/**
 *
 * @author keyy/1501718947@qq.com 16/11/26 21:35
 * @description
 */
import * as ActionTypes from './ActionTypes'
import {postFetch, getFetch} from '../utils/NetUtil'

export function saveFriendFilter(data,datingPurpose,resolve,reject) {
  let tmpDatingPurposeArr=[];
  if (datingPurpose.length > 0) {
    for (let i = 0; i < datingPurpose.length; i++) {
      tmpDatingPurposeArr.push(datingPurpose[i].Key);
    }
  }
  let params={
    AgeMin:data.minAge,
    AgeMax:data.maxAge,
    HeightMin:data.minHeight,
    HeightMax:data.maxHeight,
    Gender:data.gender,
    DatingPurpose:tmpDatingPurposeArr.join(','),
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