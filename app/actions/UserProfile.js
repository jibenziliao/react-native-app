/**
 *
 * @author keyy/1501718947@qq.com 16/11/15 14:28
 * @description
 */
import * as ActionTypes from './ActionTypes'
import {postFetch, getFetch} from '../utils/NetUtil'
import * as Storage from '../utils/Storage'

let JobTypeObj, IncomeLevel, EducationLevel, MarriageStatus;

let DictMap = {
  EducationLevelDict: [],
  IncomeLevelDict: [],
  JobTypeDict: [],
  MarriageStatusDict: [],
  DatingPurposeDict: []
};

async function getSelectedValue(data) {
  let jobTypeArr = await Storage.getItem('JobTypeDict');
  let incomeLevelArr = await Storage.getItem('IncomeLevelDict');
  let educationLevelArr = await Storage.getItem('EducationLevelDict');
  let marriageStatusArr = await Storage.getItem('MarriageStatusDict');

  JobTypeObj = jobTypeArr.find((item)=> {
    return item.Value == data.professionText;
  });
  IncomeLevel = incomeLevelArr.find((item)=> {
    return item.Value == data.incomeText;
  });
  EducationLevel = educationLevelArr.find((item)=> {
    return item.Value == data.educationStatusText;
  });
  MarriageStatus = marriageStatusArr.find((item)=> {
    return item.Value == data.emotionStatusText;
  });
  //console.log(JobTypeObj, IncomeLevel, EducationLevel, MarriageStatus);
  return ({JobTypeObj, IncomeLevel, EducationLevel, MarriageStatus});
}

export function saveProfile(data, datingPurpose, resolve, reject) {
  let tmpDatingPurposeArr = [];
  if (datingPurpose.length > 0) {
    for (let i = 0; i < datingPurpose.length; i++) {
      tmpDatingPurposeArr.push(datingPurpose[i].Key);
    }
  }
  //console.log(JobTypeObj, IncomeLevel, EducationLevel, MarriageStatus);

  return (dispatch)=> {
    dispatch({type: ActionTypes.GET_ITEM_BEGIN});
    getSelectedValue(data).then(
      (result)=> {
        dispatch({type: ActionTypes.GET_ITEM_END, data, result});
        let params = {
          Nickname: data.nickName,
          BirthDate: data.birthYearText,
          Ethnicity: data.ethnicity,
          Gender: data.gender,
          Height: data.height,
          Weight: data.weight,
          JobType: result.JobTypeObj && result.JobTypeObj.Key ? result.JobTypeObj.Key : "Marketing",
          IncomeLevel: result.IncomeLevel && result.IncomeLevel.Key ? result.IncomeLevel.Key : "Higher",
          EducationLevel: result.EducationLevel && result.EducationLevel.Key ? result.EducationLevel.Key : "Diploma",
          MarriageStatus: result.MarriageStatus && result.MarriageStatus.Key ? result.MarriageStatus.Key : "Married",
          Religion: data.religion,
          DatingPurpose: tmpDatingPurposeArr.join(','),
          MapPrecision: data.mapPrecision,
          Hometown: data.hometown,
          Hobby: data.interest,
          Location: data.location,
          SelfEvaluation: data.selfEvaluation
        };
        postFetch('/profile', params, dispatch,
          {type: ActionTypes.FETCH_BEGIN},
          {type: ActionTypes.FETCH_END},
          {type: ActionTypes.FETCH_FAILED},
          resolve,
          reject
        );
      }
    ).catch((error)=> {
      dispatch({type: ActionTypes.GET_ITEM_FAILED, data, error});
    });
  }
}

export function getDict() {
  return (dispatch)=> {
    dispatch({type: ActionTypes.FETCH_BEGIN});
    for (let i in DictMap) {
      Storage.getItem(`${i}`).then((response)=> {
        if (response && response.length > 0) {
          response.forEach((j)=> {
            if (`${i}` == 'DatingPurposeDict') {
              DictMap[i].push(j);
            } else {
              DictMap[i].push(j.Value);
            }
          });
          let count = 0;
          for (let m in DictMap) {
            if (DictMap[m].length === 0) {
              count += 1;
            }
          }
          if (count === 0) {
            dispatch({type: ActionTypes.FETCH_END, null, DictMap});
            return false;
          }
        } else {
          console.error('获取下拉选项字典出错');
        }
      })
    }
  };
}

export function savePersonalSignature(data,resolve,reject) {
  return (dispatch)=> {
    postFetch('/profiles/personsignal', data, dispatch, {type: ActionTypes.FETCH_BEGIN}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}
