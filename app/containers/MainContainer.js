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
  StatusBar
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
import EditPhotos from '../pages/EditPhotos'

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
        height: height//iOS将状态栏视为视图一部分
      },
      android: {
        height: height - StatusBar.currentHeight//StatusBar.currentHeight为安卓状态栏高度
      }
    })
  },
});

//tabBar的icon图标和文字标题
const TAB_BAR_RESOURCES = [
  {name: 'ios-home-outline', size: 28, title: '广场'},
  {name: 'ios-people-outline', size: 28, title: '交友'},
  {name: 'ios-chatbubbles-outline', size: 28, title: '消息'},
  {name: 'ios-contact-outline', size: 28, title: '我的'}
];

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
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

  _goPhotos() {
    this.props.navigator.push({
      component: EditPhotos,
      name: 'EditPhotos',
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
      goSignature={()=> {
        this._goSignature()
      }}
      goPhotos={()=> {
        this._goUserInfo()
      }}
      goSettings={()=> {
        this._goSettings()
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
          onChange={(isOpen)=> {
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
              return <TabBar tabBarResources={TAB_BAR_RESOURCES}/>
            }}>
            <Home
              gpsStatus={this._locationHandler()}
              isOpen={this.state.isOpen}
              menuChange={(isOpen)=> {
                this.setState({isOpen: isOpen})
              }}
              style={styles.subView}
              navigator={this.props.navigator}/>
            <Vicinity
              isOpen={this.state.isOpen}
              menuChange={(isOpen)=> {
                this.setState({isOpen: isOpen})
              }}
              style={styles.subView}
              navigator={this.props.navigator}/>
            <Message
              isOpen={this.state.isOpen}
              menuChange={(isOpen)=> {
                this.setState({isOpen: isOpen})
              }}
              style={styles.subView}
              navigator={this.props.navigator}/>
            <Mine
              isOpen={this.state.isOpen}
              menuChange={(isOpen)=> {
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
