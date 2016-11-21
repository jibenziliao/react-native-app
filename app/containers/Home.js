/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 09:54
 * @description
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  InteractionManager
} from 'react-native';
import {getNavigator} from '../navigation/Route'
import BaseComponent from '../base/BaseComponent'
import Button from 'react-native-button'
import MessageDetail from '../pages/MessageDetail'
import Login from '../pages/Login'
import {Button as NBButton} from 'native-base'
import {StyleConfig, CommonStyles, componentStyles} from '../style'
import RNPicker from 'react-native-picker'

let navigator;

function createDateData(){
  let date = [];
  for(let i=1950;i<2050;i++){
    let month = [];
    for(let j = 1;j<13;j++){
      let day = [];
      if(j === 2){
        for(let k=1;k<29;k++){
          day.push(k+'日');
        }
        //Leap day for years that are divisible by 4, such as 2000, 2004
        if(i%4 === 0){
          day.push(29+'日');
        }
      }
      else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
        for(let k=1;k<32;k++){
          day.push(k+'日');
        }
      }
      else{
        for(let k=1;k<31;k++){
          day.push(k+'日');
        }
      }
      let _month = {};
      _month[j+'月'] = day;
      month.push(_month);
    }
    let _date = {};
    _date[i+'年'] = month;
    date.push(_date);
  }
  return date;
}

class Home extends BaseComponent {
  constructor(props) {
    super(props);
    navigator = this.props.navigator;

  }

  _showDatePicker() {
    RNPicker.init({
      pickerData: createDateData(),
      selectedValue: ['2015年', '12月', '12日'],
      onPickerConfirm: pickedValue => {
        console.log('date', pickedValue);
      },
      onPickerCancel: pickedValue => {
        console.log('date', pickedValue);
      },
      onPickerSelect: pickedValue => {
        console.log('date', pickedValue);
      }
    });
    RNPicker.show();
  }

  getNavigationBarProps() {
    return {
      title: '广场',
      hideLeftButton: true
    };
  }

  onRightPressed() {
    console.log('这是继承后的方法');
  }

  goMessageDetail() {
    navigator.push({
      component: MessageDetail,
      name: 'MessageDetail'
    })
  }

  goLogin() {
    navigator.push({
      component: Login,
      name: 'Login'
    });
  }

  renderBody() {
    return (
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <NBButton
          block
          style={{
            height: 40,
            marginVertical: 30
          }}
          onPress={()=> {
            this.goMessageDetail()
          }}>
          测试页面跳转
        </NBButton>
        <NBButton
          block
          style={{
            height: 40,
            marginBottom: 30
          }}
          onPress={()=> {
            this.goLogin()
          }}>
          测试登录
        </NBButton>
        <NBButton
          block
          style={{
            height: 40,
            marginBottom:30
          }}
          onPress={()=> {
            this._showDatePicker()
          }}>
          测试日期选择
        </NBButton>
      </View>
    )
  }
}

export default Home