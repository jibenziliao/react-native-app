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

function fetchOptionsPut(data) {
  return {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
}

function fetchOptionsDelete() {
  return {
    method: 'DELETE'
  }
}

function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      console.log('进入超时拦截方法');
      clearTimeout(timeoutId);
      reject(new Error('Time Out'));
    }, ms);
    promise.then(
      (res) => {
        console.log('进入成功回调');
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        console.log('进入失败回调');
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  })
}

export function postFetch(url, data, dispatch, fetchReq, receive, error, resolveFn, rejectFn) {
  dispatch({...fetchReq, data});
  timeoutPromise(TIME_OUT, fetch(URL_DEV + url, fetchOptions(data))
    .then((response) => {
      if (response && response.status == 200) {
        return response.json();
      } else {
        return Promise.reject(new Error(response.status));
      }
    })
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
    .catch((err) => {
      toastShort('网络发生错误,请重试');
      dispatch({...error, errorInfo: '请求错误',errorMessage:err});
      rejectFn({error: '请求错误',errorMessage:err});
      throw err;
    }));

  /*new Promise(function(resolve, reject) {
   let timeout = setTimeout(function() {
   reject(new Error('Request timed out'));
   }, TIME_OUT);
   fetch(URL_DEV + url, fetchOptions(data))
   .then(function(response) {
   clearTimeout(timeout);
   if (response && response.status == 200) return response.json();
   else reject(new Error('Response error'));
   })
   .then(function(json) {
   // process results
   resolve(json);
   })
   .catch(function(err) {
   reject(err);
   });
   })
   .then((json)=>{
   if ('OK' != json.Code) {
   dispatch({...error, data, json});
   toastShort(json.Message);
   rejectFn(json);
   } else {
   dispatch({...receive, data, json});
   resolveFn(json);
   }
   }
   )
   .catch(function(err) {
   toastShort('网络发生错误,请重试');
   // error: response error, request timeout or runtime error
   dispatch({...error, error: '请求错误'});
   rejectFn({error: '请求错误'});
   console.log(err);
   });*/

}

export function getFetch(url, data, dispatch, fetchReq, receive, error, resolveFn, rejectFn) {
  dispatch(fetchReq);
  timeoutPromise(TIME_OUT, fetch(URL_DEV + url + data + '', fetchOptionsGet())).then((response) => {
    if (response && response.status == 200) {
      return response.json()
    } else {
      return Promise.reject(new Error(response.status));
    }
  })
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
    .catch((err) => {
      toastShort('网络发生错误,请重试');
      console.log(err);
      dispatch({...error, errorInfo: '请求错误',errorMessage:err});
      rejectFn({error: '请求错误',errorMessage:err});
      throw err;
    });
}

export function putFetch(url, data, dispatch, fetchReq, receive, error, resolveFn, rejectFn) {
  dispatch(fetchReq);
  timeoutPromise(TIME_OUT, fetch(URL_DEV + url + '', fetchOptionsPut(data))).then((response) => {
    if (response && response.status == 200) {
      return response.json()
    } else {
      return Promise.reject(new Error(response.status));
    }
  })
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
    .catch((err) => {
      toastShort('网络发生错误,请重试');
      dispatch({...error, errorInfo: '请求错误',errorMessage:err});
      rejectFn({error: '请求错误',errorMessage:err});
      throw err;
    });
}

export function deleteFetch(url, data, dispatch, fetchReq, receive, error, resolveFn, rejectFn) {
  dispatch(fetchReq);
  timeoutPromise(TIME_OUT, fetch(URL_DEV + url + data, fetchOptionsDelete())).then((response) => {
    if (response && response.status == 200) {
      return response.json()
    } else {
      return Promise.reject(new Error(response.status));
    }
  })
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
    .catch((err) => {
      toastShort('网络发生错误,请重试');
      dispatch({...error, errorInfo: '请求错误',errorMessage:err});
      rejectFn({error: '请求错误',errorMessage:err});
      throw err;
    });
}