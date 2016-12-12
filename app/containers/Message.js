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
  ScrollView,
  ListView,
  RefreshControl,
  TouchableOpacity,
  Image,
  Dimensions,
  DeviceEventEmitter
} from 'react-native'
import {getNavigator} from '../navigation/Route'
import BaseComponent from '../base/BaseComponent'
import {Button as NBButton} from 'native-base'
import {connect} from 'react-redux'
import MessageDetail from '../pages/MessageDetail'
import {componentStyles} from '../style'
import signalr from 'react-native-signalr'
import * as Storage from '../utils/Storage'
import {URL_DEV, TIME_OUT, URL_WS_DEV} from '../constants/Constant'
import CookieManager from 'react-native-cookies'
import Spinner from '../components/Spinner'
import temGlobal from '../utils/TmpVairables'
import * as HomeActions from '../actions/Home'
import {strToDateTime} from '../utils/DateUtil'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  listView: {
    flex: 1
  },
  cardLast: {
    marginBottom: 10
  },
  cardItem: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#cec5c5'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: 10
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between'
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardText: {
    flexWrap: 'nowrap'
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  badgeText: {
    color: '#fff'
  },
  tips: {
    flexDirection: 'row',
    margin: 40
  },
  tipsText: {
    fontSize: 20
  }
});

let navigator;
let connection;
let proxy;
let cookie;
let LastMsgId = null;
let newSingleMsg = null;

const {height, width} = Dimensions.get('window');

