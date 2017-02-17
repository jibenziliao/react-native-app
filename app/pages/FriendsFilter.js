/**
 *
 * @author keyy/1501718947@qq.com 16/11/21 18:10
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
  Image,
  Platform,
  PickerIOS,
  ActionSheetIOS,
  Dimensions
} from 'react-native'
import BaseComponent from '../base/BaseComponent'
import MainContainer from '../containers/MainContainer'
import {Button as NBButton} from 'native-base'
import Spinner from '../components/Spinner'
import RNPicker from 'react-native-picker'
import {connect} from 'react-redux'
import * as FriendFilterActions from '../actions/FriendFilter'
import tmpGlobal from '../utils/TmpVairables'
import customTheme from '../themes/MyThemes'
import {ComponentStyles, CommonStyles} from '../style'
import pxToDp from '../utils/PxToDp'

const {width, height}=Dimensions.get('window');

const styles = StyleSheet.create({
  inputArea: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d4cfcf',
    alignItems: 'center'
  },
  inputLabel: {
    width: pxToDp(200)
  },
  pickerItem: {
    flex: 1,
    flexDirection: 'row',
    height: pxToDp(80),
    alignItems: 'center',
    paddingHorizontal: pxToDp(20)
  },
  pickerTextView: {
    flex: 1
  },
  pickerText: {
    textAlignVertical: 'center'
  },
  datingFilterArea: {
    marginTop: pxToDp(60)
  },
  datingFilterTitle: {
    fontSize: pxToDp(36),
    marginBottom: pxToDp(20)
  },
  datingFilter: {
    borderTopWidth: 1,
    borderTopColor: '#d4cfcf'
  },
  datingPurposeLabel: {
    flexDirection: 'row',
    height: pxToDp(80),
    alignItems: 'center'
  },
  listItem: {
    marginTop: pxToDp(20)
  },
  checkBoxView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  checkBoxItem: {
    width: (width - pxToDp(60)) / 2,
    height: pxToDp(80)
  },
  checkBoxLabel: {
    marginLeft: pxToDp(20),
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'nowrap'
  },
  completeBtn: {
    marginVertical: pxToDp(60),
  },
});

const tmpGenderArr = ['不限', '男', '女'];
const tmpPhotoOnlyArr = ['不限', '是', '否'];
const tmpDistanceArr = ['50km以内', '不限'];

class FriendsFilter extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      ageRangeText: '不限',
      minAge: null,
      maxAge: null,
      heightRangeText: '不限',
      minHeight: null,
      maxHeight: null,
      weightRangeText: '不限',
      minWeight: null,
      maxWeight: null,
      genderText: '不限',
      gender: null,
      educationText: '不限',
      datingPurpose: {
        friendShip: false,
        relationShip: false,
        love: false,
        other: false
      },
      photoOnly: null,
      photoOnlyText: '不限',
      matchDistanceText: '50km以内',
      MatchDistance: 50000
    }
  }

  //保存交友信息
  saveFriendFilter(data) {
    const {dispatch}=this.props;
    dispatch(FriendFilterActions.saveFriendFilter(data, (json)=> {
      tmpGlobal.currentUser = json.Result;
      this.goHome();
    }, (error)=> {
      //console.log(error)
    }));
  }

  //去首页
  goHome() {
    const {navigator} =this.props;
    //TODO: 这里的resetTo动画异常
    navigator.resetTo({
      component: MainContainer,
      name: 'MainContainer'
    });
  }

  getNavigationBarProps() {
    return {
      title: '交友信息'
    };
  }

  _createAgeRangeData() {
    let data = [], unLimitAge = [];
    unLimitAge.push('不限');
    for (let m = 18; m < 81; m++) {
      unLimitAge.push(m + '');
    }
    data.push({'不限': unLimitAge});
    for (let i = 18; i < 80; i++) {
      let maxAge = [];
      for (let j = 19; j < 81; j++) {
        if (i < j) {
          if (maxAge.indexOf('不限') < 0) {
            maxAge.push('不限');
          }
          maxAge.push(j + '');
        }
      }
      let _maxAge = {};
      _maxAge[i + ''] = maxAge;
      data.push(_maxAge);
    }
    return data;
  }

  _createHeightRangeData() {
    let data = [];
    data.push({'不限': ['不限']});
    for (let i = 100; i < 200; i++) {
      let maxHeight = [];
      for (let j = 101; j < 201; j++) {
        if (i < j) {
          if (maxHeight.indexOf('不限') < 0) {
            maxHeight.push('不限');
          }
          maxHeight.push(j + '');
        }
      }
      let _maxHeight = {};
      _maxHeight[i + ''] = maxHeight;
      data.push(_maxHeight);
    }
    return data;
  }

  _createWeightRangeData() {
    let data = [];
    data.push({'不限': ['不限']});
    for (let i = 20; i < 200; i++) {
      let maxWeight = [];
      for (let j = 21; j < 201; j++) {
        if (i < j) {
          if (maxWeight.indexOf('不限') < 0) {
            maxWeight.push('不限');
          }
          maxWeight.push(j + '');
        }
      }
      let _maxWeight = {};
      _maxWeight[i + ''] = maxWeight;
      data.push(_maxWeight);
    }
    return data;
  }

  _renderDoublePicker(text, title, minValue, maxValue, _createData) {
    return (
      <TouchableHighlight
        onPress={()=> {
          this._showPicker(_createData, text, title, minValue, maxValue);
        }}
        style={styles.pickerItem}
        activeOpacity={0.5}
        underlayColor="rgba(247,245,245,0.7)">
        <View style={styles.pickerTextView}>
          <Text style={styles.pickerText}>
            {this.state[`${text}`]}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  _showPicker(_createData, text, title, minValue, maxValue) {
    RNPicker.init({
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerTitleText: title,
      pickerData: _createData,
      selectedValue: [`${minValue}`, `${maxValue}`],
      onPickerConfirm: pickedValue => {
        this._updateState(text, pickedValue);
        RNPicker.hide();
      },
      onPickerCancel: pickedValue => {
        RNPicker.hide();
      },
      onPickerSelect: pickedValue => {
        this._updateState(text, pickedValue);
      }
    });
    RNPicker.show();
  }

  _updateState(text, pickedValue) {
    switch (text) {
      case 'ageRangeText':
        if (pickedValue[0] == '不限' && pickedValue[1] == '不限') {
          this.setState({
            ageRangeText: '不限',
            minAge: null,
            maxAge: null
          });
        } else if (pickedValue[0] == '不限' && pickedValue[1] != '不限') {
          this.setState({
            ageRangeText: `${pickedValue[1]}岁以下`,
            minAge: null,
            maxAge: parseInt(pickedValue[1])
          });
        } else if (pickedValue[0] != '不限' && pickedValue[1] == '不限') {
          this.setState({
            ageRangeText: `${pickedValue[0]}岁以上`,
            minAge: parseInt(pickedValue[0]),
            maxAge: null
          });
        } else {
          this.setState({
            ageRangeText: `${pickedValue[0]}-${pickedValue[1]}岁`,
            minAge: parseInt(pickedValue[0]),
            maxAge: parseInt(pickedValue[1])
          });
        }
        break;
      case 'heightRangeText':
        if (pickedValue[0] == '不限') {
          this.setState({
            heightRangeText: '不限',
            minHeight: null,
            maxHeight: null
          });
        } else if (pickedValue[0] != '不限' && pickedValue[1] == '不限') {
          this.setState({
            heightRangeText: `${pickedValue[0]}cm以上`,
            minHeight: parseInt(pickedValue[0]),
            maxHeight: null
          });
        } else {
          this.setState({
            heightRangeText: `${pickedValue[0]}-${pickedValue[1]}cm`,
            minHeight: parseInt(pickedValue[0]),
            maxHeight: parseInt(pickedValue[1])
          });
        }
        break;
      case 'weightRangeText':
        if (pickedValue[0] == '不限') {
          this.setState({
            weightRangeText: '不限',
            minWeight: null,
            maxWeight: null
          });
        } else if (pickedValue[0] != '不限' && pickedValue[1] == '不限') {
          this.setState({
            weightRangeText: `${pickedValue[0]}kg以上`,
            minWeight: parseInt(pickedValue[0]),
            maxWeight: null
          });
        } else {
          this.setState({
            weightRangeText: `${pickedValue[0]}-${pickedValue[1]}kg`,
            minWeight: parseInt(pickedValue[0]),
            maxWeight: parseInt(pickedValue[1])
          });
        }
        break;
      case 'educationText':
        this.setState({
          educationText: pickedValue[0]
        });
        break;
      case 'genderText':
        this.setState({
          genderText: pickedValue[0],
          gender: pickedValue[0] == '不限' ? null : pickedValue[0] == '男'
        });
        break;

      case 'photoOnlyText':
        this.setState({
          photoOnlyText: pickedValue[0],
          photoOnly: pickedValue[0] == '不限' ? null : pickedValue[0] == '是'
        });
        break;
      case 'matchDistanceText':
        this.setState({
          matchDistanceText: pickedValue[0],
          MatchDistance: pickedValue[0] === '50km以内' ? 50000 : 100000000
        });
        break;
      default:
        console.error('设置数据出错!');
        break;
    }
  }

  _renderSinglePicker(text, title, value, _createData) {
    return (
      <TouchableHighlight
        onPress={()=> {
          this._showSinglePicker(_createData, text, title, value);
        }}
        style={styles.pickerItem}
        activeOpacity={0.5}
        underlayColor="rgba(247,245,245,0.7)">
        <View style={styles.pickerTextView}>
          <Text style={styles.pickerText}>
            {this.state[`${text}`]}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  _showSinglePicker(_createData, text, title, value) {
    RNPicker.init({
      pickerTitleText: title,
      pickerConfirmBtnText: '确定',
      pickerCancelBtnText: '取消',
      pickerData: _createData,
      selectedValue: [this.state[`${text}`]],
      onPickerConfirm: pickedValue => {
        this._updateState(text, pickedValue);
        RNPicker.hide();
      },
      onPickerCancel: pickedValue => {
        RNPicker.hide();
      },
      onPickerSelect: pickedValue => {
        this._updateState(text, pickedValue);
      }
    });
    RNPicker.show();
  }

  renderBody() {
    return (
      <View style={ComponentStyles.container}>
        <ScrollView
          style={ComponentStyles.scrollView}
          keyboardDismissMode={'none'}
          keyboardShouldPersistTaps={true}>
          <View style={styles.inputArea}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>{'年龄'}</Text>
              {this._renderDoublePicker('ageRangeText', '请选择年龄范围', this.state.minAge + '', this.state.maxAge + '', this._createAgeRangeData())}
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>{'身高'}</Text>
              {this._renderDoublePicker('heightRangeText', '请选择身高范围', this.state.minHeight + '', this.state.maxHeight + '', this._createHeightRangeData())}
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>{'体重'}</Text>
              {this._renderDoublePicker('weightRangeText', '请选择体重范围', this.state.minWeight + '', this.state.maxWeight + '', this._createWeightRangeData())}
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>{'性别'}</Text>
              {this._renderSinglePicker('genderText', '请选择性别', 'gender', tmpGenderArr)}
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>{'只看有照片的人'}</Text>
              {this._renderSinglePicker('photoOnlyText', '是否只看有照片的人', this.state.gender, tmpPhotoOnlyArr)}
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>{'匹配距离'}</Text>
              {this._renderSinglePicker('matchDistanceText', '请选择匹配距离', this.state.MatchDistance, tmpDistanceArr)}
            </View>
          </View>
          <NBButton
            theme={customTheme}
            block
            textStyle={CommonStyles.btnText}
            style={styles.completeBtn}
            onPress={()=> {
              this.saveFriendFilter(this.state)
            }}>
            完成注册
          </NBButton>
        </ScrollView>
      </View>
    )
  }

  renderSpinner() {
    if (this.props.pendingStatus) {
      return (
        <Spinner animating={this.props.pendingStatus}/>
      )
    }
  }

}

export default connect((state)=> {
  return {
    pendingStatus: state.InitialApp.pending
  }
})(FriendsFilter)