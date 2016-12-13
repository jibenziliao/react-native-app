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
  DeviceEventEmitter,
} from 'react-native'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat'
import CustomView from '../components/CustomView'
import {URL_DEV, TIME_OUT, URL_WS_DEV} from '../constants/Constant'
import * as Storage from '../utils/Storage'
import temGlobal from '../utils/TmpVairables'
import {strToDateTime, dateFormat} from '../utils/DateUtil'

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

class MessageDetail extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: false,//关闭加载历史记录功能
      destroyed: true,
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
        console.log('MessageDetail加载缓存', res);
        let tmpArr = this._getChatRecord(res);
        console.log(tmpArr);
        this.setState({
          messages: [].concat(this._getChatRecord(res).MsgList.reverse())
        }, ()=> {
          this._getNewMsg();
        });
      } else {
        console.log(res, this.state.myUserId);
        console.log('没有聊天记录');
        this._getNewMsg();
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
    this.setState({
      destroyed: false
    }, ()=> {
      this._initOldMessage();
    });
  }

  _getNewMsg() {
    temGlobal.proxy.on('getNewMsg', (obj) => {
      //离开此页面后,不在此页面缓存消息,也不在此页面将消息标为已读
      if (!this.state.destroyed) {
        temGlobal.proxy.invoke('userReadMsg', obj.LastMsgId);
        console.log('MessageDetail页面成功标为已读');
        console.log('MessageDetail页面开始缓存消息');
        this._receiveSaveRecord(JSON.parse(JSON.stringify(obj.MsgPackage)));
      }
      let resMsg = this._getSingleMsg(JSON.parse(JSON.stringify(obj.MsgPackage)), this.state.UserId);
      //页面销毁后,不在此页面接收消息。对方没有发消息过来,但别人发消息过来后,此页面也不会接收消息(如果对方在极短的时间内发了多条,就循环接收)
      if (resMsg.MsgList.length > 0 && !this.state.destroyed) {
        console.log(obj);
        console.log('MessageDetail页面收到了新消息');
        for (let i = 0; i < resMsg.MsgList.length; i++) {
          this.onReceive(resMsg.MsgList[i]);
        }
      }
    });
  }

  //从服务器返回的消息列表中筛选出与当前用户聊天的对象的消息
  _getSingleMsg(data, id) {
    let newMsgList = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < newMsgList.length; i++) {
      for (let j = 0; j < newMsgList[i].MsgList.length; j++) {
        newMsgList[i].MsgList[j] = {
          HasSend: true,
          MsgContent: newMsgList[i].MsgList[j].MsgContent,
          MsgId: newMsgList[i].MsgList[j].MsgId,
          SendTime: this._renderMsgTime(newMsgList[i].MsgList[j].SendTime),
          _id: Math.round(Math.random() * 1000000),
          text: newMsgList[i].MsgList[j].MsgContent,
          createdAt: this._renderMsgTime(newMsgList[i].MsgList[j].SendTime),
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
    console.log(SingleMsg);
    return SingleMsg;
  }

  _renderMsgTime(str) {
    if(str.indexOf('T')>-1){
      return str.split('T')[0] + ' ' + (str.split('T')[1]).split('.')[0];
    }else{
      return str;
    }
  }

  //接收时缓存(同时需要发布缓存成功的订阅,供Message页面监听)
  _receiveSaveRecord(data) {
    console.log('这是从服务器返回的消息',data);
    let newMsgList = [];
    let dataCopy = [];
    newMsgList = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < newMsgList.length; i++) {
      for (let j = 0; j < newMsgList[i].MsgList.length; j++) {
        newMsgList[i].MsgList[j] = {
          MsgContent: newMsgList[i].MsgList[j].MsgContent,
          MsgId: newMsgList[i].MsgList[j].MsgId,
          HasSend: true,
          SendTime: this._renderMsgTime(newMsgList[i].MsgList[j].SendTime),
          _id: Math.round(Math.random() * 1000000),
          text: newMsgList[i].MsgList[j].MsgContent,
          createdAt: this._renderMsgTime(newMsgList[i].MsgList[j].SendTime),
          user: {
            _id: newMsgList[i].SenderId,
            name: newMsgList[i].SenderNickname,
            avatar: newMsgList[i].SenderAvatar,
            myUserId: this.state.myUserId
          }
        };
      }
    }
    dataCopy = JSON.parse(JSON.stringify(newMsgList));
    console.log('待缓存的数据', dataCopy);
    Storage.getItem(`${this.state.myUserId}_MsgList`).then((res)=> {
      if (res !== null && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          for (let j = 0; j < data.length; j++) {
            if (res[i].SenderId === data[j].SenderId) {
              res[i].MsgList = res[i].MsgList.concat(dataCopy[j].MsgList);
              newMsgList.splice(j, 1);
            }
          }
        }
        res = res.concat(newMsgList);
        console.log('已有缓存时,待缓存的数据', res);
        Storage.setItem(`${this.state.myUserId}_MsgList`, res).then(()=> {
          DeviceEventEmitter.emit('MessageCached', {data: res, message: '消息缓存成功'});
        });
      } else {
        //没有历史记录,且服务器第一次推送消息
        Storage.setItem(`${this.state.myUserId}_MsgList`, dataCopy).then(()=> {
          DeviceEventEmitter.emit('MessageCached', {data: res, message: '消息缓存成功'});
        });
      }
    });
  }

  //发送时缓存(同时需要发布订阅,供Message页面监听)
  _sendSaveRecord(data) {
    Storage.getItem(`${this.state.myUserId}_MsgList`).then((res)=> {
      if (res !== null && res.length > 0) {
        let index = res.findIndex((item)=> {
          return item.SenderId === this.state.UserId
        });
        res[index].MsgList.push(data);
        console.log('发送时更新消息缓存数据', res, data);
        Storage.setItem(`${this.state.myUserId}_MsgList`, res).then(()=> {
          DeviceEventEmitter.emit('MessageCached', {data: res, message: '消息缓存成功'});
        });
      } else {
        //没有历史记录,且服务器没有推送任何消息
        let allMsg = [{
          SenderAvatar: this.state.UserAvatar,
          SenderId: this.state.UserId,
          SenderNickname: this.state.Nickname,
          MsgList: [data]
        }];
        Storage.setItem(`${this.state.myUserId}_MsgList`, allMsg).then(()=> {
          DeviceEventEmitter.emit('MessageCached', {data: res, message: '消息缓存成功'});
        });
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
    console.log(messages);
    let singleMsg = {
      MsgContent: messages[0].text,
      MsgId: Math.round(Math.random() * 1000000),
      SendTime: messages[0].createdAt,
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
    console.log('onReceive渲染方法', data);
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          MsgContent:data.text,
          MsgId:data.id,
          HasSend: true,
          _id: data._id,
          text: data.text,
          SendTime:data.createdAt,
          createdAt: strToDateTime(data.createdAt),//从服务器接收的是字符串类型的时间,这里只支持Date类型,存入缓存之前,需要转成字符串时间
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
