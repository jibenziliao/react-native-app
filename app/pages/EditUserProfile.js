/**
 * 编辑用户的个人信息
 * @author keyy/1501718947@qq.com 16/12/7 21:40
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
  TouchableHighlight,
  Dimensions,
  BackAndroid,
  Alert,
  InteractionManager,
  DeviceEventEmitter,
  Keyboard
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import {componentStyles} from '../style'
import BaseComponent from '../base/BaseComponent'
import RNPicker from 'react-native-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import CheckBox from '../components/CheckBox'
import * as HomeActions from '../actions/Home'
import * as Storage from '../utils/Storage'
import * as UserProfileActions from '../actions/UserProfile'
import {toastShort} from '../utils/ToastUtil'
import tmpGlobal from '../utils/TmpVairables'

const {width, height}=Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  scrollViewContainer: {
    flex: 1
  },
  photosContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingLeft: 10
  },
  userInfo: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 10
  },
  topSection: {
    marginTop: 10
  },
  itemTitle: {
    paddingVertical: 10
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d4cfcf',
    alignItems: 'center'
  },
  topItem: {
    borderTopWidth: 1,
    borderTopColor: '#d4cfcf'
  },
  bottomItem: {
    borderBottomWidth: 0
  },
  itemRow: {
    flexDirection: 'row'
  },
  itemEnter: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemIcon: {
    marginRight: 10
  },
  fullInput: {
    flex: 1
  },
  input: {
    height: 40,
    paddingLeft: 10,
    textAlignVertical: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputLabel: {
    width: 100
  },
  rightLabel: {
    width: 80,
    paddingLeft: 10,
    textAlignVertical: 'center'
  },
  emotionStatusIOS: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  emotionStatusIOSView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  emotionStatusIOSText: {
    textAlignVertical: 'center'
  },
  pickerItem: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  pickerTextView: {
    flex: 1
  },
  pickerText: {
    textAlignVertical: 'center'
  },
  checkBoxView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 10
  },
  checkBoxItem: {
    width: (width - 30) / 2,
    height: 40
  },
  checkBoxLabel: {
    marginLeft: 10,
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'nowrap'
  },
  datingPurposeTitle: {
    borderBottomWidth: 1,
    borderBottomColor: '#d4cfcf'
  },
  takePhotoBtn: {
    height: (width - 40) / 3,
    width: (width - 40) / 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginRight: 10,
    marginBottom: 10
  },
  imageStar: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  imageBorder: {
    borderWidth: 0
  }
});

let DictMap = {
  EducationLevelDict: [],
  IncomeLevelDict: [],
  JobTypeDict: [],
  MarriageStatusDict: [],
  DatingPurposeDict: [],
  PhotoPermissionDict: [],
  ReligionDict: []
};

//保存字典索引
let DictMapArrKey = ['EducationLevelDict', 'IncomeLevelDict', 'JobTypeDict', 'MarriageStatusDict', 'DatingPurposeDict', 'PhotoPermissionDict', 'ReligionDict'];

let navigator;

let DatingPurposeSelectCopy = [];

class EditUserProfile extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    navigator = this.props.navigator;
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=> {
      this._initUserProfile();
    });
  }

  _initUserProfile() {
    const {dispatch}=this.props;
    dispatch(HomeActions.getCurrentUserProfile('', (json)=> {
      this._initDict((DictMap, result)=> {
        this._initDatingPurpose(DictMap, result, result.DatingPurposeName);
        console.log({
          DictMap: DictMap,
          ...result
        })
      }, json.Result);

    }, (error)=> {
    }));
  }

  _initDict(callBack, result) {
    //每次初始化字典时,需要把之前的数据清空
    DictMap = {
      EducationLevelDict: [],
      IncomeLevelDict: [],
      JobTypeDict: [],
      MarriageStatusDict: [],
      DatingPurposeDict: [],
      PhotoPermissionDict: [],
      ReligionDict: []
    };
    //下面是选填项的字典
    for (let i = 0; i < DictMapArrKey.length; i++) {
      Storage.getItem(`${DictMapArrKey[i]}`).then((response)=> {
        if (response && response.length > 0) {
          for (let j = 0; j < response.length; j++) {
            if (DictMapArrKey[i] == 'DatingPurposeDict' || DictMapArrKey[i] == 'PhotoPermissionDict') {
              DictMap[DictMapArrKey[i]].push(response[j])
            } else {
              DictMap[DictMapArrKey[i]].push(response[j].Value)
            }
          }
          if (i === DictMapArrKey.length - 1) {
            callBack(DictMap, result);
          }
        } else {
          console.error('获取下拉选项字典出错');
        }
      })
    }

  }

  //初始化交友目的的选中情况
  _initDatingPurpose(DictMap, result, DatingPurposeName) {
    let tmpArr = DatingPurposeName.split(',');
    for (let i = 0; i < DictMap.DatingPurposeDict.length; i++) {
      for (let j = 0; j < tmpArr.length; j++) {
        if (DictMap.DatingPurposeDict[i].Value == tmpArr[j]) {
          DictMap.DatingPurposeDict[i].Checked = true;
          this.setState({
            DictMap: DictMap,
            DatingPurposeDict: DictMap.DatingPurposeDict,
            ...result,
            loading: false
          })
        }
      }
    }
  }

  getNavigationBarProps() {
    return {
      title: '编辑我的资料',
      hideRightButton: false,
      rightTitle: '完成'
    };
  }

  //点击完成(保存编辑后的个人资料)
  onRightPressed() {
    const {dispatch}=this.props;
    dispatch(UserProfileActions.editProfile(this.state, DatingPurposeSelectCopy, (json)=> {
      DeviceEventEmitter.emit('userInfoChanged', '编辑用户资料成功');
      toastShort('保存成功!');
      this.saveTimer = setTimeout(()=> {
       navigator.pop();
       }, 1000)
    }, (error)=> {
    }))
  }

  componentWillUnmount(){
    if(this.saveTimer){
      clearTimeout(this.saveTimer)
    }
  }

  renderDatingPurpose() {
    let arr = this.state.DictMap.DatingPurposeDict;
    return (
      <View style={styles.checkBoxView}>
        {arr.map((item, index)=> {
          //勾选/取消勾选会引起重绘,这里需要再次判断DatingPurposeSelectCopy中是否有已勾选的项,如果有则跳过,没有则添加
          //TODO: 代码冗余,待封装,待优化
          if (item.Checked) {
            let index = 0;
            for (let m = 0; m < DatingPurposeSelectCopy.length; m++) {
              if (DatingPurposeSelectCopy[m].Value == item.Value) {
                index += 1;
              }
            }
            if (index === 0) {
              DatingPurposeSelectCopy.push(item);
            }
          }
          return (
            <CheckBox
              key={index}
              label={item.Value}
              labelStyle={styles.checkBoxLabel}
              checked={item.Checked}
              style={styles.checkBoxItem}
              onChange={(checked)=> {
                item.Checked = checked;
                this.setState({hasChanged: true});
                if (checked) {
                  let index = 0;
                  for (let m = 0; m < DatingPurposeSelectCopy.length; m++) {
                    if (DatingPurposeSelectCopy[m].Value == item.Value) {
                      index += 1;
                    }
                  }
                  if (index === 0) {
                    DatingPurposeSelectCopy.push(item);
                  }
                } else {
                  let index = 0;
                  for (let i = 0; i < DatingPurposeSelectCopy.length; i++) {
                    if (DatingPurposeSelectCopy[i].Key == item.Key) {
                      index = i;
                      break;
                    }
                  }
                  DatingPurposeSelectCopy.splice(index, 1);
                }
              }}/>
          )
        })}
      </View>
    )
  }

  _createHeightData() {
    let data = [];
    for (let i = 100; i < 251; i++) {
      data.push(i + '')
    }
    return data;
  }

  _createWeightData() {
    let data = [];
    for (let i = 20; i < 501; i++) {
      data.push(i + '')
    }
    return data;
  }

  _createMapData() {
    return ['0m(精确定位)', '200m', '500m', '1000m', '隐身'];
  }

  //通用选择弹窗显示文本方法
  renderSinglePicker(text, value, _createData) {
    return (
      <TouchableHighlight
        onPress={()=> {
          this._showPicker(_createData, text, value)
        }}
        style={styles.emotionStatusIOS}
        activeOpacity={0.5}
        underlayColor="rgba(247,245,245,0.7)">
        <View style={styles.emotionStatusIOSView}>
          <Text style={styles.emotionStatusIOSText}>
            {this.state[`${text}`]}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  _updateState(text, value, pickedValue) {
    this.setState({hasChanged: true});
    switch (text) {
      case 'MarriageStatusName':
        this.setState({MarriageStatusName: pickedValue});
        break;
      case 'EducationLevelName':
        this.setState({EducationLevelName: pickedValue});
        break;
      case 'Height':
        this.setState({Height: parseInt(pickedValue)});
        break;
      case 'Weight':
        this.setState({Weight: parseInt(pickedValue)});
        break;
      case 'JobTypeName':
        this.setState({JobTypeName: pickedValue});
        break;
      case 'IncomeLevelName':
        this.setState({IncomeLevelName: pickedValue});
        break;
      case 'MapPrecision':
        if (pickedValue == '隐身') {
          this.setState({
            MapPrecision: null,
          });
        } else {
          this.setState({
            MapPrecision: parseInt(pickedValue.split('m')[0]),
          });
        }
        break;
      case 'ReligionName':
        this.setState({ReligionName: pickedValue});
        break;
      default:
        console.error('设置数据出错!');
        break;
    }
  }

  _showPicker(_createData, text, value) {
    Keyboard.dismiss();
    RNPicker.init({
      pickerData: _createData,
      selectedValue: [this.state[`${text}`]],
      onPickerConfirm: pickedValue => {
        this._updateState(text, value, pickedValue[0]);
        RNPicker.hide();
      },
      onPickerCancel: pickedValue => {
        RNPicker.hide();
      },
      onPickerSelect: pickedValue => {
        this._updateState(text, value, pickedValue[0]);
      }
    });
    RNPicker.show();
  }

  renderBody() {
    if (this.state.loading) {
      return null
    } else {
      return (
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollViewContainer}
            keyboardDismissMode={'interactive'}
            keyboardShouldPersistTaps={true}>
            <View
              style={[styles.userInfo, styles.topSection]}
              pointerEvents={'box-none'}
              onStartShouldSetResponderCapture={()=> {
                return false
              }}>
              <Text style={styles.itemTitle}>{'基本资料'}</Text>
              <View style={[styles.listItem, styles.topItem]}>
                <Text style={styles.inputLabel}>{'昵称'}</Text>
                <TextInput
                  style={[styles.input, styles.fullInput]}
                  underlineColorAndroid={'transparent'}
                  value={this.state.Nickname}
                  onChangeText={(Nickname)=>this.setState({Nickname: Nickname, hasChanged: true})}
                  maxLength={15}/>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.inputLabel}>{'身高'}</Text>
                {this.renderSinglePicker('Height', 'Height', this._createHeightData())}
                <Text style={styles.rightLabel}>{'cm'}</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.inputLabel}>{'体重'}</Text>
                {this.renderSinglePicker('Weight', 'Weight', this._createWeightData())}
                <Text style={styles.rightLabel}>{'kg'}</Text>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.inputLabel}>{'职业'}</Text>
                {this.renderSinglePicker('JobTypeName', 'JobTypeName', this.state.DictMap.JobTypeDict)}
              </View>
              <View style={styles.listItem}>
                <Text style={styles.inputLabel}>{'收入'}</Text>
                {this.renderSinglePicker('IncomeLevelName', 'IncomeLevelName', this.state.DictMap.IncomeLevelDict)}
              </View>
              <View style={styles.listItem}>
                <Text style={styles.inputLabel}>{'所在地'}</Text>
                <TextInput
                  style={[styles.input, styles.fullInput]}
                  underlineColorAndroid={'transparent'}
                  value={this.state.Location}
                  onChangeText={(Location)=>this.setState({Location: Location, hasChanged: true})}
                  maxLength={50}/>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.inputLabel}>{'情感状态'}</Text>
                {this.renderSinglePicker('MarriageStatusName', 'MarriageStatusName', this.state.DictMap.MarriageStatusDict)}
              </View>
              <View style={[styles.listItem, styles.bottomItem]}>
                <Text style={styles.inputLabel}>{'家乡'}</Text>
                <TextInput
                  style={[styles.input, styles.fullInput]}
                  underlineColorAndroid={'transparent'}
                  value={this.state.Hometown}
                  onChangeText={(Hometown)=>this.setState({Hometown: Hometown, hasChanged: true})}
                  maxLength={50}/>
              </View>
            </View>
            <View
              style={styles.userInfo}
              pointerEvents={'box-none'}
              onStartShouldSetResponderCapture={()=> {
                return false
              }}>
              <Text style={styles.itemTitle}>{'其他'}</Text>
              <View style={[styles.listItem, styles.topItem]}>
                <Text style={styles.inputLabel}>{'学历'}</Text>
                {this.renderSinglePicker('EducationLevelName', 'EducationLevelName', this.state.DictMap.EducationLevelDict)}
              </View>
              <View style={[styles.listItem]}>
                <Text style={styles.inputLabel}>{'地图精度'}</Text>
                {this.renderSinglePicker('MapPrecision', 'MapPrecision', this._createMapData())}
              </View>
              <View style={styles.listItem}>
                <Text style={styles.inputLabel}>{'信仰'}</Text>
                {this.renderSinglePicker('ReligionName', 'ReligionName', this.state.DictMap.ReligionDict)}
              </View>
              <View style={styles.listItem}>
                <Text style={styles.inputLabel}>{'联系方式'}</Text>
                <TextInput
                  style={[styles.input, styles.fullInput]}
                  underlineColorAndroid={'transparent'}
                  value={this.state.MobileNo}
                  onChangeText={(MobileNo)=>this.setState({MobileNo})}
                  maxLength={15}/>
              </View>
              <View style={styles.listItem}>
                <Text style={styles.inputLabel}>{'兴趣爱好'}</Text>
                <TextInput
                  style={[styles.input, styles.fullInput]}
                  underlineColorAndroid={'transparent'}
                  value={this.state.Hobby}
                  onChangeText={(Hobby)=>this.setState({Hobby})}
                  maxLength={15}/>
              </View>
              <View style={[styles.listItem, styles.bottomItem]}>
                <Text style={styles.inputLabel}>{'自我评价'}</Text>
                <TextInput
                  style={[styles.input, styles.fullInput]}
                  underlineColorAndroid={'transparent'}
                  value={this.state.SelfEvaluation}
                  onChangeText={(SelfEvaluation)=>this.setState({SelfEvaluation})}
                  maxLength={50}/>
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.itemTitle, styles.datingPurposeTitle]}>{'交友目的'}</Text>
              {this.renderDatingPurpose()}
            </View>
          </ScrollView>
        </View>
      )
    }
  }
}

export default connect((state)=> {
  return {
    ...state
  }
})(EditUserProfile)
