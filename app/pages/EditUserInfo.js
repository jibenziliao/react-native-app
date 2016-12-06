/**
 * 编辑我的详细资料
 * @author keyy/1501718947@qq.com 16/12/5 16:02
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
  TouchableHighlight
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import ImagePicker from 'react-native-image-picker'
import Spinner from '../components/Spinner'
import {Button as NBButton} from 'native-base'
import RNPicker from 'react-native-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import EditFriendFilter from '../pages/EditFriendFilter'

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
    padding: 10
  },
  userInfo:{
    backgroundColor:'#fff',
    marginBottom:10,
    paddingHorizontal:10
  },
  itemTitle:{
    paddingVertical:10
  },
  listItem:{
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d4cfcf',
    alignItems: 'center'
  },
  topItem:{
    borderTopWidth:1,
    borderTopColor:'#d4cfcf'
  },
  bottomItem:{
    borderBottomWidth:0
  },
  itemRow:{
    flexDirection:'row'
  },
  itemEnter:{
    justifyContent:'space-between',
    alignItems:'center'
  },
  itemIcon:{
    marginRight:10
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
  inputLabel:{
    width:100
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
});

class EditUserInfo extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.route.params,
      ageRangeText:`${this.props.route.params.friendInfo.AgeMin}-${this.props.route.params.friendInfo.AgeMax}岁`,
      heightRangeText:`${this.props.route.params.friendInfo.HeightMin}-${this.props.route.params.friendInfo.HeightMax}cm`
    };
    console.log(this.props.route.params);
  }

  componentDidMount() {

  }

  getNavigationBarProps() {
    return {
      title: '编辑资料',
      hideRightButton: false,
      rightTitle: '完成'
    };
  }

  //点击完成(保存编辑后的个人资料)
  onRightPressed() {

  }

  //前往编辑个人信息中的交友信息
  _editFriendFilter(){
    const {navigator}=this.props;
    navigator.push({
      component:EditFriendFilter,
      name:'EditFriendFilter',
      params:{
        ...this.state.friendInfo
      }
    })
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

  _renderDoublePicker(text, title, minValue, maxValue, _createData) {
    return (
      <TouchableHighlight
        onPress={()=> {
          this._showDoublePicker(_createData, text, title, minValue, maxValue);
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

  //双选择项范围弹窗
  _showDoublePicker(_createData, text, title, minValue, maxValue){
    RNPicker.init({
      pickerTitleText: title,
      pickerData: _createData,
      selectedValue: [`${minValue}`, `${maxValue}`],
      onPickerConfirm: pickedValue => {
        this._updateDoubleState(text, pickedValue);
        RNPicker.hide();
      },
      onPickerCancel: pickedValue => {
        RNPicker.hide();
      },
      onPickerSelect: pickedValue => {
        this._updateDoubleState(text, pickedValue);
      }
    });
    RNPicker.show();
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
      case 'MarriageStatusName':
        this.setState({MarriageStatusName: pickedValue});
        break;
      case 'educationStatusText':
        this.setState({educationStatusText: pickedValue});
        break;
      case 'Height':
        this.setState({heightText: pickedValue});
        break;
      case 'Weight':
        this.setState({weightText: pickedValue});
        break;
      case 'JobTypeName':
        this.setState({JobTypeName: pickedValue});
        break;
      case 'IncomeLevelName':
        this.setState({IncomeLevelName: pickedValue});
        break;
      case 'mapPrecisionText':
        this.setState({mapPrecisionText: pickedValue});
        break;
      default:
        console.error('设置数据出错!');
        break;
    }
    let index;
    switch (value) {
      case 'MarriageStatusName':
        this.setState({MarriageStatusName: pickedValue});
        break;
      case 'educationStatus':
        this.setState({educationStatus: pickedValue});
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
      case 'mapPrecision':
        if (pickedValue == '隐身') {
          this.setState({mapPrecision: null});
        } else {
          pickedValue = pickedValue.substring(0, pickedValue.indexOf('m'));
          this.setState({mapPrecision: pickedValue});
        }
        break;
      default:
        console.error('设置数据出错');
        break;
    }
  }

  _updateDoubleState(text, pickedValue) {
    switch (text) {
      case 'ageRangeText':
        if (pickedValue[0] == '不限' && pickedValue[1] == '不限') {
          this.setState({
            ageRangeText: '不限',
            AgeMin: null,
            AgeMax: null
          });
        } else if (pickedValue[0] == '不限' && pickedValue[1] != '不限') {
          this.setState({
            ageRangeText: `${pickedValue[1]}岁以下`,
            AgeMin: null,
            AgeMax: parseInt(pickedValue[1])
          });
        } else if (pickedValue[0] != '不限' && pickedValue[1] == '不限') {
          this.setState({
            ageRangeText: `${pickedValue[0]}岁以上`,
            AgeMin: parseInt(pickedValue[0]),
            AgeMax: null
          });
        } else {
          this.setState({
            ageRangeText: `${pickedValue[0]}-${pickedValue[1]}岁`,
            AgeMin: parseInt(pickedValue[0]),
            AgeMax: parseInt(pickedValue[1])
          });
        }
        break;
      case 'heightRangeText':
        if (pickedValue[0] == '不限') {
          this.setState({
            heightRangeText: '不限',
            HeightMin: 100,
            HeightMax: 200
          });
        } else if (pickedValue[0] != '不限' && pickedValue[1] == '不限') {
          this.setState({
            heightRangeText: `${pickedValue[0]}cm以上`,
            HeightMin: parseInt(pickedValue[0]),
            HeightMax: 80
          });
        } else {
          this.setState({
            heightRangeText: `${pickedValue[0]}-${pickedValue[1]}cm`,
            HeightMin: parseInt(pickedValue[0]),
            HeightMax: parseInt(pickedValue[1])
          });
        }
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
      default:
        console.error('设置数据出错!');
        break;
    }
  }


  _showPicker(_createData, text, value) {
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
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollViewContainer}>
          <View style={styles.photosContainer}>
            <Text>{'这里相册显示区域'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.itemTitle}>{'基本资料'}</Text>
            <View style={[styles.listItem,styles.topItem]}>
              <Text style={styles.inputLabel}>{'昵称'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Nickname}
                onChangeText={(Nickname)=>this.setState({Nickname})}
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
              <Text style={styles.rightLabel}>{'cm'}</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'职业'}</Text>
              {this.renderSinglePicker('JobTypeName', 'IncomeLevelName', this.state.DictMap.JobTypeDict)}
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
                onChangeText={(Location)=>this.setState({Location})}
                maxLength={50}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'情感状态'}</Text>
              {this.renderSinglePicker('MarriageStatusName', 'MarriageStatusName', this.state.DictMap.MarriageStatusDict)}
            </View>
            <View style={[styles.listItem,styles.bottomItem]}>
              <Text style={styles.inputLabel}>{'家乡'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Hometown}
                onChangeText={(Hometown)=>this.setState({Hometown})}
                maxLength={50}/>
            </View>
          </View>
          <TouchableOpacity
            onPress={()=>{this._editFriendFilter()}}
            style={[styles.userInfo,styles.itemRow,styles.itemEnter]}>
            <Text style={styles.itemTitle}>{'交友信息'}</Text>
            <Icon
              style={styles.itemIcon}
              name={'angle-right'}
              size={20}/>
        </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.itemTitle}>{'交友信息'}</Text>
            <View style={[styles.listItem,styles.topItem]}>
              <Text style={styles.inputLabel}>{'年龄'}</Text>
              {this._renderDoublePicker('ageRangeText', '请选择年龄范围', this.state.friendInfo.AgeMin + '', this.state.friendInfo.AgeMax + '', this._createAgeRangeData())}
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'身高'}</Text>
              {this._renderDoublePicker('heightRangeText', '请选择身高范围', this.state.friendInfo.HeightMin + '', this.state.friendInfo.HeightMax + '', this._createHeightRangeData())}
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'所在地'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Location}
                onChangeText={(Location)=>this.setState({Location})}
                maxLength={15}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'家乡'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Hometown}
                onChangeText={(Hometown)=>this.setState({Hometown})}
                maxLength={15}/>
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.itemTitle}>{'其他'}</Text>
            <View style={[styles.listItem,styles.topItem]}>
              <Text style={styles.inputLabel}>{'学历'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Nickname}
                onChangeText={(Nickname)=>this.setState({Nickname})}
                maxLength={15}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'信仰'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Location}
                onChangeText={(Location)=>this.setState({Location})}
                maxLength={15}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'联系方式'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Hometown}
                onChangeText={(Hometown)=>this.setState({Hometown})}
                maxLength={15}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'兴趣爱好'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Hometown}
                onChangeText={(Hometown)=>this.setState({Hometown})}
                maxLength={15}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'自我评价'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Hometown}
                onChangeText={(Hometown)=>this.setState({Hometown})}
                maxLength={15}/>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

}
export default EditUserInfo
