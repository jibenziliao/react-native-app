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
  ActionSheetIOS
} from 'react-native'
import BaseComponent from '../base/BaseComponent'
import MainContainer from '../containers/MainContainer'
import Photos from './Photos'
import Button from 'react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import Modal from 'react-native-modalbox'
import {Button as NBButton} from 'native-base'
import {StyleConfig, CommonStyles} from '../style'
import RNPicker from 'react-native-picker'


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
  }
});

let navigator;

class UserProfile extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [
        {text: '男', iconName: 'check-circle-o', checked: true},
        {text: '女', iconName: 'circle-o', checked: false},
        {text: '保密', iconName: 'circle-o', checked: false}
      ],
      expandText: '点击展开更多(选填)',
      expandStatus: false,
      expandIconName: 'angle-double-down',
      emotionStatus: 0,
      emotionStatusText: '单身',
      emotionStatusArr: [
        {label: '请选择', value: 0},
        {label: '保密', value: 1},
        {label: '单身', value: 2},
        {label: '恋爱中', value: 3},
        {label: '已婚', value: 4},
        {label: '同性恋', value: 5},
      ],
      heightArr: this.initHeight(),
      heightText: '175',
      height: 175,
      weightArr: this.initWeight(),
      weightText: '68',
      weight: 68,
      birthYearArr: this.initBirthYear(),
      birthYear: 1992,
      birthYearText: '1992',
      educationStatusArr: [
        {label: '小学', value: 1},
        {label: '初中', value: 2},
        {label: '高中', value: 3},
        {label: '大学', value: 4},
        {label: '研究生', value: 5}
      ],
      educationStatus: 4,
      educationStatusText: '大学',
      professionText:'IT',
      profession:'0'
    };
    navigator = this.props.navigator;
  };

  initHeight() {
    let heightArr = [];
    heightArr.push({label: '请选择', value: 0});
    for (let i = 100; i < 200; i++) {
      heightArr.push({label: i + '', value: i});
    }
    return heightArr;
  }

  initWeight() {
    let weightArr = [];
    weightArr.push({label: '请选择', value: 0});
    for (let i = 30; i < 200; i++) {
      weightArr.push({label: i + '', value: i});
    }
    return weightArr;
  }

  initBirthYear() {
    let birthYearArr = [];
    let currentYear=new Date().getFullYear();
    for (let i = 1950; i < currentYear+1; i++) {
      birthYearArr.push({label: i + '', value: i});
    }
    return birthYearArr;
  }

  getNavigationBarProps() {
    return {
      title: '个人资料'
    };
  }

  //因为有弹出的日期选择框,这里需要自定义返回方法,以便在点击返回时自动关闭日期弹出框(如果之前没有手动关闭的话)
  onLeftPressed(){
    const {navigator}=this.props;
    RNPicker.isPickerShow((status)=>{if(status) RNPicker.hide()});
    navigator.pop();
  }

  //下一步
  goNext() {
    const {navigator} =this.props;
    navigator.push({
      component: Photos,
      name: 'Photos'
    });
  }

  //去首页
  goHome() {
    const {navigator} =this.props;
    navigator.push({
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

  //情感状态
  renderEmotionStatus() {
    if (Platform.OS == 'ios') {
      return (
        <TouchableHighlight
          onPress={()=> {
            this.openEmotionStatusIOS()
          }}
          style={styles.emotionStatusIOS}
          activeOpacity={0.5}
          underlayColor="rgba(247,245,245,0.7)">
          <View style={styles.emotionStatusIOSView}>
            <Text style={styles.emotionStatusIOSText}>{this.state.emotionStatusText}</Text>
            <Icon name={'angle-down'} size={24}/>
          </View>
        </TouchableHighlight>
      )
    } else {
      return (
        <Picker
          style={{flex: 1, height: 40}}
          selectedValue={this.state.emotionStatus}
          onValueChange={(value)=> {
            this.setState({emotionStatus: value})
          }}>
          {this.renderPickerItem(this.state.emotionStatusArr)}
        </Picker>
      )
    }
  }

  //学历
  renderEducationStatus() {
    if (Platform.OS == 'ios') {
      return (
        <TouchableHighlight
          onPress={()=> {
            this.openEducationStatusIOS()
          }}
          style={styles.emotionStatusIOS}
          activeOpacity={0.5}
          underlayColor="rgba(247,245,245,0.7)">
          <View style={styles.emotionStatusIOSView}>
            <Text style={styles.emotionStatusIOSText}>{this.state.educationStatusText}</Text>
            <Icon name={'angle-down'} size={24}/>
          </View>
        </TouchableHighlight>
      )
    } else {
      return (
        <Picker
          style={{flex: 1, height: 40}}
          selectedValue={this.state.educationStatus}
          onValueChange={(value)=> {
            this.setState({educationStatus: value})
          }}>
          {this.renderPickerItem(this.state.educationStatusArr)}
        </Picker>
      )
    }
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
    this.setState({
      expandStatus: !this.state.expandStatus,
      expandText: !this.state.expandStatus ? '点击收起' : '点击展开更多(选填)',
      expandIconName: !this.state.expandStatus ? 'angle-double-up' : 'angle-double-down'
    });
  }

  //身高
  renderHeightBtn() {
    if (Platform.OS == 'ios') {
      return (
        <TouchableHighlight
          onPress={()=> {
            this.openHeightPicker()
          }}
          style={styles.emotionStatusIOS}
          activeOpacity={0.5}
          underlayColor="rgba(247,245,245,0.7)">
          <View style={styles.emotionStatusIOSView}>
            <Text style={styles.emotionStatusIOSText}>
              {this.state.heightText}
            </Text>
          </View>
        </TouchableHighlight>
      )
    } else {
      return (
        <Picker
          style={{height: 40, flex: 1}}
          selectedValue={this.state.height}
          onValueChange={(value)=> {
            this.setState({height: value})
          }}>
          {this.renderPickerItem(this.state.heightArr)}
        </Picker>
      )
    }
  }

  //身高通用组件
  renderHeightPicker(){
    return(
      <TouchableHighlight
        onPress={()=> {
          this._showHeightPicker()
        }}
        style={styles.emotionStatusIOS}
        activeOpacity={0.5}
        underlayColor="rgba(247,245,245,0.7)">
        <View style={styles.emotionStatusIOSView}>
          <Text style={styles.emotionStatusIOSText}>
            {this.state.heightText}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  //体重通用组件
  renderWeightPicker(){
    return(
      <TouchableHighlight
        onPress={()=> {
          this._showWeightPicker()
        }}
        style={styles.emotionStatusIOS}
        activeOpacity={0.5}
        underlayColor="rgba(247,245,245,0.7)">
        <View style={styles.emotionStatusIOSView}>
          <Text style={styles.emotionStatusIOSText}>
            {this.state.weightText}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  //通用选择弹窗显示文本方法
  renderSinglePicker(text,value,_createData){
    return(
      <TouchableHighlight
        onPress={()=> {
          this._showPicker(_createData,text,value)
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

  _updateState(text,value,pickedValue){
    switch (text){
      case 'emotionStatusText':
        this.setState({emotionStatusText:pickedValue});
        break;
      case 'educationStatusText':
        this.setState({educationStatusText:pickedValue});
        break;
      case 'heightText':
        this.setState({heightText:pickedValue});
        break;
      case 'weightText':
        this.setState({weightText:pickedValue});
        break;
      case 'professionText':
        this.setState({professionText:pickedValue});
        break;
      default:
        console.error('设置数据出错!');
        break;
    }
    let index;
    switch (value){
      case 'emotionStatus':
        index=this._createEmotionData().indexOf(pickedValue);
        this.setState({emotionStatus:index});
        break;
      case 'educationStatus':
        index=this._createEducationData().indexOf(pickedValue);
        this.setState({educationStatus:index});
        break;
      case 'height':
        this.setState({height:parseInt(pickedValue)});
        break;
      case 'weight':
        this.setState({weight:parseInt(pickedValue)});
        break;
      case 'profession':
        index=this._createProfessionData().indexOf(pickedValue);
        this.setState({profession:pickedValue});
        break;
      default:
        console.error('设置数据出错');
        break;
    }
  }

  _showPicker(_createData,text,value){
    RNPicker.init({
      pickerData: _createData,
      selectedValue: [this.state[`${text}`]],
      onPickerConfirm: pickedValue => {
        this._updateState(text,value,pickedValue[0]);
        RNPicker.hide();
      },
      onPickerCancel: pickedValue => {
        RNPicker.hide();
      },
      onPickerSelect: pickedValue => {
        this._updateState(text,value,pickedValue[0]);
      }
    });
    RNPicker.show();
  }

  _showHeightPicker(){
    RNPicker.init({
      pickerData: this._createHeightData(),
      selectedValue: ['175'],
      onPickerConfirm: pickedValue => {
        this.setState({
          heightText:pickedValue[0],
          height:parseInt(pickedValue[0])
        });
        RNPicker.hide();
      },
      onPickerCancel: pickedValue => {
        RNPicker.hide();
      },
      onPickerSelect: pickedValue => {
        this.setState({
          heightText:pickedValue[0],
          height:parseInt(pickedValue[0])
        });
      }
    });
    RNPicker.show();
  }

  _showWeightPicker(){
    RNPicker.init({
      pickerData: this._createWeightData(),
      selectedValue: ['68'],
      onPickerConfirm: pickedValue => {
        this.setState({
          weightText:pickedValue[0],
          weight:parseInt(pickedValue[0])
        });
        RNPicker.hide();
      },
      onPickerCancel: pickedValue => {
        RNPicker.hide();
      },
      onPickerSelect: pickedValue => {
        this.setState({
          weightText:pickedValue[0],
          weight:parseInt(pickedValue[0])
        });
      }
    });
    RNPicker.show();
  }

  //体重
  renderWeightBtn() {
    if (Platform.OS == 'ios') {
      return (
        <TouchableHighlight
          onPress={()=> {
            this.openWeightPicker()
          }}
          style={styles.emotionStatusIOS}
          activeOpacity={0.5}
          underlayColor="rgba(247,245,245,0.7)">
          <View style={styles.emotionStatusIOSView}>
            <Text style={styles.emotionStatusIOSText}>
              {this.state.weightText}
            </Text>
          </View>
        </TouchableHighlight>
      )
    } else {
      return (
        <Picker
          style={{height: 40, flex: 1}}
          selectedValue={this.state.weight}
          onValueChange={(value)=> {
            this.setState({weight: value})
          }}>
          {this.renderPickerItem(this.state.weightArr)}
        </Picker>
      )
    }
  }

  _createDateData() {
    let date = [];
    let currentYear = new Date().getFullYear();
    for (let i = 1950; i < currentYear+1; i++) {
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

  _createHeightData(){
    let data=[];
    for(let i=100;i<200;i++){
      data.push(i+'')
    }
    return data;
  }

  _createWeightData(){
    let data=[];
    for(let i=30;i<200;i++){
      data.push(i+'')
    }
    return data;
  }

  _createEmotionData(){
    return ['请选择','保密','单身','恋爱中','已婚','同性恋'];
  }

  _createEducationData(){
    return ['小学','初中','高中','大学','研究生'];
  }

  _createProfessionData(){
    return ['IT','制造','医疗','金融','商业','文化','艺术','法律','教育','行政','模特','空姐','学生','其他职业'];
  }

  _showDatePicker() {
    RNPicker.init({
      pickerData: this._createDateData(),
      selectedValue: ['1992年', '1月', '1日'],
      onPickerConfirm: pickedValue => {
        this.setState({
          birthYearText:pickedValue[0].substr(0,4),
          birthYear:parseInt(pickedValue[0].substr(0,4))
        });
        RNPicker.hide();
      },
      onPickerCancel: pickedValue => {
        RNPicker.hide();
      },
      onPickerSelect: pickedValue => {
        this.setState({
          birthYearText:pickedValue[0].substr(0,4),
          birthYear:parseInt(pickedValue[0].substr(0,4))
        });
      }
    });
    RNPicker.show();
  }

  //出生年
  renderBirthYearBtn() {
    if (Platform.OS == 'ios') {
      return (
        /*<TouchableHighlight
          onPress={()=> {
            this.openBirthYearPicker()
          }}
          style={styles.emotionStatusIOS}
          activeOpacity={0.5}
          underlayColor="rgba(247,245,245,0.7)">
          <View style={styles.emotionStatusIOSView}>
            <Text style={styles.emotionStatusIOSText}>
              {this.state.birthYearText}
            </Text>
          </View>
        </TouchableHighlight>*/
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
    } else {
      return (
        /*<Picker
          style={{height: 40, flex: 1}}
          selectedValue={this.state.birthYear}
          onValueChange={(value)=> {
            this.setState({birthYear: value})
          }}>
          {this.renderPickerItem(this.state.birthYearArr)}
        </Picker>*/
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
  }

  openEmotionStatusIOS() {
    this.refs.emotion.open();
  }

  openEducationStatusIOS() {
    this.refs.education.open();
  }

  openHeightPicker() {
    this.refs.heightPicker.open()
  }

  openWeightPicker() {
    this.refs.weightPicker.open();
  }

  openBirthYearPicker() {
    this.refs.birthYearPicker.open();
  }

  renderMoreForm() {
    return (
      <Animated.View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'身高'}</Text>
          {/*{this.renderHeightBtn()}*/}
          {/*{this.renderHeightPicker()}*/}
          {this.renderSinglePicker('heightText','height',this._createHeightData())}
          <Text style={styles.rightLabel}>{'cm'}</Text>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'体重'}</Text>
          {/*{this.renderWeightBtn()}*/}
          {/*{this.renderWeightPicker()}*/}
          {this.renderSinglePicker('weightText','weight',this._createWeightData())}
          <Text style={styles.rightLabel}>{'kg'}</Text>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'职业'}</Text>
          {this.renderSinglePicker('professionText','profession',this._createProfessionData())}
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'收入'}</Text>
          <TextInput
            style={[styles.input, styles.fullInput]}
            underlineColorAndroid={'transparent'}
            maxLength={15}/>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'所在地'}</Text>
          <TextInput
            style={[styles.input, styles.fullInput]}
            underlineColorAndroid={'transparent'}
            maxLength={15}/>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'情感状态'}</Text>
          {/*{this.renderEmotionStatus()}*/}
          {this.renderSinglePicker('emotionStatusText','emotionStatus',this._createEmotionData())}
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'家乡'}</Text>
          <TextInput
            style={[styles.input, styles.fullInput]}
            underlineColorAndroid={'transparent'}
            maxLength={15}/>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'学历'}</Text>
          {/*{this.renderEducationStatus()}*/}
          {this.renderSinglePicker('educationStatusText','educationStatus',this._createEducationData())}
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'信仰'}</Text>
          <TextInput
            style={[styles.input, styles.fullInput]}
            underlineColorAndroid={'transparent'}
            maxLength={15}/>
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
            maxLength={15}/>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'自我评价'}</Text>
          <TextInput
            style={[styles.input, styles.fullInput]}
            underlineColorAndroid={'transparent'}
            maxLength={15}/>
        </View>
      </Animated.View>
    )
  }

  renderPickerItem(arr) {
    if (Platform.OS == 'ios') {
      return arr.map((item, index)=> {
        return <PickerIOS.Item label={item.label} value={item.value} key={index}/>
      })
    } else {
      return arr.map((item, index)=> {
        return <Picker.Item label={item.label} value={item.value} key={index}/>
      })
    }
  }

  renderEmotionStatusText(value) {
    const emotionStatusIOS = this.state.emotionStatusArr.find((item)=> {
      return item.value == value;
    }).label;
    this.setState({emotionStatusText: emotionStatusIOS});
  }

  renderHeightText(value) {
    const heightTextIOS = this.state.heightArr.find((item)=> {
      return item.value == value;
    }).label;
    this.setState({heightText: heightTextIOS});
  }

  renderWeightText(value){
    const weightTextIOS=this.state.weightArr.find((item)=>{
      return item.value==value;
    }).label;
    this.setState({weightText:weightTextIOS});
  }

  renderBirthYearText(value) {
    const birthYearTextIOS = this.state.birthYearArr.find((item)=> {
      return item.value == value;
    }).label;
    this.setState({birthYearText: birthYearTextIOS});
  }

  renderEducationStatusText(value) {
    const educationStatusText = this.state.educationStatusArr.find((item)=> {
      return item.value == value;
    }).label;
    this.setState({educationStatusText: educationStatusText});
  }

  renderBody() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          keyboardDismissMode={'none'}
          keyboardShouldPersistTaps={true}>
          <View style={styles.needItems}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>{'昵称'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                maxLength={15}/>
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>{'出生年'}</Text>
              {this.renderBirthYearBtn()}
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>{'性别'}</Text>
              {this.renderGenders(this.state.genderArr)}
            </View>
            <Text style={styles.genderTips}>{'注册成功后,性别不可修改'}</Text>
            {this.renderMoreButton()}
            {this.state.expandStatus ? this.renderMoreForm() : null}
          </View>
          <NBButton
            block
            style={{marginBottom: 30}}
            onPress={()=> {
              this.goNext()
            }}>
            下一步
          </NBButton>
          <NBButton
            block
            style={{marginBottom: 30}}
            onPress={()=> {
              this.goHome()
            }}>
            去首页(Test)
          </NBButton>
        </ScrollView>
        {Platform.OS == 'ios' ?
          <Modal
            swipeToClose={false}
            style={styles.modalCenter}
            ref={"emotion"}>
            <PickerIOS
              selectedValue={this.state.emotionStatus}
              onValueChange={(value)=> {
                this.setState({emotionStatus: value});
                this.renderEmotionStatusText(value)
              }}>
              {this.renderPickerItem(this.state.emotionStatusArr)}
            </PickerIOS>
          </Modal> : null}
        {Platform.OS == 'ios' ?
          <Modal
            swipeToClose={false}
            style={styles.modalCenter}
            ref={"birthYearPicker"}>
            <PickerIOS
              selectedValue={this.state.birthYear}
              onValueChange={(value)=> {
                this.setState({birthYear: value});
                this.renderBirthYearText(value)
              }}>
              {this.renderPickerItem(this.state.birthYearArr)}
            </PickerIOS>
          </Modal> : null}
        {Platform.OS == 'ios' ?
          <Modal
            swipeToClose={false}
            style={styles.modalCenter}
            ref={"heightPicker"}>
            <PickerIOS
              selectedValue={this.state.height}
              onValueChange={(value)=> {
                this.setState({height: value});
                this.renderHeightText(value)
              }}>
              {this.renderPickerItem(this.state.heightArr)}
            </PickerIOS>
          </Modal> : null}
        {Platform.OS == 'ios' ?
          <Modal
            swipeToClose={false}
            style={styles.modalCenter}
            ref={"weightPicker"}>
            <PickerIOS
              selectedValue={this.state.weight}
              onValueChange={(value)=> {
                this.setState({weight: value});
                this.renderWeightText(value)
              }}>
              {this.renderPickerItem(this.state.weightArr)}
            </PickerIOS>
          </Modal> : null}
        {Platform.OS == 'ios' ?
          <Modal
            swipeToClose={false}
            style={styles.modalCenter}
            ref={"education"}>
            <PickerIOS
              selectedValue={this.state.educationStatus}
              onValueChange={(value)=> {
                this.setState({educationStatus: value});
                this.renderEducationStatusText(value);
              }}>
              {this.renderPickerItem(this.state.educationStatusArr)}
            </PickerIOS>
          </Modal> : null}
      </View>
    )
  }
}

export default UserProfile