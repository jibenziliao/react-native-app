/**
 *
 * @author keyy/1501718947@qq.com 16/11/17 16:30
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableHighlight,
  Animated,
  Picker,
  Platform,
  PickerIOS,
  ActionSheetIOS,
  Alert,
  Dimensions,
  Keyboard,
} from 'react-native'
import BaseComponent from '../base/BaseComponent'
import MainContainer from '../containers/MainContainer'
import Photos from './Photos'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Button as NBButton} from 'native-base'
import RNPicker from 'react-native-picker'
import {connect} from 'react-redux'
import * as UserProfileActions from '../actions/UserProfile'
import * as Storage from '../utils/Storage'
import CheckBox from '../components/CheckBox'
import Spinner from '../components/Spinner'
import {toastShort} from '../utils/ToastUtil'

const {width, height}=Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10
  },
  needItems: {
    flex: 1,
    marginVertical: 10
  },
  genderRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 40
  },
  genderRadioGroup: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  genderLabel: {
    marginLeft: 10
  },
  genderTips: {
    flexDirection: 'row',
    textAlign: 'center',
    marginVertical: 10
  },
  inputRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d4cfcf',
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
  input: {
    height: 40,
    paddingLeft: 10,
    textAlignVertical: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  fullInput: {
    flex: 1
  },
  expandTips: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  expandRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    justifyContent: 'center'
  },
  expandText: {
    marginRight: 10
  },
  nextBtn: {
    marginBottom: 30
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
  modalCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    width: 400
  },
  datingPurposeLabel: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center'
  },
  listItem: {
    marginTop: 10
  },
  checkBoxView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
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
  }
});

let navigator;

let DictMap = {
  EducationLevelDict: [],
  IncomeLevelDict: [],
  JobTypeDict: [],
  MarriageStatusDict: [],
  DatingPurposeDict: [],
  PhotoPermissionDict: [],
  ReligionDict: []
};

let DatingPurposeSelectCopy = [];

class UserProfile extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      genderArr: [
        {text: '男', iconName: 'check-circle-o', checked: true},
        {text: '女', iconName: 'circle-o', checked: false}
      ],
      gender: true,
      expandText: '点击展开更多(选填)',
      expandStatus: false,
      expandIconName: 'angle-double-down',
      emotionStatus: null,
      emotionStatusText: '',
      heightText: '',
      height: null,
      weightText: '',
      weight: null,
      birthYear: 1992,
      birthYearText: '',
      educationStatus: null,
      educationStatusText: '',
      professionText: '',
      profession: null,
      religionText: '',
      religion: '',
      income: null,
      incomeText: '',
      mapPrecision: 1000,
      mapPrecisionText: '',
      hometown: '',
      ethnicity: '',
      interest: '',
      selfEvaluation: '',
      nickName: '',
      location: '',
      datingPurposeArr: [],
    };
    navigator = this.props.navigator;
  };

  componentWillMount() {
    this.setState({
      loading: true
    });
    this._initDict();
  }

  _initDict() {
    const {dispatch}=this.props;

    //每次初始化字典时,需要把之前的数据清空,还要把选中交友目的的数组清空。(已选中,返回登录,再进入时)
    DictMap = {
      EducationLevelDict: [],
      IncomeLevelDict: [],
      JobTypeDict: [],
      MarriageStatusDict: [],
      DatingPurposeDict: [],
      PhotoPermissionDict: [],
      ReligionDict: []
    };

    DatingPurposeSelectCopy = [];

    dispatch(UserProfileActions.getDict('', (json)=> {
      DictMap = json;
      this.setState({
        loading: false
      });
    }, (error)=> {
    }));
  }

  getNavigationBarProps() {
    return {
      title: '个人资料'
    };
  }

  //因为有弹出的日期选择框,这里需要自定义返回方法,以便在点击返回时自动关闭日期弹出框(如果之前没有手动关闭的话)
  onLeftPressed() {
    const {navigator}=this.props;
    RNPicker.isPickerShow((status)=> {
      if (status) RNPicker.hide()
    });
    navigator.pop();
  }

  //下一步
  goNext(data, datingPurpose) {
    if (this._validForm()) {
      this._nextAlert(data, datingPurpose);
    }
  }

  _nextAlert(data, datingPurpose) {
    Alert.alert('提示', '是否继续编辑资料?点击跳过后,您可以在【个人设置】中完善你的资料', [
      {text: '确定', onPress: () => this.saveUserProfile(data, datingPurpose, true)},
      {text: '跳过', onPress: () => this.saveUserProfile(data, datingPurpose, false)}
    ]);
  }

  _validForm() {
    let nickNameReg = /^[\u4E00-\u9FA5\uF900-\uFA2D\da-zA-Z]+$/;
    if (this.state.nickName == '') {
      toastShort('请填写昵称');
      return false;
    } else if (this.state.nickName.split('').length < 3) {
      toastShort('昵称长度不能小于3位');
      return false;
    } else if (!nickNameReg.test(this.state.nickName)) {
      toastShort('昵称只能为英文、数字、汉字');
      return false;
    } else if (!this.state.birthYearText) {
      toastShort('请选择出生年月日');
      return false;
    } else if (DatingPurposeSelectCopy.length == 0) {
      toastShort('请选择交友目的');
      return false;
    } else {
      return true;
    }
  }

  saveUserProfile(data, datingPurpose, bool) {
    const {dispatch} =this.props;
    dispatch(UserProfileActions.saveProfile(data, datingPurpose, (json)=> {
      Storage.setItem('hasRegistered', true);
      if (bool) {
        this.goPhotos();
      } else {
        this.goHome();
      }
    }, (error)=> {
      //console.log(error);
    }));
  }

  //去拍照
  goPhotos() {
    const {navigator} =this.props;
    navigator.push({
      component: Photos,
      name: 'Photos'
    });
  }

  //去首页
  goHome() {
    const {navigator} =this.props;
    navigator.resetTo({
      component: MainContainer,
      name: 'MainContainer'
    });
  }

  checkGender(gender, index) {
    this.state.genderArr.map((item)=> {
      item.iconName = 'circle-o';
      item.checked = false
    });
    this.state.genderArr[index].iconName = 'check-circle-o';
    this.state.genderArr[index].checked = true;
    this.setState({
      gender: this.state.genderArr[index].text == '男',
      genderArr: this.state.genderArr
    });
  }

  renderGenders(arr) {
    return (
      <View style={styles.genderRow}>
        {arr.map((gender, index)=>this.renderGenderItem(gender, index))}
      </View>
    )
  }

  //性别
  renderGenderItem(gender, index) {
    return (
      <TouchableHighlight
        onPress={()=> {
          this.checkGender(gender, index)
        }}
        key={index}
        activeOpacity={0.5}
        underlayColor="rgba(247,245,245,0.7)">
        <View style={styles.genderRadioGroup}>
          <Icon name={gender.iconName} size={24}/>
          <Text style={styles.genderLabel}>{gender.text}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  //展开更多按钮
  renderMoreButton() {
    return (
      <TouchableHighlight
        onPress={()=> {
          this.expandMore()
        }}
        style={styles.expandTips}
        activeOpacity={0.5}
        underlayColor="rgba(247,245,245,0.7)">
        <View style={styles.expandRow}>
          <Text style={styles.expandText}>{this.state.expandText}</Text>
          <Icon name={this.state.expandIconName} size={24}/>
        </View>
      </TouchableHighlight>
    )
  }

  //展开更多方法
  expandMore() {
    Keyboard.dismiss();
    this.setState({
      expandStatus: !this.state.expandStatus,
      expandText: !this.state.expandStatus ? '点击收起' : '点击展开更多(选填)',
      expandIconName: !this.state.expandStatus ? 'angle-double-up' : 'angle-double-down'
    });
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
    switch (text) {
      case 'emotionStatusText':
        this.setState({emotionStatusText: pickedValue});
        break;
      case 'educationStatusText':
        this.setState({educationStatusText: pickedValue});
        break;
      case 'heightText':
        this.setState({heightText: pickedValue});
        break;
      case 'weightText':
        this.setState({weightText: pickedValue});
        break;
      case 'professionText':
        this.setState({professionText: pickedValue});
        break;
      case 'incomeText':
        this.setState({incomeText: pickedValue});
        break;
      case 'mapPrecisionText':
        this.setState({mapPrecisionText: pickedValue});
        break;
      case 'religionText':
        this.setState({religionText: pickedValue});
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

  _createDateData() {
    let date = [];
    let currentYear = new Date().getFullYear() - 1;
    for (let i = 1950; i < currentYear + 1; i++) {
      let month = [];
      for (let j = 1; j < 13; j++) {
        let day = [];
        if (j === 2) {
          for (let k = 1; k < 29; k++) {
            day.push(k + '日');
          }
          //Leap inputday for years that are divisible by 4, such as 2000, 2004
          if (i % 4 === 0) {
            day.push(29 + '日');
          }
        }
        else if (j in {1: 1, 3: 1, 5: 1, 7: 1, 8: 1, 10: 1, 12: 1}) {
          for (let k = 1; k < 32; k++) {
            day.push(k + '日');
          }
        }
        else {
          for (let k = 1; k < 31; k++) {
            day.push(k + '日');
          }
        }
        let _month = {};
        _month[j + '月'] = day;
        month.push(_month);
      }
      let _date = {};
      _date[i + '年'] = month;
      date.push(_date);
    }
    return date;
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

  _showDatePicker() {
    Keyboard.dismiss();
    RNPicker.init({
      pickerData: this._createDateData(),
      selectedValue: ['1992年', '1月', '1日'],
      onPickerConfirm: pickedValue => {
        this.setState({
          birthYearText: pickedValue[0].substr(0, 4) + '-' + pickedValue[1].replace('月', '') + '-' + pickedValue[2].replace('日', ''),
          birthYear: pickedValue[0].substr(0, 4) + '-' + pickedValue[1].replace('月', '') + '-' + pickedValue[2].replace('日', '')
        });
        RNPicker.hide();
      },
      onPickerCancel: pickedValue => {
        RNPicker.hide();
      },
      onPickerSelect: pickedValue => {
        this.setState({
          birthYearText: pickedValue[0].substr(0, 4) + '-' + pickedValue[1].replace('月', '') + '-' + pickedValue[2].replace('日', ''),
          birthYear: pickedValue[0].substr(0, 4) + '-' + pickedValue[1].replace('月', '') + '-' + pickedValue[2].replace('日', '')
        });
      }
    });
    RNPicker.show();
  }

  //出生年
  renderBirthYearBtn() {
    return (
      <TouchableHighlight
        onPress={()=> {
          this._showDatePicker()
        }}
        style={styles.emotionStatusIOS}
        activeOpacity={0.5}
        underlayColor="rgba(247,245,245,0.7)">
        <View style={styles.emotionStatusIOSView}>
          <Text style={styles.emotionStatusIOSText}>
            {this.state.birthYearText}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  renderDatingPurpose() {
    let arr = DictMap.DatingPurposeDict;
    return (
      <View style={styles.checkBoxView}>
        {arr.map((item, index)=> {
          return (
            <CheckBox
              key={index}
              label={item.Value}
              labelStyle={styles.checkBoxLabel}
              checked={item.Checked}
              style={styles.checkBoxItem}
              onChange={(checked)=> {
                item.Checked = checked;
                if (checked) {
                  DatingPurposeSelectCopy.push(item);
                } else {
                  let index = DatingPurposeSelectCopy.findIndex((i)=> {
                    return i.Key == item.Key;
                  });
                  if (index >= 0) {
                    DatingPurposeSelectCopy.splice(index, 1);
                  }
                }
              }}/>
          )
        })}
      </View>
    )
  }

  renderMoreForm() {
    return (
      <Animated.View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'身高'}</Text>
          {this.renderSinglePicker('heightText', 'height', this._createHeightData())}
          <Text style={styles.rightLabel}>{'cm'}</Text>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'体重'}</Text>
          {this.renderSinglePicker('weightText', 'weight', this._createWeightData())}
          <Text style={styles.rightLabel}>{'kg'}</Text>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'职业'}</Text>
          {this.renderSinglePicker('professionText', 'profession', DictMap['JobTypeDict'])}
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'收入'}</Text>
          {this.renderSinglePicker('incomeText', 'income', DictMap['IncomeLevelDict'])}
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'所在地'}</Text>
          <TextInput
            style={[styles.input, styles.fullInput]}
            underlineColorAndroid={'transparent'}
            value={this.state.location}
            onChangeText={(location)=>this.setState({location})}
            maxLength={50}/>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'情感状态'}</Text>
          {this.renderSinglePicker('emotionStatusText', 'emotionStatus', DictMap['MarriageStatusDict'])}
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'家乡'}</Text>
          <TextInput
            style={[styles.input, styles.fullInput]}
            underlineColorAndroid={'transparent'}
            value={this.state.hometown}
            onChangeText={(hometown)=>this.setState({hometown})}
            maxLength={15}/>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'地图精度'}</Text>
          {this.renderSinglePicker('mapPrecisionText', 'mapPrecision', this._createMapData())}
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'民族'}</Text>
          <TextInput
            style={[styles.input, styles.fullInput]}
            underlineColorAndroid={'transparent'}
            value={this.state.ethnicity}
            onChangeText={(ethnicity)=>this.setState({ethnicity})}
            maxLength={15}/>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'学历'}</Text>
          {this.renderSinglePicker('educationStatusText', 'educationStatus', DictMap['EducationLevelDict'])}
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'信仰'}</Text>
          {this.renderSinglePicker('religionText', 'religion', DictMap['ReligionDict'])}
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'联系方式'}</Text>
          <TextInput
            style={[styles.input, styles.fullInput]}
            underlineColorAndroid={'transparent'}
            maxLength={15}/>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'兴趣爱好'}</Text>
          <TextInput
            style={[styles.input, styles.fullInput]}
            underlineColorAndroid={'transparent'}
            value={this.state.interest}
            onChangeText={(interest)=>this.setState({interest})}
            maxLength={15}/>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'自我评价'}</Text>
          <TextInput
            style={[styles.input, styles.fullInput]}
            underlineColorAndroid={'transparent'}
            value={this.state.selfEvaluation}
            onChangeText={(selfEvaluation)=>this.setState({selfEvaluation})}
            maxLength={100}/>
        </View>
      </Animated.View>
    )
  }

  renderBody() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={true}>
          <View style={styles.needItems}
                pointerEvents={'box-none'}
                onStartShouldSetResponderCapture={()=> {
                  return false
                }}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>{'昵称'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.nickName}
                onChangeText={(nickName)=>this.setState({nickName})}
                maxLength={15}/>
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>{'出生日期'}</Text>
              {this.renderBirthYearBtn()}
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>{'性别'}</Text>
              {this.renderGenders(this.state.genderArr)}
            </View>
            <View style={styles.listItem}>
              <Text style={styles.datingPurposeLabel}>{'交友目的'}</Text>
              {this.renderDatingPurpose()}
            </View>
            <Text style={styles.genderTips}>{'注册成功后,性别和出生年月不可修改'}</Text>
            {this.renderMoreButton()}
            {this.state.expandStatus ? this.renderMoreForm() : null}
          </View>
          <NBButton
            block
            style={{marginBottom: 30}}
            onPress={()=> {
              this.goNext(this.state, DatingPurposeSelectCopy)
            }}>
            下一步
          </NBButton>
        </ScrollView>
      </View>
    )
  }

  renderSpinner() {
    if (this.state.loading) {
      return (
        <Spinner animating={this.state.loading}/>
      )
    }
  }
}

export default connect((state)=> {
  return {
    ...state
  }
})(UserProfile)