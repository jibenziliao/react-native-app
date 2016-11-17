/**
 *
 * @author keyy/1501718947@qq.com 16/11/15 14:13
 * @description
 */
import * as ActionTypes from './ActionTypes'
import {URL_DEV} from '../constants/Constant'
import {toastShort} from '../utils/ToastUtil'
import {Actions} from 'react-native-router-flux'

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

function fetchOptionsGet() {
  return {
    method: 'GET'
  }
}

export function searchNearby(data) {
  return (dispatch)=> {
    dispatch(fetchUserNearby(data));
    fetch(URL_DEV + '/contacts/nearby', fetchOptions(data.params))
      .then(response => response.json())
      .then(json => {
        dispatch(receiveUserNearby(data, json));
        if ('OK' !== json.Code) {
          toastShort(json.Message);
        }
      }).catch((err)=> {
      dispatch(receiveUserNearby(data, err));
      toastShort('网络发生错误,请重试')
    })
  }
}

export function saveCoordinate(data) {
  return (dispatch)=> {
    dispatch({type: ActionTypes.SAVE_USER_COORDINATE_BEGIN, data});
    fetch(URL_DEV + '/profile/ping', fetchOptions(data))
      .then(response=>response.json())
      .then(json=> {
        dispatch({type: ActionTypes.SAVE_USER_COORDINATE_END, data, json});
        if ('OK' !== json.Code) {
          toastShort(json.Message);
        }
      }).catch((err)=> {
      dispatch({type: ActionTypes.SAVE_USER_COORDINATE_END, data, err});
      toastShort('网络发生错误,请重试')
    })
  }
}

export function fetchUserInfo(data) {
  return (dispatch)=>{
    dispatch({type:ActionTypes.FETCH_USER_DETAIL_INFO,data});
    fetch(URL_DEV+'/profiles/'+data,fetchOptionsGet())
      .then(response=>response.json())
      .then(json=>{
        dispatch({type:ActionTypes.RECEIVE_USER_DETAIL_INFO,data,json});
        if('OK'!==json.Code){
          toastShort(json.Message);
        }else{
          Actions.userInfo({userInfo:{
            ...json.Result,
            UserId:data
          }});
        }
      }).catch((err)=>{
      dispatch({type:ActionTypes.RECEIVE_USER_DETAIL_INFO,data,err});
      toastShort('网络发生错误,请重试')
    })
  }
}

function fetchUserNearby(data) {
  return {
    type: ActionTypes.FETCH_USER_NEARBY,
    data
  }
}

function receiveUserNearby(data, json) {
  return {
    type: ActionTypes.RECEIVE_USER_NEARBY,
    data,
    json
  }
}