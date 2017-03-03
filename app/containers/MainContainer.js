/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 09:24
 * @description
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
  Linking,
  DeviceEventEmitter,
  NativeAppEventEmitter,
  Alert,
  InteractionManager
} from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Home from './Home'
import Vicinity from './Vicinity'
import Message from './Message'
import Mine from './Mine'
import TabBar from '../components/TabBar'
import SideMenu from 'react-native-side-menu'
import Menu from '../components/Menu'
import tmpGlobal from '../utils/TmpVairables'
import EditPersonalSignature from '../pages/EditPersonalSignature'
import UserInfo from '../pages/UserInfo'
import Settings from '../pages/Settings'
import Album from '../pages/Album'
import Account from '../pages/Account'
import {URL_DEV} from '../constants/Constant'
import {toastShort} from '../utils/ToastUtil'
import pxToDp from '../utils/PxToDp'
import GiftList from '../pages/GiftList'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  /**
   * iOS平台下, react-native-scrollable-tab-view是用ScrollView实现的
   * 当react-native-scrollable-tab-view嵌套react-native-viewpager时, 需要给react-native-scrollable-tab-view的子View设置overflow='hidden',
   * ScrollView的removeClippedSubviews才能起作用, 将不在屏幕可视范围的视图移除掉.
   */
  subView: {
    overflow: 'hidden'
  },
  container: {
    ...Platform.select({
      ios: {
        height: height //iOS在通话过程中使用APP,顶部状态栏会变高,APP视图会被挤下去
      },
      android: {
        height: height - StatusBar.currentHeight//StatusBar.currentHeight为安卓状态栏高度
      }
    })
  },
});

//tabBar的icon图标和文字标题
const TAB_BAR_RESOURCES = [
  {name: 'ios-home-outline', size: pxToDp(46), title: '广场'},
  {name: 'ios-people-outline', size: pxToDp(46), title: '交友'},
  {name: 'ios-chatbubbles-outline', size: pxToDp(46), title: '消息'},
  {name: 'ios-contact-outline', size: pxToDp(46), title: '我的'}
];

let emitter;

class MainContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      unReadMsgCount: 0
    };
    emitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter;
    this._renderBadge = this._renderBadge.bind(this);
  }

  componentDidMount() {
    this.badgeListener = emitter.addListener('msgUnReadCountChange', (data) => {
      this._renderBadge(data);
    });
    this._getSettings();
  }

  _getSettings() {
    InteractionManager.runAfterInteractions(() => {
      fetch(URL_DEV + '/profile/setting', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
        .then(response => response.json())
        .then(json => {
          if ('OK' !== json.Code) {
            toastShort(json.Message);
          } else {
            tmpGlobal.settings = json.Result;
          }
        }).catch((err) => {
        toastShort('网络发生错误,请重试');
      });
    });
  }

  _renderBadge(data) {
    this.setState({
      unReadMsgCount: data.data
    });
  }

  componentWillUnmount() {
    this.badgeListener.remove();
  }

  _goSignature() {
    this.props.navigator.push({
      component: EditPersonalSignature,
      name: 'EditPersonalSignature',
      params: {
        personalSignature: tmpGlobal.currentUser.PersonSignal
      },
    })
  }

  _goAlbum() {
    this.props.navigator.push({
      component: Album,
      name: 'Album',
      params: {
        UserId: tmpGlobal.currentUser.UserId,
        PrimaryPhotoFilename: tmpGlobal.currentUser.PhotoUrl
      },
    })
  }

  //点击头像和名字,跳转个人信息详情页
  _goUserInfo() {
    this.props.navigator.push({
      component: UserInfo,
      name: 'UserInfo',
      params: {
        Nickname: tmpGlobal.currentUser.Nickname,
        UserId: tmpGlobal.currentUser.UserId,
        isSelf: true,
      }
    });
  }

  //前往用户账户资料页面
  _goAccount() {
    this.props.navigator.push({
      component: Account,
      name: 'Account'
    });
  }

  _goGiftList() {
    this.props.navigator.push({
      component: GiftList,
      name: 'GiftList'
    })
  }

  //去应用市场给本APP打分
  _goScore() {
    let url = Platform.OS === 'ios' ? 'https://itunes.apple.com/au/app/id1211127691' : 'https://play.google.com/store/apps/details?id=com.haijiao.meetyou';
    Alert.alert('提示', `确定好评,你会获得${tmpGlobal.settings.GivePraise || 50}觅豆`, [
      {
        text: '确定', onPress: () => {
        fetch(URL_DEV + '/profile/praise', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        })
          .then((response) => {
            //console.log(response);
            return response.json()
          })
          .then(json => {
            if ('OK' !== json.Code) {
              toastShort(json.Message);
            } else {
              Linking.openURL(url).catch(err => console.error('An error occurred', err));
            }
          }).catch((err) => {
          toastShort('网络发生错误,请重试');
        });
      }
      },
      {
        text: '取消', onPress: () => {
      }
      }
    ]);
  }

  _goSettings() {
    this.props.navigator.push({
      component: Settings,
      name: 'Settings'
    });
  }

  _locationHandler() {
    if (tmpGlobal.currentLocation === null || (tmpGlobal.currentLocation.Lat === 0 && tmpGlobal.currentLocation.Lng === 0)) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const menu = <Menu
      goSignature={() => {
        this._goSignature()
      }}
      goAlbum={() => {
        this._goAlbum()
      }}
      goUserInfo={() => {
        this._goUserInfo()
      }}
      goSettings={() => {
        this._goSettings()
      }}
      goAccount={() => {
        this._goAccount()
      }}
      goGiftList={() => {
        this._goGiftList()
      }}
      goScore={() => {
        this._goScore()
      }}
      userInfo={tmpGlobal.currentUser}
      openMenuOffset={width * 2 / 3}
      navigator={this.props.navigator}/>;
    return (
      <View style={styles.container}>
        <SideMenu
          menu={menu}
          openMenuOffset={width * 2 / 3}
          isOpen={this.state.isOpen}
          onChange={(isOpen) => {
            this.setState({isOpen})
          }}
          disableGestures={true}
          navigator={this.props.navigator}>
          <ScrollableTabView
            tabBarPosition="bottom"
            locked={true}
            scrollWithoutAnimation={false}
            prerenderingSiblingsNumber={4}
            initialPage={0}
            renderTabBar={() => {
              return <TabBar
                tabBarResources={TAB_BAR_RESOURCES}
                unReadCount={this.state.unReadMsgCount}/>
            }}>
            <Home
              gpsStatus={this._locationHandler()}
              isOpen={this.state.isOpen}
              menuChange={(isOpen) => {
                this.setState({isOpen: isOpen})
              }}
              style={styles.subView}
              navigator={this.props.navigator}/>
            <Vicinity
              isOpen={this.state.isOpen}
              menuChange={(isOpen) => {
                this.setState({isOpen: isOpen})
              }}
              style={styles.subView}
              navigator={this.props.navigator}/>
            <Message
              isOpen={this.state.isOpen}
              menuChange={(isOpen) => {
                this.setState({isOpen: isOpen})
              }}
              style={styles.subView}
              navigator={this.props.navigator}/>
            <Mine
              isOpen={this.state.isOpen}
              menuChange={(isOpen) => {
                this.setState({isOpen: isOpen})
              }}
              style={styles.subView}
              navigator={this.props.navigator}/>
          </ScrollableTabView>
        </SideMenu>
      </View>
    );
  }
}

export default MainContainer;
