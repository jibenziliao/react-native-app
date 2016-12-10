/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 16:09
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  DeviceEventEmitter
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import {componentStyles} from '../style'
import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat'
import CustomView from '../components/CustomView'
import signalr from 'react-native-signalr'
import {URL_DEV, TIME_OUT, URL_WS_DEV} from '../constants/Constant'
import CookieManager from 'react-native-cookies'
import * as Storage from '../utils/Storage'
import temGlobal from '../utils/TmpVairables'

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});

let connection;
let proxy;
let cookie;

class MessageDetail extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: false,//关闭加载历史记录功能
      destroyed:false,
      typingText: null,
      isLoadingEarlier: false,
      ...this.props.route.params
    };

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

  }

  _getCookie() {
    CookieManager.get(URL_DEV, (err, res) => {
      console.log('Got cookies for url', res);
      cookie = res.rkt;
      this._initWebSocket();
    });
  }

  _initOldMessage() {
    Storage.getItem(`${this.state.myUserId}_ChatWith_${this.state.UserId}`).then((res)=> {
      if (res !== null) {
        this.setState({messages: res});
      } else {
        console.log('没有历史聊天记录');
      }
    });
  }

  componentWillMount() {
    this._initOldMessage();
    //this._getCookie();
    this._isMounted = true;
    /*this.setState(() => {
     return {
     messages: require('../data/messages'),
     };
     });*/

    /*    connection = signalr.hubConnection('http://nrb-stage.azurewebsites.net/chat/signalr/hubs');
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

     proxy.on('log',(str)=>{
     console.log(str);
     });

     proxy.on('sayHey', (message) => {
     console.log(message);
     });

     // atempt connection, and handle errors
     connection.start().done(() => {
     proxy.invoke('login', '1|Test');
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
     });*/

    this._getNewMsg();

  }

  _getNewMsg(){
    temGlobal.proxy.on('getNewMsg', (obj) => {
      console.log(obj);
      console.log('2@@@收到了新消息');
      let resMsg = this._getSingleMsg(obj, this.state.UserId);
      if (resMsg.length > 0 && !this.state.destroyed) {
        this.onReceive(this._getSingleMsg(obj, this.state.UserId)[0].MsgContent);
      }
    });
  }

  _initWebSocket() {
    connection = signalr.hubConnection('http://nrb-stage.azurewebsites.net/chat/signalr/hubs');
    connection.logging = true;
    console.log(connection);
    proxy = connection.createHubProxy('ChatCore');

    proxy.on('messageFromServer', (message) => {
      console.log('只是服务器返回的数据',message);

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

    proxy.on('log', (str)=> {
      console.log(str);
    });

    /*connection.start().done(() => {
      proxy.invoke('login', cookie);
      console.log('Now connected, connection ID=' + connection.id);
    }).fail(() => {
      console.warn('WS连接开启失败');
    });*/

    this._socketLogin();

    connection.connectionSlow(function () {
      console.log('We are currently experiencing difficulties with the connection.')
    });

    connection.error(function (error) {
      console.log('SignalR error: ' + error)
    });

    proxy.on('getNewMsg', (obj) => {
      console.log(obj);
      console.log('收到了新消息');
      let resMsg = this._getSingleMsg(obj, this.state.UserId);
      if (resMsg.length > 0 && !this.state.destroyed) {
        this.onReceive(this._getSingleMsg(obj, this.state.UserId)[0].MsgContent);
      }
    });

  }

  _socketLogin(){
    connection.start().done(() => {
      proxy.invoke('login', cookie);
      console.log('Now connected, connection ID=' + connection.id);
    }).fail(() => {
      console.warn('WS连接开启失败');
      this._socketLogin();
    });
  }

  _getSingleMsg(obj, id) {
    let newMsgList = [];
    newMsgList = newMsgList.concat(obj.MsgPackage);
    let SingleMsg = [];
    for (let i = 0; i < newMsgList.length; i++) {
      if (id === newMsgList[i].SenderId) {
        SingleMsg = newMsgList[i].MsgList;
      }
    }
    return SingleMsg;
  }

  componentDidMount() {
    let arr = [
      {
        userData: {
          userId: 1,
          userName: 'abc',
          msgContent: '124ewafdsfa',
          time: '',
          userAvatar: ''
        }
      },
      {}
    ];
  }

  componentDidUpdate() {
    this._saveMsgRecord();
  }

  _saveMsgRecord() {
    Storage.setItem(`${this.state.myUserId}_ChatWith_${this.state.UserId}`, this.state.messages);
  }

  //页面销毁之前,保存聊天记录
  componentWillUnmount() {
    this.state.destroyed=true;
    this._isMounted = false;
  }

  //TODO: 加载历史记录
  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, require('../data/old_messages.js')),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });

    temGlobal.proxy.invoke('userSendMsgToUser', this.state.UserId, messages[0].text);

  }

  onReceive(text) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: this.state.UserId,
            name: this.state.Nickname,
            avatar: this.state.UserAvatar
          },
        }),
      };
    });
  }

  renderCustomActions(props) {
    const options = {
      'Action 1': (props) => {
        alert('option 1');
      },
      'Action 2': (props) => {
        alert('option 2');
      },
      'Cancel': () => {
      },
    };
    return (
      <Actions
        {...props}
        options={options}
      />
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  getNavigationBarProps() {
    return {
      title: `${this.state.Nickname}`
    };
  }

  renderBody() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        loadEarlier={this.state.loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        isLoadingEarlier={this.state.isLoadingEarlier }
        user={{
          _id: this.state.myUserId, // sent messages should have same user._id
        }}
        renderActions={this.renderCustomActions}
        renderBubble={this.renderBubble}
        renderCustomView={this.renderCustomView}
        renderFooter={this.renderFooter}
      />
    )
  }

}

export default MessageDetail
