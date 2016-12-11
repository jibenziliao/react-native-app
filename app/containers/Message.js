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
    height: 60
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
  tips:{
    flexDirection:'row',
    flex:1,
    margin:40
  },
  tipsText:{
    fontSize:20
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

  _getCurrentUserInfo() {
    const {dispatch}=this.props;
    dispatch(HomeActions.getCurrentUserProfile('', (json)=> {
      this.setState({currentUser: json.Result});
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

  _goChat(rowData) {
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
            <View style={styles.badge}>
              <Text style={[styles.cardText, styles.badgeText]}>
                {rowData.MsgList.length}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  renderListView(ds, messageList) {
    if (messageList) {
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