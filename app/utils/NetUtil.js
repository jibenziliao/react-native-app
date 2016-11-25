/**
 *
 * @author keyy/1501718947@qq.com 16/11/24 11:46
 * @description
 */
import {URL_DEV, TIME_OUT} from '../constants/Constant'
import {toastShort} from '../utils/ToastUtil'

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

function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Timeout Error'));
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  })
}

export function postFetch(url, data, dispatch, fetchReq, receive, error, resolveFn, rejectFn) {
  dispatch({...fetchReq, data});
  fetch(URL_DEV + url, fetchOptions(data))
    .then(response => response.json())
    .then((json) => {
      if ('OK' != json.Code) {
        dispatch({...error, data, json});
        toastShort(json.Message);
        rejectFn(json);
      } else {
        dispatch({...receive, data, json});
        resolveFn(json);
      }
    })
    .catch((error) => {
      toastShort('网络发生错误,请重试');
      dispatch({...error, error});
      rejectFn(error);
    });
}

export function getFetch(url, data, dispatch, fetchReq, receive, error, resolveFn, rejectFn) {
  dispatch(fetchReq);
  timeoutPromise(TIME_OUT, fetch(URL_DEV + url + data + '', fetchOptionsGet())).then(response => response.json())
    .then((json) => {
      if ('OK' != json.Code) {
        dispatch({...error, json});
        toastShort(json.Message);
        rejectFn(json);
      } else {
        dispatch({...receive, json});
        resolveFn(json);
      }
    })
    .catch((error) => {
      toastShort('网络发生错误,请重试');
      dispatch({...error, error});
      rejectFn(error);
    });
}