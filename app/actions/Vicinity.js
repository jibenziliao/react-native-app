/**
 *
 * @author keyy/1501718947@qq.com 16/11/15 14:13
 * @description
 */
import * as ActionTypes from './ActionTypes'
import {URL_DEV} from '../constants/Constant'
import {toastShort} from '../utils/ToastUtil'
import {postFetch, getFetch, putFetch, deleteFetch} from '../utils/NetUtil'

function fetchOptions(data) {
  return {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
}

export function saveCoordinate(data,resolve,reject) {
  return (dispatch)=> {
    dispatch({type: ActionTypes.FETCH_BEGIN_QUIET, data});
    fetch(URL_DEV + '/profile/ping', fetchOptions(data))
      .then(response=>response.json())
      .then(json=> {
        dispatch({type: ActionTypes.FETCH_END_QUIET, data, json});
        if ('OK' !== json.Code) {
          toastShort(json.Message);
        }
      }).catch((err)=> {
      dispatch({type: ActionTypes.FETCH_FAILED_QUIET, data, err});
      toastShort('网络发生错误,请重试')
    })
  };
}

export function saveLocation(data,resolve,reject) {
  return (dispatch)=> {
    postFetch('/profile/ping', data, dispatch, {type: ActionTypes.FETCH_BEGIN_QUIET}, {type: ActionTypes.FETCH_END_QUIET}, {type: ActionTypes.FETCH_FAILED_QUIET}, resolve, reject);
  }
}