class Message extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      messageList: [],
      loading: false,
      currentUser: null
    };
    navigator = this.props.navigator;
  }

  getNavigationBarProps() {
    return {
      title: '消息',
      hideLeftButton: true
    };
  }

  componentWillMount() {
    this.setState({loading: false});
    this._getCurrentUserInfo();
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  //每次收到新的消息,缓存消息列表
  _cacheMessageList(data) {
    Storage.setItem(`${this.state.currentUser.UserId}_MsgList`, data);
  }

  //消息标为已读(更改本地状态,同时webSocket请求标为已读)
  _markAsRead(LastMsgId, SenderId) {

    //标记成功后,需要把已读状态更新到缓存中
    this._updateMsgReadState(SenderId);
  }

  _getCurrentUserInfo() {
    const {dispatch}=this.props;
    dispatch(HomeActions.getCurrentUserProfile('', (json)=> {
      Storage.getItem(`${json.Result.UserId}_MsgList`).then((res)=> {
        if (res !== null) {
          this.setState({
            messageList: res
          });
        }
      });
      this.setState({
        currentUser: json.Result,
      });
      this._getCookie();
    }, (error)=> {
    }));
  }

  _getCookie() {
    CookieManager.get(URL_DEV, (err, res) => {
      console.log('Got cookies for url', res);
      //rkt为当前cookie的key
      cookie = res.rkt;
      this._initWebSocket();
    })
  }

  _initWebSocket() {
    connection = signalr.hubConnection(URL_WS_DEV);
    connection.logging = false;
    console.log(connection);
    proxy = connection.createHubProxy('ChatCore');

    //将proxy保存在全局变量中,以便其他地方使用
    temGlobal.proxy = proxy;

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
      //console.log(str);
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

    proxy.on('getNewMsg', (obj) => {
      console.log(obj);
      console.log('1###收到了新消息');
      LastMsgId = obj.LastMsgId;
      this._margeMessage(obj);
    });
  }

  //合并后台推送过来的消息
  _margeMessage(obj) {
    let newMsgList = [];
    newMsgList = newMsgList.concat(obj.MsgPackage);
    for (let i = 0; i < this.state.messageList.length; i++) {
      for (let j = 0; j < obj.MsgPackage.length; j++) {
        if (this.state.messageList[i].SenderId === obj.MsgPackage[j].SenderId) {
          this.state.messageList[i].MsgList = this.state.messageList[i].MsgList.concat(obj.MsgPackage[j].MsgList);
          newMsgList.splice(j, 1);
        }
      }
    }
    this.state.messageList = this.state.messageList.concat(newMsgList);
    this.setState({
      loading: false,
      messageList: this.state.messageList
    });

  }

  //找出指定用户当前没有读过的消息
  _handleSingleUnReadMsg(rowData) {
    let tmpArr = [];
    for (let i = 0; i < rowData.MsgList.length; i++) {
      if (rowData.MsgList[i].HasSend === false) {
        tmpArr.push(rowData.MsgList[i]);
      }
    }
    return tmpArr;
  }

  //2016-12-12T20:08:27.723355+11:00
  _handleSendDate(str) {
    let newStr = str.split('T')[0] + ' ' + str.split('T')[1].split('.')[0];
    return strToDateTime(newStr);
  }

  //处理聊天界面需要接受的消息
  _handleSingleMsg(rowData) {
    let messages = [];
    let tmpArr = this._handleSingleUnReadMsg(rowData);
    for (let i = 0; i < tmpArr.length; i++) {
      let tmpObj = {
        _id: Math.round(Math.random() * 1000000),
        text: tmpArr[i].MsgContent,
        createdAt: this._handleSendDate(tmpArr[i].SendTime),
        user: {
          _id: rowData.SenderId,
          name: rowData.SenderNickname,
          avatar: rowData.SenderAvatar
        },
      };
      messages.push(tmpObj);
    }
    return messages;
  }

  //如果在消息列表界面收到新消息,点击进入聊天界面,聊天界面需要从缓存中加载历史聊天记录
  _goChat(rowData) {
    this._markAsRead(LastMsgId, rowData.SenderId);
    //去聊天
    navigator.push({
      component: MessageDetail,
      name: 'MessageDetail',
      params: {
        UserId: rowData.SenderId,
        Nickname: rowData.SenderNickname,
        UserAvatar: URL_DEV + rowData.SenderAvatar,
        myUserId: this.state.currentUser.UserId
      }
    })
  }

  //点击消息之后,需要把与此用户相关的所有消息标为已读
  _updateMsgReadState(id) {
    let index = this.state.messageList.findIndex((item)=> {
      return item.SenderId === id;
    });
    for (let j = 0; j < this.state.messageList[index].MsgList.length; j++) {
      this.state.messageList[index].MsgList[j].HasSend = true;
    }
    this.setState({
      messageList: this.state.messageList
    });
  }

  componentDidUpdate() {
    if (LastMsgId) {
      proxy.invoke('userReadMsg', LastMsgId);
      console.log('成功标为已读');
    }
    if (this.state.currentUser) {
      this._cacheMessageList(this.state.messageList);
    }
  }

  _renderMsgTime(str) {
    return str.split('T')[0] + ' ' + (str.split('T')[1]).split('.')[0];
  }

  _renderUnReadCount(data) {
    let tmpArr = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].HasSend === false) {
        tmpArr.push(i);
      }
    }
    if (tmpArr.length > 0) {
      return (
        <View style={styles.badge}>
          <Text style={[styles.cardText, styles.badgeText]}>
            {tmpArr.length}
          </Text>
        </View>
      )
    } else {
      return null;
    }
  }

  renderRowData(rowData) {
    return (
      <TouchableOpacity
        key={rowData.SenderId}
        onPress={()=> {
          this._goChat(rowData)
        }}
        style={styles.cardItem}>
        <Image
          style={styles.avatar}
          source={{uri: URL_DEV + rowData.SenderAvatar}}/>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Text style={styles.cardText}>
              {rowData.SenderNickname}
            </Text>
            <Text>
              {this._renderMsgTime(rowData.MsgList[rowData.MsgList.length - 1].SendTime)}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardText}>
              {rowData.MsgList[rowData.MsgList.length - 1].MsgContent}
            </Text>
            {this._renderUnReadCount(rowData.MsgList)}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderListView(ds, messageList) {
    if (messageList.length > 0) {
      return (
        <ListView
          style={styles.listView}
          dataSource={ds.cloneWithRows(messageList)}
          renderRow={
            this.renderRowData.bind(this)
          }
          enableEmptySections={true}
          onEndReachedThreshold={10}
          initialListSize={10}
          pageSize={10}/>
      )
    } else {
      return (
        <View style={styles.tips}>
          <Text style={styles.tipsText}>{'暂无消息'}</Text>
        </View>
      )
    }

  }

  renderBody() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={styles.container}>
        {this.renderListView(ds, this.state.messageList)}
      </View>
    )
  }

  renderSpinner() {
    if (this.state.loading) {
      return (
        <Spinner animating={this.state.loading}/>
      )
    }
  }

}

export default connect((state)=> {
  return {
    ...state
  }
})(Message);