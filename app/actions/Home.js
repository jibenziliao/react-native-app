/**
 *
 * @author keyy/1501718947@qq.com 16/11/29 10:16
 * @description
 */
import * as ActionTypes from './ActionTypes'
import {postFetch, getFetch, putFetch, deleteFetch} from '../utils/NetUtil'
import {toastShort} from '../utils/ToastUtil'
import {URL_DEV, TIME_OUT} from '../constants/Constant'
import Home from '../containers/Home'
import MainContainer from '../containers/MainContainer'

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

export function deleteAnnouncement(data, resolve, reject) {
  return (dispatch)=> {
    deleteFetch(`/post/delete/${data.PostId}`, '', dispatch, {
      type: ActionTypes.FETCH_BEGIN,
      data
    }, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
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

export function gore(data, resolve, reject) {
  return (dispatch)=> {
    putFetch(`/post/up/${data.PostId}`, data, dispatch, {
      type: ActionTypes.FETCH_BEGIN,
      data
    }, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function getCurrentUserProfile(data, resolve, reject) {
  return (dispatch)=> {
    getFetch('/profile/', data, dispatch, {type: ActionTypes.FETCH_BEGIN}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}

export function newPost(data, resolve, reject) {
  return (dispatch)=> {
    getFetch('/post/doihaveanotexpiredpost', data, dispatch, {type: ActionTypes.FETCH_BEGIN,}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
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

function pushNewPost(dispatch, data, imgArr, navigator) {
  let params = {
    PostContent: data.PostContent,
    Lat: data.myLocation.Lat,
    Lng: data.myLocation.Lng,
    PicList: imgArr
  };
  dispatch({type: ActionTypes.FETCH_BEGIN, params});
  fetch(URL_DEV + '/post/newpost/' + data.days, fetchOptions(params))
    .then(response=>response.json())
    .then((json)=> {
      dispatch({type: ActionTypes.FETCH_END, params, json});
      if ('OK' != json.Code) {
        toastShort(json.Message);
        return false;
      } else {
        toastShort('发布成功');
        setTimeout(()=> {
          navigator.popToTop();
          data.callBack();
        }, 1000);
      }
    }).catch((error)=> {
    dispatch({type: ActionTypes.FETCH_FAILED, params, error});
    toastShort('网络异常,请重试');
  })
}

export function postAnnouncement(data, navigator) {
  return (dispatch)=> {
    const photoCount = data.imageArr.length;
    let uploadReq = 0;
    let uploadImgArr = [];
    if (photoCount !== 0) {
      dispatch({type: ActionTypes.UPLOAD_PHOTO_BEGIN});
      for (let i = 0; i < data.imageArr.length; i++) {
        uploadSingleImage(data.imageArr[i], data, dispatch);
      }
    } else {
      pushNewPost(dispatch, data, [], navigator);
    }

    function uploadSingleImage(obj, data, dispatch) {
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
              dispatch({type: ActionTypes.UPLOAD_PHOTO_END, data, json});
              pushNewPost(dispatch, data, uploadImgArr, navigator);
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

