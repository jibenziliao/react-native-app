/**
 *
 * @author keyy/1501718947@qq.com 16/11/15 14:28
 * @description
 */
import * as ActionTypes from './ActionTypes'
import {postFetch, getFetch} from '../utils/NetUtil'
import * as Storage from '../utils/Storage'

let JobTypeObj, IncomeLevel, EducationLevel, MarriageStatus, Religion;

let DictMap = {
  EducationLevelDict: [],
  IncomeLevelDict: [],
  JobTypeDict: [],
  MarriageStatusDict: [],
  DatingPurposeDict: [],
  PhotoPermissionDict: [],
  ReligionDict: []
};

async function getSelectedValue(data) {
  let jobTypeArr = await Storage.getItem('JobTypeDict');
  let incomeLevelArr = await Storage.getItem('IncomeLevelDict');
  let educationLevelArr = await Storage.getItem('EducationLevelDict');
  let marriageStatusArr = await Storage.getItem('MarriageStatusDict');
  let ReligionArr = await Storage.getItem('ReligionDict');

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
  Religion = ReligionArr.find((item)=> {
    return item.Value == data.religionText;
  });
  //console.log(JobTypeObj, IncomeLevel, EducationLevel, MarriageStatus,Religion);
  return ({JobTypeObj, IncomeLevel, EducationLevel, MarriageStatus, Religion});
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
          Height: data.heightText ? parseInt(data.heightText) : null,
          Weight: data.weightText ? parseInt(data.weightText) : null,
          JobType: result.JobTypeObj && result.JobTypeObj.Key ? result.JobTypeObj.Key : null,
          IncomeLevel: result.IncomeLevel && result.IncomeLevel.Key ? result.IncomeLevel.Key : null,
          EducationLevel: result.EducationLevel && result.EducationLevel.Key ? result.EducationLevel.Key : null,
          MarriageStatus: result.MarriageStatus && result.MarriageStatus.Key ? result.MarriageStatus.Key : null,
          Religion: result.Religion && result.Religion.Key ? result.Religion.Key : null,
          DatingPurpose: tmpDatingPurposeArr.join(','),
          MapPrecision: data.mapPrecision,
          Hometown: data.hometown,
          Hobby: data.interest,
          Location: data.location,
          SelfEvaluation: data.selfEvaluation,
          IsSmoke: data.habitSmoke,
          IsDrink: data.habitDrink
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

async function getSelectedItem(data) {
  let jobTypeArr = await Storage.getItem('JobTypeDict');
  let incomeLevelArr = await Storage.getItem('IncomeLevelDict');
  let educationLevelArr = await Storage.getItem('EducationLevelDict');
  let marriageStatusArr = await Storage.getItem('MarriageStatusDict');
  let ReligionArr = await Storage.getItem('ReligionDict');

  JobTypeObj = jobTypeArr.find((item)=> {
    return item.Value == data.JobTypeName;
  });
  IncomeLevel = incomeLevelArr.find((item)=> {
    return item.Value == data.IncomeLevelName;
  });
  EducationLevel = educationLevelArr.find((item)=> {
    return item.Value == data.EducationLevelName;
  });
  MarriageStatus = marriageStatusArr.find((item)=> {
    return item.Value == data.MarriageStatusName;
  });
  Religion = ReligionArr.find((item)=> {
    return item.Value == data.ReligionName;
  });

  //console.log(JobTypeObj, IncomeLevel, EducationLevel, MarriageStatus,Religion);
  return ({JobTypeObj, IncomeLevel, EducationLevel, MarriageStatus, Religion});
}

export function editProfile(data, datingPurpose, resolve, reject) {
  let tmpDatingPurposeArr = [];
  if (datingPurpose.length > 0) {
    for (let i = 0; i < datingPurpose.length; i++) {
      tmpDatingPurposeArr.push(datingPurpose[i].Key);
    }
  }
  return (dispatch)=> {
    dispatch({type: ActionTypes.GET_ITEM_BEGIN});
    getSelectedItem(data).then(
      (result)=> {
        dispatch({type: ActionTypes.GET_ITEM_END, data, result});
        let params = {
          Nickname: data.Nickname,
          BirthDate: data.BirthDate,
          Ethnicity: data.Ethnicity,
          Gender: data.Gender,
          Height: data.Height,
          Weight: data.Weight,
          JobType: result.JobTypeObj && result.JobTypeObj.Key ? result.JobTypeObj.Key : null,
          IncomeLevel: result.IncomeLevel && result.IncomeLevel.Key ? result.IncomeLevel.Key : null,
          EducationLevel: result.EducationLevel && result.EducationLevel.Key ? result.EducationLevel.Key : null,
          MarriageStatus: result.MarriageStatus && result.MarriageStatus.Key ? result.MarriageStatus.Key : null,
          Religion: result.Religion && result.Religion.Key ? result.Religion.Key : null,
          DatingPurpose: tmpDatingPurposeArr.join(','),
          MapPrecision: data.MapPrecision,
          Hometown: data.Hometown,
          Hobby: data.Hobby,
          Location: data.Location,
          SelfEvaluation: data.SelfEvaluation,
          IsSmoke:!!data.IsSmoke,
          IsDrink:!!data.IsDrink
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

export function getDict(str, resolveFn, rejectFn) {
  return (dispatch)=> {
    dispatch({type: ActionTypes.FETCH_BEGIN});
    //每次获取字典,需要重置字典
    DictMap = {
      EducationLevelDict: [],
      IncomeLevelDict: [],
      JobTypeDict: [],
      MarriageStatusDict: [],
      DatingPurposeDict: [],
      PhotoPermissionDict: [],
      ReligionDict: []
    };
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
            resolveFn(DictMap);
            dispatch({type: ActionTypes.FETCH_END, null, DictMap});
            return false;
          } else {
            rejectFn({error: '获取交友目的字典异常'});
          }
        } else {
          console.error('获取下拉选项字典出错');
        }
      })
    }
  };
}

export function savePersonalSignature(data, resolve, reject) {
  return (dispatch)=> {
    postFetch('/profiles/personsignal', data, dispatch, {type: ActionTypes.FETCH_BEGIN}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}
