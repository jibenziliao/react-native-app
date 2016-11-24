/**
 *
 * @author keyy/1501718947@qq.com 16/11/15 15:07
 * @description
 */
import * as ActionTypes from './ActionTypes'
import {URL_DEV} from '../constants/Constant'
import {toastShort} from '../utils/ToastUtil'
import {Actions} from 'react-native-router-flux'
import * as UserProfileActions from './UserProfile'
import * as Storage from '../utils/Storage'
import MainContainer from '../containers/MainContainer'
import UserProfile from '../pages/UserProfile'
import Home from '../containers/Home'

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

export function getValidCode(data) {
  return (dispatch)=> {
    dispatch(requestValidCode(data));
    fetch(URL_DEV + '/device', fetchOptions(data))
      .then(response => response.json())
      .then(json => {
        dispatch(receiveValidCode(data, json));
        if ('OK' !== json.Code) {
          toastShort(json.Message);
        } else {
          let cacheData = {
            mobile: data.Mobile,
            country: data.Country,
            smsHasValid: false
          };
          Storage.setItem('user', cacheData);
        }
      }).catch((err)=> {
      dispatch(receiveValidCode(err));
      toastShort('网络发生错误,请重试')
    })
  };
}

export function validCode(data, navigator) {
  return (dispatch)=> {
    dispatch(beginValidCode(data));
    fetch(URL_DEV + '/device/' + data, fetchOptions(data))
      .then(response => response.json())
      .then(json => {
        dispatch(endValidCode(data, json));
        if ('OK' !== json.Code) {
          toastShort(json.Message);
        } else {
          Storage.getItem('user').then((response)=> {
            response.smsHasValid = true;
            Storage.setItem('user', response);
          });

          if(json.Result===false){
            navigator.push({
              component: UserProfile,
              name: 'UserProfile'
            });
          }else{
            navigator.push({
              component: Home,
              name: 'Home'
            });
          }
        }
      }).catch((err)=> {
      dispatch(endValidCode(err));
      toastShort('网络发生错误,请重试')
    })
  };
}

function requestValidCode(data) {
  return {
    type: ActionTypes.FETCH_VALID_CODE,
    data
  }
}

function receiveValidCode(data, json) {
  return {
    type: ActionTypes.RECEIVE_VALID_CODE,
    data,
    json
  }
}

function beginValidCode(data) {
  return {
    type: ActionTypes.VALID_CODE_BEGIN,
    data
  }
}

function endValidCode(data, json) {
  return {
    type: ActionTypes.VALID_CODE_END,
    data,
    json
  }
}