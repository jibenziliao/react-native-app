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
  InteractionManager,
  ListView,
  RefreshControl,
  Image,
  TouchableOpacity
} from 'react-native';
import {getNavigator} from '../navigation/Route'
import BaseComponent from '../base/BaseComponent'
import Button from 'react-native-button'
import MessageDetail from '../pages/MessageDetail'
import Login from '../pages/Login'
import {Button as NBButton} from 'native-base'
import {StyleConfig, CommonStyles, componentStyles} from '../style'
import RNPicker from 'react-native-picker'
import BackgroundTimer from 'react-native-background-timer'
import Icon from 'react-native-vector-icons/FontAwesome'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  listView: {
    flex: 1,
    paddingHorizontal: 10
  },
  contentTitle: {
    margin: 10
  },
  content: {
    flex: 1
  },
  card: {
    padding: 10,
    backgroundColor: '#FFF',
    marginTop: 10
  },
  cardRow: {
    flexDirection: 'row'
  },
  cardLeft: {
    flexDirection: 'row',
  },
  avatarImg: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 8
  },
  userInfo: {
    justifyContent: 'space-between'
  },
  userInfoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'pink',
    borderWidth: 1,
    borderColor: 'pink',
    paddingHorizontal: 6
  },
  userInfoIcon: {
    marginRight: 4
  },
  userInfoText: {
    fontSize: 14
  },
  moodView: {
    marginVertical: 5
  },
  moodText: {
    fontSize: 16
  },
  cardBtn: {
    marginTop: 10,
    marginRight: 20
  }
});

const listViewData = [
  {
    avatarUrl: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
    userId: 110,
    userName: '张三',
    age: 23,
    gender: 1,
    text: 'hello world',
    distance: '3.9',
    second: 19,
    comment: 8,
    read: 10
  },
  {
    avatarUrl: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
    userId: 111,
    userName: '李四',
    age: 23,
    gender: 1,
    text: 'hello world',
    distance: '3.9',
    second: 19,
    comment: 8,
    read: 10
  }
];

let navigator;

class Home extends BaseComponent {
  constructor(props) {
    super(props);
    navigator = this.props.navigator;
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows(listViewData),
      refreshing: false,
    };
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.timer = BackgroundTimer.setTimeout(()=> {
      this.setState({refreshing: false});
    }, 2000);
  }

  componentWillUnmount() {
    BackgroundTimer.clearTimeout(this.timer);
  }

  getNavigationBarProps() {
    return {
      title: '广场',
      hideLeftButton: true
    };
  }

  onRightPressed() {
    console.log('这是继承后的方法');
  }

  goMessageDetail() {
    navigator.push({
      component: MessageDetail,
      name: 'MessageDetail'
    })
  }

  goLogin() {
    navigator.push({
      component: Login,
      name: 'Login'
    });
  }

  renderRowData(rowData) {
    return (
      <View key={rowData.userId}
            style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={()=> {
            console.log('123')
          }}>
          <View style={styles.cardRow}>
            <View style={styles.cardLeft}>
              <Image source={{uri: rowData.avatarUrl}} style={styles.avatarImg}/>
              <View style={styles.userInfo}>
                <Text>{rowData.userName}</Text>
                <View>
                  <View style={styles.userInfoLabel}>
                    <Icon
                      name={'venus'}
                      size={12}
                      style={styles.userInfoIcon}/>
                    <Text style={styles.userInfoText}>{rowData.age}{'岁'}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={[styles.cardRow, styles.moodView]}>
          <Text style={styles.moodText}>{rowData.text}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text>{rowData.distance}{'km'}{'·'}</Text>
          <Text>{rowData.second}{'赞'}{'·'}</Text>
          <Text>{rowData.comment}{'评论'}{'·'}</Text>
          <Text>{rowData.read}{'阅读'}</Text>
        </View>
        <View style={styles.cardRow}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.cardBtn}
            onPress={()=> {
              console.log('点了个赞')
            }}>
            <Icon name="thumbs-o-up" size={20}/>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.cardBtn}
            onPress={()=> {
              console.log('点了评论')
            }}>
            <Icon name="comments-o" size={20}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderBody() {
    return (
      <View style={styles.container}>
        {/*<Text style={styles.contentTitle}>{'最新消息'}</Text>*/}
        <View style={styles.content}>
          <ListView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
            style={styles.listView}
            dataSource={this.state.dataSource}
            renderRow={
              this.renderRowData.bind(this)
            }
            initialListSize={3}
            pageSize={3}/>
        </View>
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
        <NBButton
          block
          style={{
            height: 40,
            marginBottom: 30
          }}
          onPress={()=> {
            this.goLogin()
          }}>
          测试登录
        </NBButton>
      </View>
    )
  }
}

export default Home