/**
 * 处理后台返回的下拉框键值对
 * @author keyy/1501718947@qq.com 16/11/23 15:27
 * @description
 */
import * as Storage from './Storage'

export function getObjArr(data) {
  let tmpArr=[];
  for(let i in data){
    tmpArr.push(data[i]);
  }
  return tmpArr;
}

export function setDictArr(data) {
  let tmpArr=[];
  for(let i in data){
    Storage.setItem(`${i}`,data[i])
  }
  return tmpArr;
}

