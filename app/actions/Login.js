/**
 *
 * @author keyy/1501718947@qq.com 16/11/15 15:07
 * @description
 */
import * as ActionTypes from './ActionTypes'
import {postFetch, getFetch} from '../utils/NetUtil'

export function getDict(data,resolve,reject) {
  return (dispatch)=> {
    postFetch('/dict/all', data, dispatch, {type: ActionTypes.FETCH_BEGIN}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function getSmsCode(data, resolve, reject) {
  return (dispatch)=> {
    postFetch('/device', data, dispatch, {type: ActionTypes.FETCH_VALID_CODE}, {type: ActionTypes.RECEIVE_VALID_CODE}, {type: ActionTypes.RECEIVE_VALID_CODE}, resolve, reject);
  }
}

export function validSmsCode(data,resolve,reject) {
  return (dispatch)=> {
    postFetch('/device/'+data+'', data, dispatch, {type: ActionTypes.FETCH_BEGIN}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}