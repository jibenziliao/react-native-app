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
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat'
import CustomView from '../components/CustomView'
import {URL_DEV, TIME_OUT, URL_WS_DEV} from '../constants/Constant'
import * as Storage from '../utils/Storage'
import temGlobal from '../utils/TmpVairables'
import {strToDateTime} from '../utils/DateUtil'

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
      destroyed: false,
      typingText: null,
      isLoadingEarlier: false,
      ...this.props.route.params
    };

    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

  }

  _initOldMessage() {
    Storage.getItem(`${this.state.myUserId}_MsgList`).then((res)=> {
      if (res !== null) {
        let tmpArr=this._getChatRecord(res);
        console.log(tmpArr);
        this.setState({
          messages: [].concat(this._getChatRecord(res).MsgList)
        })
      } else {
        console.log(res,this.state.myUserId);
        console.log('没有聊天记录');
      }
    });
  }

  //从缓存中找出当前用户与聊天对象用户之间的聊天记录
  _getChatRecord(data) {
    let tmpArr = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].SenderId === this.state.UserId) {
        tmpArr.push(data[i]);
      }
    }
    return tmpArr[0];
  }

  componentDidMount() {
    this._initOldMessage();
    this._getNewMsg();
  }

  _getNewMsg() {
    temGlobal.proxy.on('getNewMsg', (obj) => {
      console.log(obj);
      let objCopy = {...obj};
      console.log(objCopy);
      console.log('2@@@收到了新消息');
      //离开此页面后,不在此页面缓存消息
      if(!this.state.destroyed){
        this._receiveSaveRecord(obj.MsgPackage);
      }
      let resMsg = this._getSingleMsg(objCopy, this.state.UserId);
      //页面销毁后,不在此页面接收消息(如果对方在极短的时间内发了多条,就循环接收)
      if (resMsg.MsgList.length > 0 && !this.state.destroyed) {
        for (let i = 0; i < resMsg.length; i++) {
          this.onReceive(resMsg.MsgList[i]);
        }
      }
    });
  }

  //从服务器返回的消息列表中筛选出与当前用户聊天的对象的消息
  _getSingleMsg(obj, id) {
    let newMsgList = [...obj.MsgPackage];
    for (let i = 0; i < newMsgList.length; i++) {
      for (let j = 0; j < newMsgList[i].MsgList.length; j++) {
        newMsgList[i].MsgList[j] = {
          ...newMsgList[i].MsgList[j],
          _id: Math.round(Math.random() * 1000000),
          text: newMsgList[i].MsgList[j].MsgContent,
          createdAt: this._handleSendDate(newMsgList[i].MsgList[j].SendTime),
          user: {
            _id: newMsgList[i].SenderId,
            name: newMsgList[i].SenderNickname,
            avatar: newMsgList[i].SenderAvatar,
            myUserId: this.state.myUserId
          }
        };
      }
    }

    let SingleMsg = {};
    for (let i = 0; i < newMsgList.length; i++) {
      if (id === newMsgList[i].SenderId) {
        SingleMsg = newMsgList[i];
        break;
      }
    }
    return SingleMsg;
  }

  //接收时缓存
  _receiveSaveRecord(data){
    let newMsgList = [];
    let dataCopy=[];
    newMsgList = newMsgList.concat(data);
    for (let i = 0; i < newMsgList.length; i++) {
      for (let j = 0; j < newMsgList[i].MsgList.length; j++) {
        newMsgList[i].MsgList[j] = {
          ...newMsgList[i].MsgList[j],
          _id: Math.round(Math.random() * 1000000),
          text: newMsgList[i].MsgList[j].MsgContent,
          createdAt: this._handleSendDate(newMsgList[i].MsgList[j].SendTime),
          user: {
            _id: newMsgList[i].SenderId,
            name: newMsgList[i].SenderNickname,
            avatar: newMsgList[i].SenderAvatar,
            myUserId: this.state.myUserId
          }
        };
      }
    }
    dataCopy=[...newMsgList];
    Storage.getItem(`${this.state.myUserId}_MsgList`).then((res)=> {
      if (res !== null && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (res[i].SenderId === data[j].SenderId) {
              res[i].MsgList=res[i].MsgList.concat(data[j].MsgList);
              newMsgList.splice(j, 1);
            }
          }
        }
        res=res.concat(newMsgList);
        Storage.setItem(`${this.state.myUserId}_MsgList`,res);
      }else{
        //没有历史记录,且服务器第一次推送消息
        Storage.setItem(`${this.state.myUserId}_MsgList`, dataCopy);
      }
    });
  }

  //发送时缓存
  _sendSaveRecord(data) {
    Storage.getItem(`${this.state.myUserId}_MsgList`).then((res)=> {
      if (res !== null && res.length > 0) {
        let index=res.findIndex((item)=>{
          return item.SenderId===this.state.UserId
        });
        res[index].MsgList.push(data);
        Storage.setItem(`${this.state.myUserId}_MsgList`, res);
      }else{
        //没有历史记录,且服务器没有推送任何消息
        let allMsg = [{
          SenderAvatar: this.state.UserAvatar,
          SenderId: this.state.UserId,
          SenderNickname: this.state.Nickname,
          MsgList: [data]
        }];
        Storage.setItem(`${this.state.myUserId}_MsgList`, allMsg);
      }
    });
  }

  //页面销毁之前,切换销毁开关,离开此页面后,不再接收消息
  componentWillUnmount() {
    this.state.destroyed = true;
  }

  onLoadEarlier() {
    console.log('点击了加载历史记录');
  }

  //发消息的同时,将消息缓存在本地
  onSend(messages) {
    let singleMsg = {
      HasSend: true,
      _id: Math.round(Math.random() * 1000000),
      text: messages[0].text,
      createdAt: messages[0].createdAt,
      user: {
        _id: this.state.myUserId,
        name: null,//当前用户不需要显示名字
        avatar: null//当前用户不需要显示头像
      },
    };

    this._sendSaveRecord(singleMsg);

    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, singleMsg),
      };
    });

    temGlobal.proxy.invoke('userSendMsgToUser', this.state.UserId, messages[0].text);
  }

  //2016-12-12T20:08:27.723355+11:00
  _handleSendDate(str) {
    let newStr = str.split('T')[0] + ' ' + str.split('T')[1].split('.')[0];
    return strToDateTime(newStr);
  }

  onReceive(data) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          ...data,
          HasSend: true,
          _id: data._id,
          text: data.text,
          createdAt: data.createdAt,
          user: {
            _id: data.user._id,
            name: data.user.name,
            avatar: data.user.avatar
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
