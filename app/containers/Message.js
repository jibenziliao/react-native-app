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
import BaseComponent from '../base/BaseComponent'
import {connect} from 'react-redux'
import MessageDetail from '../pages/MessageDetail'
import * as Storage from '../utils/Storage'
import {URL_DEV, URL_TOKEN_DEV, URL_WS_DEV} from '../constants/Constant'
import CookieManager from 'react-native-cookies'
import tmpGlobal from '../utils/TmpVairables'
import UserInfo from '../pages/UserInfo'
import {toastLong} from '../utils/ToastUtil'

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
  nameText: {
    overflow: 'hidden',
    flex: 1
  },
  badgeContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
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
  msgContent: {
    overflow: 'hidden',
    flex: 1
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
let reconnectCount = 0;
let cookie;

const {height, width} = Dimensions.get('window');

class Message extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.isOpen,
      messageList: []
    };
    navigator = this.props.navigator;
    tmpGlobal._wsTokenHandler = this._wsTokenHandler.bind(this);
  }

  getNavigationBarProps() {
    return {
      title: '消息',
      leftIcon: {
        name: 'bars',
        size: 26
      }
    };
  }

  onLeftPressed() {
    this.props.menuChange(true);
  }

  componentDidMount() {
    console.log('Message页面加载完成');
    this.subscription = DeviceEventEmitter.addListener('MessageCached', (data)=> {
      this._cacheMessageListener(data)
    });
    this.startReceiveMsgListener = DeviceEventEmitter.addListener('ReceiveMsg', (data)=> {
      this._wsResetOnMessageListener();
    });
    this.reConnectWebSocketListener=DeviceEventEmitter.addListener('reConnectWebSocket', (data)=> {
      reconnectCount = 0;//在聊天页面重连时,重置重连次数
      this._wsTokenHandler();
    });
    InteractionManager.runAfterInteractions(()=> {
      this._initOldMessage();
    })
  }

  //MessageDetail页面更新缓存后,这个页面需要监听,并被动更新
  _cacheMessageListener(data) {
    console.log('Message页面成功监听到MessageDetail页面缓存成功的信号');
    console.log(data);
    Storage.getItem(`${tmpGlobal.currentUser.UserId}_MsgList`).then((res)=> {
      if (res !== null) {
        this.setState({
          messageList: res
        });
      }
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
    this.startReceiveMsgListener.remove();
    this.reConnectWebSocketListener.remove();
  }

  //每次收到新的消息,缓存消息列表(前面已经包装过,这里不需要再次处理,直接存缓存就好了)
  _cacheMessageList(data) {
    console.log('Message页面准备写入缓存的数据', data);
    Storage.setItem(`${tmpGlobal.currentUser.UserId}_MsgList`, data);
  }

  //消息标为已读(更改本地状态)
  _markAsRead(SenderId) {
    let index = this.state.messageList.findIndex((item)=> {
      return item.SenderId === SenderId;
    });
    for (let j = 0; j < this.state.messageList[index].MsgList.length; j++) {
      this.state.messageList[index].MsgList[j].HasSend = true;
    }
    this.setState({
      messageList: this.state.messageList
    }, ()=> {
      //更新缓存中相关消息记录为已读状态
      Storage.getItem(`${tmpGlobal.currentUser.UserId}_MsgList`).then((res)=> {
        for (let i = 0; i < res.length; i++) {
          for (let j = 0; j < res[i].MsgList.length; j++) {
            if (res[i].SenderId === SenderId) {
              res[i].MsgList[j].HasSend = true;
            }
          }
        }
        Storage.setItem(`${tmpGlobal.currentUser.UserId}_MsgList`, res);
      });
    });
  }

  _initOldMessage() {
    Storage.getItem(`${tmpGlobal.currentUser.UserId}_MsgList`).then((res)=> {
      if (res !== null) {
        this.setState({
          messageList: res
        });
      }
      console.log('Message页面从缓存中取出的消息记录', res);
    });
    this._getCookie();
  }

  _getCookie() {
    //先重置cookie
    tmpGlobal.cookie = null;
    cookie = null;
    CookieManager.get(URL_DEV, (err, res) => {
      console.log('Got cookies for url', res);
      //rkt为当前cookie的key
      cookie = res.rkt;
      tmpGlobal.cookie = res.rkt;
      if (tmpGlobal.proxy === null) {
        this._wsTokenHandler();
      }
    })
  }

  //合并后台推送过来的消息(存缓存时,需要将时间以字符串时间形式存储,不能直接存Date类型,JSON.stringify将Date会转换成字符串)
  _margeMessage(data) {
    console.log('需要合并的数据', data);
    let newMsgList = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < newMsgList.length; i++) {
      for (let j = 0; j < newMsgList[i].MsgList.length; j++) {
        newMsgList[i].MsgList[j] = {
          MsgContent: newMsgList[i].MsgList[j].MsgContent,
          MsgId: newMsgList[i].MsgList[j].MsgId,
          HasSend: false,
          SendTime: this._renderMsgTime(newMsgList[i].MsgList[j].SendTime),
          _id: Math.round(Math.random() * 1000000),
          text: newMsgList[i].MsgList[j].MsgContent,
          createdAt: this._renderMsgTime(newMsgList[i].MsgList[j].SendTime),
          user: {
            _id: newMsgList[i].SenderId,
            name: newMsgList[i].SenderNickname,
            avatar: URL_DEV + newMsgList[i].SenderAvatar,
            myUserId: tmpGlobal.currentUser.UserId
          }
        };
      }
    }
    let objCopy = JSON.parse(JSON.stringify(newMsgList));
    console.log(newMsgList);
    console.log(objCopy);

    for (let i = 0; i < this.state.messageList.length; i++) {
      for (let j = 0; j < data.length; j++) {
        if (this.state.messageList[i].SenderId === data[j].SenderId) {
          //若用户头像、昵称有更新,则更新缓存中的头像和昵称
          this.state.messageList[i].SenderNickname = objCopy[j].SenderNickname;
          this.state.messageList[i].SenderAvatar = objCopy[j].SenderAvatar;
          this.state.messageList[i].MsgList = this.state.messageList[i].MsgList.concat(objCopy[j].MsgList);
          newMsgList.splice(j, 1);
        }
      }
    }
    console.log(newMsgList);
    console.log(objCopy);
    //剩下的新消息不和已存在的对话合并,单独占一(多)行
    this.state.messageList = this.state.messageList.concat(newMsgList);
    console.log('合并后的页面消息列表', this.state.messageList);

    this.setState({
      messageList: this.state.messageList
    }, ()=> {
      //在setState的回调里开始缓存消息
      console.log('Message页面开始缓存消息');
      console.log(this.state.messageList);
      //深拷贝
      let params = JSON.parse(JSON.stringify(this.state.messageList));
      this._cacheMessageList(params);
    });
  }

  //获取token后,初始化原生webSocket
  _wsTokenHandler() {
    let getUrl = `${URL_TOKEN_DEV}/signalr/negotiate?clientProtocol=1.5&connectionData=${encodeURIComponent(JSON.stringify([{'name': 'ChatCore'}]))}`;
    //console.log(getUrl);
    fetch(getUrl, {
      method: 'POST'
    }).then((response)=> {
      return response.json()
    }).then((json)=> {
      let wsUrl = `${URL_WS_DEV}/chat/signalr/hubs/signalr/connect?transport=webSockets&clientProtocol=1.5&connectionToken=${encodeURIComponent(json.ConnectionToken)}&connectionData=${encodeURIComponent(JSON.stringify([{'name': 'ChatCore'}]))}`;
      this._wsInitHandler(wsUrl);
    }).catch((e)=> {
      console.log(e);
      this._wsTokenHandler();
    });
  }

  _wsInitHandler(wsUrl) {
    tmpGlobal.ws = null;
    tmpGlobal.ws = new WebSocket(wsUrl);

    tmpGlobal.ws.onopen = ()=> {
      if (tmpGlobal.ws.readyState === 1) {
        this._wsLoginHandler();
        this._wsOpenReceiveHandler();
      }
    };
    tmpGlobal.ws.onmessage = (e) => {
      this._wsNewMsgHandler(JSON.parse(e.data));
    };
    tmpGlobal.ws.onerror = (e) => {
      console.log(e, e.message);
      console.log(tmpGlobal.ws.readyState);
      //tmpGlobal.ws.close();
    };
    tmpGlobal.ws.onclose = (e) => {
      console.log(e);
      console.log(e.code, e.reason);
      reconnectCount += 1;
      if (reconnectCount <= 5) {
        this._wsTokenHandler();//报错后重新初始化webSocket连接
      }else{
        toastLong('聊天功能初始化失败');
      }
    };
  }

  //重置webSocket接收消息的监听器(ws.onmessage的类型是EventListener,进入MessageDetail后会被重新绑定事件,所以离开MessageDetail页面之前需要发布广播,来重置监听器,以便在Message页面或除了MessageDetail以外的页面,能够收到消息)
  _wsResetOnMessageListener() {
    tmpGlobal.ws.onmessage = (e) => {
      this._wsNewMsgHandler(JSON.parse(e.data));
    };
  }

  //原生webSocket开启接收消息方法
  _wsOpenReceiveHandler() {
    let getNewMsg = {
      H: 'chatcore',
      M: 'getNewMsg',
      A: [],
      I: Math.floor(Math.random() * 11)
    };
    tmpGlobal.ws.send(JSON.stringify(getNewMsg));
  }

  //原生webSocket连接登录
  _wsLoginHandler() {
    let loginParams = {
      H: 'chatcore',
      M: 'Login',
      A: [tmpGlobal.cookie],
      I: Math.floor(Math.random() * 11)
    };
    tmpGlobal.ws.send(JSON.stringify(loginParams));
    //console.log(loginParams);
    console.log('ws登录成功');
  }

  //原生webSocket连接从后台接收到的消息处理
  _wsNewMsgHandler(obj) {
    tmpGlobal.webSocketInitState = true;
    //连接成功后,将初始化webSocket连接的方法赋值给全局变量
    tmpGlobal._wsTokenHandler = this._wsTokenHandler;
    if (obj.hasOwnProperty('M')) {
      let tmpArr = obj.M;
      let index = tmpArr.findIndex((item)=> {
        return item.M === 'GetNewMsg'
      });
      if (index > -1) {
        let newMsg = tmpArr[index].A;
        //console.log(newMsg[0]);
        this._wsMarkAsRead(newMsg[0]);
      }
    } else {
      //console.log(obj);
    }
  }

  _wsMarkAsRead(newMsg) {
    let markRead = {
      H: 'chatcore',
      M: 'UserReadMsg',
      A: [newMsg.LastMsgFlag],
      I: Math.floor(Math.random() * 11)
    };
    console.log(markRead);
    let routes = navigator.getCurrentRoutes();
    console.log(routes);
    tmpGlobal.ws.send(JSON.stringify(markRead));
    console.log('ws消息成功标为已读');
    //Message和MessageDetail页面的obj联动(proxy的原因),当前页面是MessageDetail时,此页面停止接收消息,并停止marge
    if (routes[routes.length - 1].name != 'MessageDetail') {
      console.log('Message页面收到了新消息');
      //这里需要用到js复杂对象的深拷贝,这里用JSON转换并不是很安全的方法。
      //http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript/122704#
      this._margeMessage(JSON.parse(JSON.stringify(newMsg.MsgPackage)));
    }
  }

  //如果在消息列表界面收到新消息,点击进入聊天界面,聊天界面需要从缓存中加载历史聊天记录
  _goChat(rowData) {
    this._markAsRead(rowData.SenderId);
    //去聊天
    navigator.push({
      component: MessageDetail,
      name: 'MessageDetail',
      params: {
        UserId: rowData.SenderId,
        Nickname: rowData.SenderNickname,
        UserAvatar: rowData.SenderAvatar,
        myUserId: tmpGlobal.currentUser.UserId
      }
    })
  }

  //点击头像,跳转个人信息详情页
  _goUserInfo(rowData) {
    navigator.push({
      component: UserInfo,
      name: 'UserInfo',
      params: {
        Nickname: rowData.SenderNickname,
        UserId: rowData.SenderId,
        isSelf: false
      }
    });
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
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={[styles.cardText, styles.badgeText]}>
              {tmpArr.length}
            </Text>
          </View>
        </View>
      )
    } else {
      return null;
    }
  }

  //渲染对象用户最新的一条消息(一个rowData.MsgList中包含了对方与自己的聊天信息,这里需显示的最新一条聊天,不分自己还是对方)
  _renderLastMsgContent(rowData) {
    return rowData.MsgList[rowData.MsgList.length - 1].text;
  }

  renderRowData(rowData) {
    return (
      <View
        key={rowData.SenderId}
        style={styles.cardItem}>
        <TouchableOpacity
          onPress={()=> {
            this._goUserInfo(rowData)
          }}>
          <Image
            style={styles.avatar}
            source={{uri: URL_DEV + rowData.SenderAvatar}}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=> {
            this._goChat(rowData)
          }}
          style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Text
              numberOfLines={1}
              style={[styles.cardText, styles.nameText]}>
              {rowData.SenderNickname}
            </Text>
            <Text>
              {rowData.MsgList[rowData.MsgList.length - 1].SendTime}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text
              style={[styles.cardText, styles.msgContent]}
              numberOfLines={1}>
              {this._renderLastMsgContent(rowData)}
            </Text>
            {this._renderUnReadCount(rowData.MsgList)}
          </View>
        </TouchableOpacity>
      </View>
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
}

export default connect((state)=> {
  return {
    ...state
  }
})(Message);