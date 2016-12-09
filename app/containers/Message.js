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
import signalr from 'react-native-signalr'
import * as Storage from '../utils/Storage'
import {URL_DEV, TIME_OUT} from '../constants/Constant'
import CookieManager from 'react-native-cookies'


let navigator;
let connection;
let proxy;
let cookie;
let ws;

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

  componentWillMount(){
    this._getCookie();

  }

  _getCookie(){
    // Get cookies as a request header string
    CookieManager.get(URL_DEV, (err, res) => {
      console.log('Got cookies for url', res);
      // Outputs 'user_session=abcdefg; path=/;'
      cookie=res.rkt;
      //this._initWebSocket();
      this._openWebSocket();
    })
  }

  _openWebSocket(){
    ws=new WebSocket('http://192.168.2.143:12580/signalr/hubs');
    ws.onopen = () => {
      // connection opened

      ws.send('something'); // send a message
    };
    ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
    };
    ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
    };
    /*ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };*/
  }

  sendMsg(){
    ws.send('something'); // send a message
  }

  _initWebSocket(){
    connection = signalr.hubConnection('http://nrb-stage.azurewebsites.net/chat/signalr/hubs');
    connection.logging = true;
    console.log(connection);
    proxy = connection.createHubProxy('ChatCore');

    //receives broadcast messages from a hub function, called "messageFromServer"
    proxy.on('messageFromServer', (message) => {
      console.log(message);

      //Respond to message, invoke messageToServer on server with arg 'hej'
      // let messagePromise =
      //message-status-handling
      messagePromise.done(() => {
        console.log('Invocation of NewContosoChatMessage succeeded');
      }).fail(function (error) {
        console.log('Invocation of NewContosoChatMessage failed. Error: ' + error);
      });
    });

    proxy.on('sayHey', (message) => {
      console.log(message);
    });

    proxy.on('log',(str)=>{
      console.log(str);
    });

    // atempt connection, and handle errors
    connection.start().done(() => {
      proxy.invoke('login', cookie);
      console.log('Now connected, connection ID=' + connection.id);
    }).fail(() => {
      console.log('Failed');
    });

    //connection-handling
    connection.connectionSlow(function () {
      console.log('We are currently experiencing difficulties with the connection.')
    });

    connection.error(function (error) {
      console.log('SignalR error: ' + error)
    });

    proxy.on('getNewMsg', (text) => {
      console.log(text);
      console.log(text[0]['MsgList'][0]['MsgContent']);
      this.onReceive(text[0]['MsgList'][0]['MsgContent']);
    });

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
        <NBButton
          block
          style={{
            height: 40,
            marginBottom: 30
          }}
          onPress={()=> {
            this.sendMsg()
          }}>
          测试发消息
        </NBButton>
      </View>
    )
  }
}

export default Message