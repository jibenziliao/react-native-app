/**
 *
 * @author keyy/1501718947@qq.com 16/11/29 10:16
 * @description
 */
import * as ActionTypes from './ActionTypes'
import {postFetch, getFetch, putFetch} from '../utils/NetUtil'
import {toastShort} from '../utils/ToastUtil'
import {URL_DEV, TIME_OUT} from '../constants/Constant'

export function getPostList(data, resolve, reject) {
  return (dispatch)=> {
    getFetch('/post/getpostlist/', `${data.pageIndex}/${data.pageSize}/${data.Lat}/${data.Lng}`, dispatch, {
      type: ActionTypes.FETCH_BEGIN,
      data
    }, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function like(data, resolve, reject) {
  return (dispatch)=> {
    putFetch(`/post/like/${data.postId}/${data.isLike}`, data, dispatch, {
      type: ActionTypes.FETCH_BEGIN,
      data
    }, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function comment(data, resolve, reject) {
  return (dispatch)=> {
    postFetch(`/post/comment/${data.postId}?forCommentId=${data.forCommentId}`, {comment: data.comment}, dispatch, {type: ActionTypes.FETCH_BEGIN}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function getAnnouncementDetail(data, resolve, reject) {
  return (dispatch)=> {
    getFetch('/post/viewpost/', `${data.postId}/${data.Lat}/${data.Lng}`, dispatch, {
      type: ActionTypes.FETCH_BEGIN,
      data
    }, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function getCommentList(data, resolve, reject) {
  return (dispatch)=> {
    getFetch('/post/getpostcommentlist/', `${data.postId}/${data.pageIndex}/${data.pageSize}/${data.Lat}/${data.Lng}`, dispatch, {
      type: ActionTypes.FETCH_BEGIN,
      data
    }, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function getUserInfo(data, resolve, reject) {
  return (dispatch)=> {
    getFetch('/profiles/', `${data.UserId}`, dispatch, {
      type: ActionTypes.FETCH_BEGIN,
      data
    }, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

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

export function postAnnouncement(data, navigator) {
  return (dispatch)=> {
    dispatch({type: ActionTypes.UPLOAD_PHOTO_BEGIN});
    const photoCount = data.imageArr.length;
    let uploadReq = 0;
    let uploadImgArr = [];
    for (let i = 0; i < data.imageArr.length; i++) {
      uploadSingleImage(data.imageArr[i], data.imageArr, dispatch);
    }
    function uploadSingleImage(obj, arr, dispatch) {
      let formData = new FormData();
      let file = {
        uri: obj.uri,
        type: 'multipart/form-data',
        name: obj.id + '.jpg'
      };
      formData.append("file", file);
      fetch(URL_DEV + '/uploadphoto', {
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
            uploadImgArr.push(json.Result);
            uploadReq += 1;
            if (uploadReq === photoCount) {
              dispatch({type: ActionTypes.UPLOAD_PHOTO_END, arr, json});
              let params = {
                PostContent: data.PostContent,
                Lat: data.myLocation.Lat,
                Lng: data.myLocation.Lng,
                PicList: uploadImgArr,
                ExpirationDate: ''
              };
              dispatch({type: ActionTypes.FETCH_BEGIN, params});
              fetch(URL_DEV + '/post/newpost', fetchOptions(params))
                .then((response)=> {
                  response.json()
                })
                .then((json)=> {
                  dispatch({type: ActionTypes.FETCH_END, params, json});
                  if ('OK' != json.Code) {
                    toastShort(json.Message);
                    return false;
                  } else {
                    toastShort('发布成功');
                    setTimeout(()=> {
                      navigator.pop();
                    }, 1000);
                  }
                }).catch((error)=>{
                dispatch({type: ActionTypes.FETCH_FAILED, params, error});
                toastShort('网络异常,请重试');
              })

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

