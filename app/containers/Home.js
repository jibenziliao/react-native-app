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

class Home extends BaseComponent {
  constructor(props) {
    super(props);
    navigator = this.props.navigator;

  }

  _showPicker(){
    RNPicker.init({
      pickerData: [58,59,60],
      selectedValue: [59],
      onPickerConfirm: data => {
        console.log(data);
      },
      onPickerCancel: data => {
        console.log(data);
      },
      onPickerSelect: data => {
        console.log(data);
      }
    });
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
            marginVertical:30
          }}
          onPress={()=> {
            this.goMessageDetail()
          }}>
          测试页面跳转
        </NBButton>
        <NBButton
          block
          style={{
            height:40,
            marginBottom:30
          }}
          onPress={()=> {
            this.goLogin()
          }}>
          测试登录
        </NBButton>
        <NBButton
          block
          style={{
            height:40
          }}
          onPress={()=> {
            this._showPicker()
          }}>
          测试日期选择
        </NBButton>
      </View>
    )
  }
}

export default Home