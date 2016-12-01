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
    getFetch('/post/getpostlist/', `${data.pageIndex}/${data.pageSize}/${data.Lat}/${data.Lng}`, dispatch, {type: ActionTypes.FETCH_BEGIN,data}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function like(data, resolve, reject) {
  return (dispatch)=> {
    putFetch(`/post/like/${data.postId}/${data.isLike}`, data, dispatch, {type: ActionTypes.FETCH_BEGIN,data}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function comment(data,resolve,reject) {
  return (dispatch)=> {
    postFetch(`/post/comment/${data.postId}?forCommentId=${data.forCommentId}`, {comment:data.comment}, dispatch, {type: ActionTypes.FETCH_BEGIN}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function getAnnouncementDetail(data,resolve,reject) {
  return (dispatch)=> {
    getFetch('/post/viewpost/',`${data.postId}/${data.Lat}/${data.Lng}`, dispatch, {type: ActionTypes.FETCH_BEGIN,data}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function getCommentList(data,resolve,reject) {
  return (dispatch)=> {
    getFetch('/post/getpostcommentlist/',`${data.postId}/${data.pageIndex}/${data.pageSize}/${data.Lat}/${data.Lng}`, dispatch, {type: ActionTypes.FETCH_BEGIN,data}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function getUserInfo(data,resolve,reject) {
  return (dispatch)=> {
    getFetch('/profiles/',`${data.UserId}`, dispatch, {type: ActionTypes.FETCH_BEGIN,data}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}