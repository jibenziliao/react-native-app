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
  TouchableHighlight,
  Image,
  Dimensions,
  DeviceEventEmitter,
  NativeAppEventEmitter,
  Platform
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
import {SwipeListView} from 'react-native-swipe-list-view'
import {strToDateTime, dateFormat} from '../utils/DateUtil'
import {ComponentStyles, CommonStyles} from '../style'
import pxToDp from '../utils/PxToDp'
import EmptyView from '../components/EmptyView'

const styles = StyleSheet.create({
  listView: {
    flex: 1
  },
  cardLast: {
    marginBottom: pxToDp(20)
  },
  card:{
    backgroundColor: '#FFF',
    flex: 1,
  },
  cardItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: pxToDp(130),
    borderBottomColor:'#cecece'
  },
  avatar: {
    width: pxToDp(80),
    height: pxToDp(80),
    borderRadius: pxToDp(8),
    margin: pxToDp(25),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor:'#cecece'
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: pxToDp(25),
    borderBottomColor: '#cecece',
    paddingRight: pxToDp(25),
  },
  timeText: {
    fontSize: pxToDp(22),
    color: '#999'
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardText: {
    flexWrap: 'nowrap',
    flex: 1,
    textAlignVertical: 'center'
  },
  nameText: {
    overflow: 'hidden',
    fontSize: pxToDp(30)
  },
  badgeContainer: {
    width: pxToDp(120),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: pxToDp(16),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: pxToDp(10),
  },
  badgeText: {
    color: '#fff',
    fontSize: pxToDp(24),
  },
  msgContent: {
    overflow: 'hidden',
    flex: 1,
    fontSize: pxToDp(26),
    color: '#666'
  },
  hiddenRow: {
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  deleteBtn: {
    width: pxToDp(120),
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteBtnText: {
    fontSize: pxToDp(32),
    color: '#fff',
    textAlign: 'center'
  }
});

let navigator;
let reconnectCount = 0;
let cookie;
let rowIsOpen = false;
let emitter;

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
    emitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter;
  }

  getNavigationBarProps() {
    return {
      title: '消息',
      leftIcon: {
        name: 'bars',
        size: pxToDp(36)
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
    this.reConnectWebSocketListener = DeviceEventEmitter.addListener('reConnectWebSocket', (data)=> {
      reconnectCount = 0;//在聊天页面重连时,重置重连次数
      this._wsTokenHandler();
    });
    InteractionManager.runAfterInteractions(()=> {
      this._initOldMessage();
    })
  }

  //MessageDetail页面更新缓存后或拉黑时,删除消息记录,这个页面需要监听,并被动更新
  _cacheMessageListener(data) {
    console.log('Message页面成功监听到MessageDetail页面缓存成功的信号||消息缓存变更');
    this.setState({
      messageList: this.sortByDate(data.data)
    }, ()=> {
      this._totalUnReadCountHandler()
    });
  }

  //页面上展示的消息按照日期排序
  sortByDate(messages) {
    return messages.sort((b, a)=> {
      return new Date(a.MsgList[a.MsgList.length - 1].SendTime).getTime() - new Date(b.MsgList[b.MsgList.length - 1].SendTime).getTime()
    });
  }

  componentWillUnmount() {
    tmpGlobal.ws = null;
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
      this._totalUnReadCountHandler();
    });
  }

  _initOldMessage() {
    Storage.getItem(`${tmpGlobal.currentUser.UserId}_MsgList`).then((res)=> {
      if (res !== null) {
        this.setState({
          messageList: res
        }, ()=> {
          this._totalUnReadCountHandler()
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
      this._wsTokenHandler();
    })
  }

  //服务器在澳洲(东11区),返回的时间为服务器时间(2017-02-13 19:35:05),需要转换成本地时间显示并存储(注:new Date()隐式转换对格式有要求,'2017-02-13 19:35:05'格式在React-Native中不支持,显示Invalid Date)
  _renderMsgTime(str) {
    let tmpStr = str;
    let serverTime = tmpStr.split('T')[0] + ' ' + (tmpStr.split('T')[1]).split('.')[0];
    let formatServerTime = (strToDateTime(serverTime) + '').split('GMT')[0] + ' GMT+1100 (AESST)';//澳大利亚东部夏令时
    //console.log('服务器时间', serverTime);
    //console.log('服务器时间转本地时间', new Date(formatServerTime));
    return dateFormat(new Date(formatServerTime));
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
          MsgType: newMsgList[i].MsgList[j].MsgType,
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
    console.log('处理后的备份消息', newMsgList);
    console.log('处理后的消息', objCopy);
    let index = 0;
    for (let i = 0; i < this.state.messageList.length; i++) {
      for (let j = 0; j < objCopy.length; j++) {
        if (this.state.messageList[i].SenderId === objCopy[j].SenderId) {
          //若用户头像、昵称有更新,则更新缓存中的头像和昵称
          this.state.messageList[i].SenderNickname = objCopy[j].SenderNickname;
          this.state.messageList[i].SenderAvatar = objCopy[j].SenderAvatar;
          this.state.messageList[i].MsgList = this.state.messageList[i].MsgList.concat(objCopy[j].MsgList);
          index = i;
          objCopy.splice(j, 1);
          break;
        }
      }
    }
    console.log(newMsgList);
    console.log(objCopy);
    //剩下的新消息不和已存在的对话合并,单独占一(多)行,并在列表头部显示。
    if (objCopy.length > 0) {
      this.state.messageList.unshift(...objCopy);
    }
    //将最新的一条消息放在列表最上面
    if (index !== 0) {
      let tmpArr = this.state.messageList.splice(index, 1);
      this.state.messageList.unshift(tmpArr[0]);
    }
    console.log('合并后的页面消息列表', this.state.messageList);

    this.setState({
      messageList: this.sortByDate(this.state.messageList)
    }, ()=> {
      //在setState的回调里开始缓存消息
      console.log('Message页面开始缓存消息');
      console.log(this.state.messageList);
      //深拷贝
      let params = JSON.parse(JSON.stringify(this.state.messageList));
      this._cacheMessageList(params);
      this._totalUnReadCountHandler();
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
      if (typeof(e) == "object" && Object.prototype.toString.call(e).toLowerCase() == "[object object]" && !e.length) {
        console.log(e);
      } else {
        console.log(e + '');
      }
      reconnectCount += 1;
      if (reconnectCount <= 5) {
        this._wsTokenHandler();//报错后重新获取token
      } else {
        toastLong('聊天功能初始化失败');
      }
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
    };
    tmpGlobal.ws.onclose = (e) => {
      console.log(e);
      console.log(e.code, e.reason);
      tmpGlobal.webSocketInitState = false;
      reconnectCount += 1;
      if (reconnectCount <= 5) {
        this._wsTokenHandler();//报错后重新初始化webSocket连接
      } else {
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

  //原生webSocket连接登录,登录时请求离线消息(传的LastMsgId默认为0)
  _wsLoginHandler() {
    Storage.getItem(`${tmpGlobal.currentUser.UserId}_LastMsgId`).then((res)=> {
      let loginParams = {
        H: 'chatcore',
        M: 'Login',
        A: [tmpGlobal.cookie, parseInt(res || 0)],
        I: Math.floor(Math.random() * 11)
      };
      tmpGlobal.ws.send(JSON.stringify(loginParams));
      console.log(loginParams);
      console.log('ws登录成功');
    }).catch((error)=> {
      console.log(error);
    });
  }

  //原生webSocket连接从后台接收到的消息处理
  _wsNewMsgHandler(obj) {
    tmpGlobal.webSocketInitState = true;
    //连接成功后,将初始化webSocket连接的方法赋值给全局变量
    tmpGlobal._wsTokenHandler = this._wsTokenHandler;
    if (obj.hasOwnProperty('M')) {
      let index = obj.M.findIndex((item)=> {
        return item.M === 'GetNewMsg'
      });
      if (index > -1) {
        Storage.getItem(`${tmpGlobal.currentUser.UserId}_LastMsgId`).then((res)=> {
          if (obj.M[0].A[0].LastMsgId && obj.M[0].A[0].LastMsgId > parseInt(res || 0)) {
            //缓存最后一条消息Id
            Storage.setItem(`${tmpGlobal.currentUser.UserId}_LastMsgId`, obj.M[0].A[0].LastMsgId);
            let routes = navigator.getCurrentRoutes();
            if (routes[routes.length - 1].name != 'MessageDetail') {
              console.log('Message页面收到了新消息');
              //这里需要用到js复杂对象的深拷贝,这里用JSON转换并不是很安全的方法。
              //http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript/122704#
              this._margeMessage(JSON.parse(JSON.stringify(obj.M[0].A[0].MsgPackage)));
            }
          }
        });
      }
    } else {
      //console.log(obj);
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
        UserAvatar: rowData.SenderAvatar
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

  _badgeCountHandler(value) {
    return parseInt(value) > 99 ? '99+' : value;
  }

  _renderUnReadCount(data) {
    let tmpArr = data.filter((item)=> {
      return item.HasSend === false;
    });
    if (tmpArr.length > 0) {
      return (
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={[styles.cardText, styles.badgeText]}>
              {this._badgeCountHandler(tmpArr.length)}
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

  _totalUnReadCountHandler() {
    let arr = this.state.messageList;
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
      count += arr[i].MsgList.filter((item)=> {
        return item.HasSend === false;
      }).length;
    }
    emitter.emit('msgUnReadCountChange', {data: count, message: '未读消息数量发生变化'});
  }

  deleteRow(data, secId) {
    this._deleteRecordRow(data);
    this.refs.swipeListView.safeCloseOpenRow();
    let newData = [...this.state.messageList];
    newData.splice(secId, 1);
    this.setState({messageList: newData}, ()=> {
      this._totalUnReadCountHandler();
    });
  }

  _deleteRecordRow(data) {
    Storage.getItem(`${tmpGlobal.currentUser.UserId}_MsgList`).then((res)=> {
      let index = res.findIndex((item)=> {
        return data.SenderId === item.SenderId;
      });
      if (index !== -1) {
        res.splice(index, 1);
        Storage.setItem(`${tmpGlobal.currentUser.UserId}_MsgList`, res);
      }
    });
  }

  _bottomItem(rowID, value) {
    return parseInt(rowID) === this.state.messageList.length - 1 ? (value === 1 ? 0 : StyleSheet.hairlineWidth) : (value === 0 ? 0 : StyleSheet.hairlineWidth);
  }

  renderRowData(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight
        onPress={()=> {
          if (!rowIsOpen) {
            this._goChat(rowData)
          } else {
            this.refs.swipeListView.safeCloseOpenRow()
          }
        }}
        key={rowData.SenderId}
        style={styles.card}>
        <View style={[styles.cardItem, {borderBottomWidth: this._bottomItem(rowID, 0)}]}>
        <Image
          style={styles.avatar}
          source={{uri: URL_DEV + rowData.SenderAvatar}}/>
        <View style={[styles.cardContent, {borderBottomWidth: this._bottomItem(rowID, 1)}]}>
          <View style={styles.cardRow}>
            <Text
              numberOfLines={1}
              style={[styles.cardText, styles.nameText]}>
              {rowData.SenderNickname}
            </Text>
            <Text
              style={[styles.timeText]}>
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
        </View>
      </View>
      </TouchableHighlight>
    )
  }

  renderListView(ds, messageList) {
    if (messageList.length > 0) {
      return (
        <SwipeListView
          ref={'swipeListView'}
          style={styles.listView}
          dataSource={ds.cloneWithRows(messageList)}
          renderRow={
            this.renderRowData.bind(this)
          }
          onRowClose={()=> {
            rowIsOpen = false
          }}
          onRowOpen={()=> {
            rowIsOpen = true
          }}
          closeOnScroll={true}
          closeOnRowPress={false}
          recalculateHiddenLayout={true}
          renderHiddenRow={ (data, rowId, secId, rowMap) => (
            <TouchableHighlight
              onPress={(_)=> {
                this.deleteRow(data, secId)
              }}
              style={styles.hiddenRow}>
              <View style={styles.deleteBtn}>
                <Text style={styles.deleteBtnText}>{'删除'}</Text>
              </View>
            </TouchableHighlight>
          )}
          disableRightSwipe={true}
          rightOpenValue={-pxToDp(120)}
          enableEmptySections={true}
          onEndReachedThreshold={10}
          initialListSize={10}
          pageSize={10}/>
      )
    } else {
      return <EmptyView/>
    }
  }

  renderBody() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={ComponentStyles.container}>
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