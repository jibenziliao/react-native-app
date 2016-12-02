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
import * as Storage from '../utils/Storage'
import signalr from 'react-native-signalr'
import {Button as NBButton} from 'native-base'
import {StyleConfig, CommonStyles} from '../style'

let navigator;
let connection;
let proxy;

class Mine extends BaseComponent {
  constructor(props) {
    super(props);
    navigator = this.props.navigator;
  }

  getNavigationBarProps() {
    return {
      title: '我的',
      hideLeftButton: true
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
    connection = signalr.hubConnection('http://192.168.2.130:12580/signalr/hubs');
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

    // atempt connection, and handle errors
    connection.start().done(() => {
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
  }

  loginTest() {
    proxy.invoke('login', '1|Test');
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
            this.loginTest()
          }}>
          测试页面跳转
        </NBButton>
      </View>
    )
  }
}

export default Mine