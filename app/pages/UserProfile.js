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
import Button from 'react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import Modal from 'react-native-modalbox'
import {Button as NBButton} from 'native-base'
import {StyleConfig, CommonStyles} from '../style'

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
      emotionStatusIOS: '请选择',
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
      weightArr:this.initWeight(),
      weightText:'60',
      weight:60,
      birthYearArr:this.initBirthYear(),
      birthYear:1995,
      birthYearText:'1995'
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

  initWeight(){
    let weightArr=[];
    weightArr.push({label:'请选择',value:0});
    for(let i=30;i<200;i++){
      weightArr.push({label:i+'',value:i});
    }
    return weightArr;
  }

  initBirthYear(){
    let birthYearArr=[];
    birthYearArr.push({label:'1995',value:1995});
    for(let i=1950;i<2016;i++){
      birthYearArr.push({label:i+'',value:i});
    }
    return birthYearArr;
  }

  getNavigationBarProps() {
    return {
      title: '个人资料'
    };
  }

  goNext() {
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
            <Text style={styles.emotionStatusIOSText}>{this.state.emotionStatusIOS}</Text>
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

  openEmotionStatusIOS() {
    this.refs.emotion.open();
  }

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

  expandMore() {
    this.setState({
      expandStatus: !this.state.expandStatus,
      expandText: !this.state.expandStatus ? '点击收起' : '点击展开更多(选填)',
      expandIconName: !this.state.expandStatus ? 'angle-double-up' : 'angle-double-down'
    });
  }

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
      //android height picker
    }
  }

  renderWeightBtn(){
    if(Platform.OS=='ios'){
      return(
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
    }else{

    }
  }

  renderBirthYearBtn(){
    if(Platform.OS=='ios'){
      return(
        <TouchableHighlight
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
        </TouchableHighlight>
      )
    }else{
      //android picker
    }
  }

  openHeightPicker() {
    this.refs.heightPicker.open()
  }

  openWeightPicker(){
    this.refs.weightPicker.open();
  }

  openBirthYearPicker(){
    this.refs.birthYearPicker.open();
  }

  renderMoreForm() {
    return (
      <Animated.View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'身高'}</Text>
          {this.renderHeightBtn()}
          <Text style={styles.rightLabel}>{'cm'}</Text>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'体重'}</Text>
          {this.renderWeightBtn()}
          <Text style={styles.rightLabel}>{'kg'}</Text>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>{'职业'}</Text>
          <TextInput
            style={[styles.input, styles.fullInput]}
            underlineColorAndroid={'transparent'}
            maxLength={15}/>
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
          {this.renderEmotionStatus()}
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
          <TextInput
            style={[styles.input, styles.fullInput]}
            underlineColorAndroid={'transparent'}
            maxLength={15}/>
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
    this.setState({emotionStatusIOS: emotionStatusIOS});
  }

  renderHeightText(value) {
    const heightTextIOS = this.state.heightArr.find((item)=> {
      return item.value == value;
    }).label;
    this.setState({heightText: heightTextIOS});
  }

  renderBirthYearText(value) {
    const birthYearTextIOS = this.state.birthYearArr.find((item)=> {
      return item.value == value;
    }).label;
    this.setState({birthYearText: birthYearTextIOS});
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
            style={{marginVertical: 30}}
            onPress={()=> {
              this.goNext()
            }}>
            下一步
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
                this.renderHeightText(value)
              }}>
              {this.renderPickerItem(this.state.weightArr)}
            </PickerIOS>
          </Modal> : null}
      </View>
    )
  }
}

export default UserProfile