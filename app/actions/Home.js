/**
 *
 * @author keyy/1501718947@qq.com 16/11/29 10:16
 * @description
 */
import * as ActionTypes from './ActionTypes'
import {postFetch, getFetch, putFetch} from '../utils/NetUtil'
import {toastShort} from '../utils/ToastUtil'

export function getPostList(data, resolve, reject) {
  return (dispatch)=> {
    getFetch('/post/getpostlist/', `${data.pageIndex}/${data.pageSize}/${data.Lat}/${data.Lng}`, dispatch, {type: ActionTypes.FETCH_BEGIN}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function like(data, resolve, reject) {
  return (dispatch)=> {
    putFetch(`/post/like/${data.postId}/${data.isLike}`, data, dispatch, {type: ActionTypes.FETCH_BEGIN}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}