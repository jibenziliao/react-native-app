/**
 *
 * @author keyy/1501718947@qq.com 16/11/25 17:39
 * @description
 */
import * as ActionTypes from './ActionTypes'
import {URL_DEV} from '../constants/Constant'
import {toastShort} from '../utils/ToastUtil'
import FriendsFilter from '../pages/FriendsFilter'
import {postFetch, getFetch, putFetch, deleteFetch} from '../utils/NetUtil'

export function uploadImage(arr,navigator) {
  return (dispatch)=> {
    dispatch({type: ActionTypes.UPLOAD_PHOTO_BEGIN});
    const photoCount = arr.length;
    let uploadReq = 0;
    for (let i = 0; i < arr.length; i++) {
      uploadSingleImage(arr[i], arr, dispatch);
    }
    function uploadSingleImage(obj, arr, dispatch) {
      let formData = new FormData();
      let file = {
        uri: obj.uri,
        type: 'multipart/form-data',
        name: obj.id + '.jpg'
      };
      formData.append("file", file);
      formData.append("permission", obj.Permission);
      fetch(URL_DEV + '/profile/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      }).then((response) => response.json())
        .then((json)=> {
          //dispatch(uploadEnd(arr,json));
          if ('OK' !== json.Code) {
            toastShort(json.Message);
            //dispatch(uploadFailed(arr,json));
            return false;
          } else {
            uploadReq += 1;
            if (uploadReq === photoCount) {
              dispatch({type: ActionTypes.UPLOAD_PHOTO_END, arr, json});
              toastShort('照片上传成功');
              setTimeout(()=> {
                //去交友信息页面
                navigator.push({
                  component: FriendsFilter,
                  name: 'FriendsFilter'
                });
              }, 2000)
            }
          }
        })
        .catch((error)=> {
          //dispatch(uploadFailed(arr,error));
          toastShort('网络发生错误,请重试');
        });
    }
  }
}

export function uploadPhoto(arr,resolveFn,rejectFn) {
  return (dispatch)=> {
    dispatch({type: ActionTypes.UPLOAD_PHOTO_BEGIN});
    const photoCount = arr.length;
    let uploadReq = 0;
    for (let i = 0; i < arr.length; i++) {
      uploadSingleImage(arr[i], arr, dispatch);
    }
    function uploadSingleImage(obj, arr, dispatch) {
      let formData = new FormData();
      let file = {
        uri: obj.PhotoUrl,
        type: 'multipart/form-data',
        name: obj.Id + '.jpg'
      };
      formData.append("file", file);
      formData.append("permission", obj.PermissionKey);
      fetch(URL_DEV + '/profile/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      }).then((response) => response.json())
        .then((json)=> {
          //dispatch(uploadEnd(arr,json));
          if ('OK' !== json.Code) {
            toastShort(json.Message);
            dispatch({type:ActionTypes.UPLOAD_PHOTO_FAILED,obj,arr,json});
            rejectFn(obj,arr,json);
            return false;
          } else {
            uploadReq += 1;
            if (uploadReq === photoCount) {
              dispatch({type: ActionTypes.UPLOAD_PHOTO_END, arr, json});
              toastShort('照片上传成功');
              resolveFn();
            }
          }
        })
        .catch((error)=> {
          dispatch({type:ActionTypes.UPLOAD_PHOTO_FAILED,obj,arr,error});
          toastShort('网络发生错误,请重试');
          rejectFn(obj,arr,error)
        });
    }
  }
}

export function setPhotoPermission(data,resolve,reject) {
  return (dispatch)=> {
    postFetch(`/profile/photos/${data.Id}/permission`, {Permission: data.PermissionKey}, dispatch, {type: ActionTypes.FETCH_BEGIN}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function deletePhoto(data,resolve,reject) {
  return (dispatch)=> {
    deleteFetch(`/profile/photos/${data.Id}`,'', dispatch, {type: ActionTypes.FETCH_BEGIN,data}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function setPrimaryPhoto(data,resolve,reject) {
  return (dispatch)=> {
    postFetch(`/profile/photos/${data.Id}`, '', dispatch, {type: ActionTypes.FETCH_BEGIN}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}