/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 09:54
 * @description
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  InteractionManager
} from 'react-native';
import {getNavigator} from '../navigation/Route'
import BaseComponent from '../base/BaseComponent'
import {Button as NBButton} from 'native-base'
import Login from '../pages/Login'
import MessageDetail from '../pages/MessageDetail'
import {componentStyles} from '../style'

let navigator;
let connection;
let proxy;

class Message extends BaseComponent{
  constructor(props){
    super(props);
    navigator = this.props.navigator;
  }

  getNavigationBarProps() {
    return {
      title: '消息',
      hideLeftButton:true
    };
  }

  _initWebSocket(){
    connection = signalr.hubConnection('http://nrb-stage.azurewebsites.net/chat/signalr/hubs');
    connection.logging = true;
    console.log(connection);
    proxy = connection.createHubProxy('ChatCore');
  }

  goLogin() {
    navigator.push({
      component: Login,
      name: 'Login'
    });
  }

  goMessageDetail() {
    navigator.push({
      component: MessageDetail,
      name: 'MessageDetail'
    })
  }

  renderBody() {
    return(
      <View style={componentStyles.container}>
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
      </View>
    )
  }
}

export default Message