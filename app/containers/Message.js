/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 09:54
 * @description
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  InteractionManager,
  ScrollView
} from 'react-native'
import {getNavigator} from '../navigation/Route'
import BaseComponent from '../base/BaseComponent'
import {Button as NBButton} from 'native-base'
import Login from '../pages/Login'
import MessageDetail from '../pages/MessageDetail'
import {componentStyles} from '../style'
import signalr from 'react-native-signalr'
import * as Storage from '../utils/Storage'
import {URL_DEV, TIME_OUT, URL_WS_DEV} from '../constants/Constant'
import CookieManager from 'react-native-cookies'

let navigator;
let connection;
let proxy;
let cookie;

class Message extends BaseComponent {
  constructor(props) {
    super(props);
    navigator = this.props.navigator;
  }

  getNavigationBarProps() {
    return {
      title: '消息',
      hideLeftButton: true
    };
  }

  componentWillMount() {
    this._getCookie();

  }

  _getCookie() {
    CookieManager.get(URL_DEV, (err, res) => {
      console.log('Got cookies for url', res);
      cookie = res.rkt;
      this._initWebSocket();
    })
  }

  _initWebSocket() {
    connection = signalr.hubConnection(URL_WS_DEV);
    connection.logging = true;
    console.log(connection);
    proxy = connection.createHubProxy('ChatCore');

    proxy.on('messageFromServer', (message) => {
      console.log(message);

      messagePromise.done(() => {
        console.log('Invocation of NewContosoChatMessage succeeded');
      }).fail(function (error) {
        console.log('Invocation of NewContosoChatMessage failed. Error: ' + error);
      });
    });

    proxy.on('sayHey', (message) => {
      console.log(message);
    });

    proxy.on('log', (str)=> {
      console.log(str);
    });

    connection.start().done(() => {
      proxy.invoke('login', cookie);
      console.log('Now connected, connection ID=' + connection.id);
    }).fail(() => {
      console.log('Failed');
    });

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

  goMessageDetail() {
    navigator.push({
      component: MessageDetail,
      name: 'MessageDetail'
    })
  }

  renderBody() {
    return (
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
      </View>
    )
  }
}

export default Message