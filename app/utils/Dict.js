/**
 * 处理后台返回的下拉框键值对
 * @author keyy/1501718947@qq.com 16/11/23 15:27
 * @description
 */
import * as Storage from './Storage'

const dictArr = ['EducationLevelDict', 'IncomeLevelDict', 'JobType', 'MarriageStatus'];

function getObj(data) {
  let tmpArr=[];
  for(let i in data){
    tmpArr.push(data[i]+'');
  }
  return tmpArr;
}

export const setDictArr = (data)=> {
  dictArr.forEach((i)=>{
    Storage.setItem(data[i],getObj(data[i]));
  });
};