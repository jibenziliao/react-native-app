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
import signalr from 'react-native-signalr'
import * as Storage from '../utils/Storage'
import {URL_DEV, TIME_OUT, URL_WS_DEV} from '../constants/Constant'
import CookieManager from 'react-native-cookies'
import temGlobal from '../utils/TmpVairables'
import * as HomeActions from '../actions/Home'
import {strToDateTime, dateFormat} from '../utils/DateUtil'

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

const {height, width} = Dimensions.get('window');

class Message extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      messageList: [],
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

  componentDidMount() {
    console.log('Message页面加载完成');
    this.subscription = DeviceEventEmitter.addListener('MessageCached', (data)=> {
      this._cacheMessageListener(data)
    });
    this._getCurrentUserInfo();
  }

  //MessageDetail页面更新缓存后,这个页面需要监听,并被动更新
  _cacheMessageListener(data) {
    console.log('Message页面成功监听到MessageDetail页面缓存成功的信号');
    console.log(data);
    Storage.getItem(`${this.state.currentUser.UserId}_MsgList`).then((res)=> {
      if (res !== null) {
        this.setState({
          messageList: res
        });
      }
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
    temGlobal.connection.stop();
  }

  //每次收到新的消息,缓存消息列表
  _cacheMessageList(data) {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].MsgList.length; j++) {
        data[i].MsgList[j] = {
          MsgContent: data[i].MsgList[j].MsgContent,
          MsgId: data[i].MsgList[j].MsgId,
          HasSend: false,
          SendTime: data[i].MsgList[j].SendTime,
          _id: Math.round(Math.random() * 1000000),
          text: data[i].MsgList[j].MsgContent,
          createdAt: data[i].MsgList[j].SendTime,
          user: {
            _id: data[i].MsgList[j].user._id,
            name: data[i].MsgList[j].name,
            avatar: data[i].MsgList[j].avatar
          }
        };
      }
    }
    console.log('Message页面准备写入缓存的数据',data);
    Storage.setItem(`${this.state.currentUser.UserId}_MsgList`, data);
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
      Storage.getItem(`${this.state.currentUser.UserId}_MsgList`).then((res)=> {
        for (let i = 0; i < res.length; i++) {
          for (let j = 0; j < res[i].MsgList.length; j++) {
            if (res[i].SenderId === SenderId) {
              res[i].MsgList[j].HasSend = true;
            }
          }
        }
        Storage.setItem(`${this.state.currentUser.UserId}_MsgList`,res);
      });
    });
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
        console.log('Message页面从缓存中取出的消息记录',res);
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
      if (temGlobal.proxy === null) {
        this._initWebSocket();
      }
    })
  }

  _initWebSocket() {
    //注销重新登录,会重新初始化此页面,connect需要重置
    temGlobal.connection=null;
    connection=null;

    connection = signalr.hubConnection(URL_WS_DEV);
    connection.logging = false;
    console.log(connection);
    proxy = connection.createHubProxy('ChatCore');

    //将proxy保存在全局变量中,以便其他地方使用

    temGlobal.proxy = proxy;

    temGlobal.connection = connection;

    temGlobal.proxy.on('messageFromServer', (message) => {
      console.log(message);

      messagePromise.done(() => {
        console.log('Invocation of NewContosoChatMessage succeeded');
      }).fail(function (error) {
        console.log('Invocation of NewContosoChatMessage failed. Error: ' + error);
      });
    });

    temGlobal.proxy.on('sayHey', (message) => {
      console.log(message);
    });

    temGlobal.proxy.on('log', (str)=> {
      //console.log(str);
    });

    temGlobal.connection.start().done(() => {
      temGlobal.proxy.invoke('login', cookie);
      console.log('Now connected, connection ID=' + connection.id);

      temGlobal._initWebSocket=()=>{this._initWebSocket()};

    }).fail(() => {
      console.log('Failed');
    });

    temGlobal.connection.connectionSlow(function () {
      console.log('We are currently experiencing difficulties with the connection.')
    });

    //断开需要重连
    temGlobal.connection.error(function (error) {
      console.log('SignalR error: ' + error);
      console.log('开始重新连接');
      temGlobal._initWebSocket();
    });

    temGlobal.proxy.on('getNewMsg', (obj) => {
      console.log('服务器返回的原始数据',obj);
      let routes = navigator.getCurrentRoutes();
      console.log('路由栈',routes);
      temGlobal.proxy.invoke('userReadMsg', obj.LastMsgId);
      //Message和MessageDetail页面的obj联动(proxy的原因),当前页面是MessageDetail时,此页面停止接收消息,并停止marge
      if (routes[routes.length - 1].name != 'MessageDetail') {
        console.log('服务器返回的原始数据',obj);
        console.log('Message页面收到了新消息');

        console.log('Message页面成功标为已读');
        //这里需要用到js复杂对象的深拷贝,这里用JSON转换并不是很安全的方法。
        //http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript/122704#
        this._margeMessage(JSON.parse(JSON.stringify(obj.MsgPackage)));
      }
    });
  }

  //合并后台推送过来的消息(存缓存时,需要将时间以字符串时间形式存储,不能直接存Date类型,JSON.stringify将Date会转换成字符串)
  _margeMessage(data) {
    console.log('需要合并的数据',data);
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
            avatar: newMsgList[i].SenderAvatar,
            myUserId: this.state.currentUser.UserId
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
          this.state.messageList[i].MsgList = this.state.messageList[i].MsgList.concat(objCopy[j].MsgList);
          newMsgList.splice(j, 1);
        }
      }
    }
    console.log(newMsgList);
    console.log(objCopy);
    //剩下的新消息不和已存在的对话合并,单独占一(多)行
    this.state.messageList = this.state.messageList.concat(newMsgList);
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
        UserAvatar: URL_DEV + rowData.SenderAvatar,
        myUserId: this.state.currentUser.UserId
      }
    })
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

  //渲染对象用户最新的一条消息(一个rowData.MsgList中包含了对方与自己的聊天信息,这里需显示对方的最新一条聊天)
  _renderLastMsgContent(rowData) {
    let content = [];
    for (let i = 0; i < rowData.MsgList.length; i++) {
      if (rowData.MsgList[i].user._id === rowData.SenderId) {
        content.push(rowData.MsgList[i].text);
      }
    }
    return content[content.length - 1];
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
              {rowData.MsgList[rowData.MsgList.length - 1].SendTime}
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardText}>
              {this._renderLastMsgContent(rowData)}
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
}

export default connect((state)=> {
  return {
    ...state
  }
})(Message);