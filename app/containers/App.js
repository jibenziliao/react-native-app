/**
 *
 * @author keyy/1501718947@qq.com 16/11/8 16:29
 * @description
 */
import React, {Component}from 'react'
import {
  StatusBar,
  View,
  Text,
  Navigator,
  Platform,
  BackAndroid,
  Alert,
  NetInfo
} from 'react-native'
import {connect} from 'react-redux'
import {toastShort} from '../utils/ToastUtil'
import {LOCATION_TIME_OUT_SHORT} from '../constants/Constant'
import * as Storage from '../utils/Storage'
import Login from '../pages/Login'
import MainContainer from '../containers/MainContainer'
import * as VicinityActions from '../actions/Vicinity'
import Spinner from '../components/Spinner'
import RNPicker from 'react-native-picker'
import tmpGlobal from '../utils/TmpVairables'
import {CommonStyles,StyleConfig} from '../style'

let lastClickTime = 0;

class App extends Component {

  constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
    this.onBackAndroid = this.onBackAndroid.bind(this);
    this._handleConnectivityChange = this._handleConnectivityChange.bind(this);
    this.state = {
      pending: false,
      hasRegistered: false,
      loading: false,
      getRegistered: false,
      isConnected: null,
      connectionInfo: null
    }
  }

  componentWillMount() {
    this.setState({loading: true});
    this.loadRegisteredStatus().done();
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
    NetInfo.addEventListener('change', this._handleConnectivityChange);
    this.setState({loading: true});
  }

  _getNetStatus() {
    //检测网络是否连接
    NetInfo.isConnected.fetch().done(
      (isConnected) => {
        console.log('###isConnected', isConnected);
        tmpGlobal.isConnected = isConnected;
        this.setState({isConnected});
      }
    );
    //检测网络连接信息
    NetInfo.fetch().done(
      (connectionInfo) => {
        console.log('###connectionInfo', connectionInfo);
        this.setState({connectionInfo});
      }
    );
  }

  loadRegisteredStatus = async()=> {
    try {
      let value = await Storage.getItem('hasRegistered');
      if (value !== null) {
        tmpGlobal.currentUser = await Storage.getItem('userInfo');
        this.setState({hasRegistered: value});
        console.log('已完成注册流程');
      } else {
        console.log('尚未完成注册流程');
      }
      this.getCurrentPosition();
      //this.setState({
      //  getRegistered: true
      //});
      //this.setState({loading: false, getRegistered: true});
    } catch (error) {
      console.log('加载缓存注册状态时出错', error.message);
    }
  };

  getCurrentPosition() {
    console.log('定位开始');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        this._savePosition(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.log(error);
        this._savePosition(0, 0);
      },
      {enableHighAccuracy: false, timeout: LOCATION_TIME_OUT_SHORT, maximumAge: 5000}
    );
  }

  _savePosition(lat, lng) {
    const {dispatch}=this.props;
    let params = tmpGlobal.currentLocation = {
      Lat: lat,
      Lng: lng
    };
    this.setState({loading: false, getRegistered: true});
    async function saveLocation() {
      await Storage.setItem('currentLocation', params);
      Storage.getItem('hasRegistered').then(
        (response)=> {
          if (response != null) {
            console.log('用户已注册,开始向后台发送用户位置信息');
            dispatch(VicinityActions.saveLocation(params, (json)=> {
            }, (error)=> {
            }));
          }
        }, (error)=> {
          console.log('读取缓存出错!', error);
        }
      );
    }

    saveLocation();
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
    NetInfo.removeEventListener('change', this._handleConnectivityChange);
  }

  _handleConnectivityChange(data) {
    this._getNetStatus();
    console.log('###监听网络,返回的结果', data);
  }

  renderNavigator(status) {
    if (status) {
      if (!this.state.hasRegistered) {
        return (
          <Navigator
            style={CommonStyles.flex_1}
            configureScene={this.configureScene}
            renderScene={this.renderScene}
            initialRoute={{
              name: 'Login',//MainContainer,
              component: Login
            }}/>
        )
      } else {
        return (
          <Navigator
            style={CommonStyles.flex_1}
            configureScene={this.configureScene}
            renderScene={this.renderScene}
            initialRoute={{
              name: 'MainContainer',//MainContainer,
              component: MainContainer
            }}/>
        )
      }
    } else {
      <Spinner animating={!status}/>
    }
  }

  renderPending(data) {
    if (data) {
      return (
        <Spinner animating={data}/>
      )
    }
  }

  render() {
    const status = this.state.getRegistered;
    return (
      <View style={{flex: 1}}>
        <StatusBar
          backgroundColor={StyleConfig.color_primary}
          barStyle="light-content"
        />
        {this.renderNavigator(status)}
        {this.renderPending(this.props.pendingStatus || this.state.loading)}
      </View>
    );
  }

  //出场动画(需要禁用Navigator手势滑动返回)
  configureScene(route) {
    let sceneAnimation = route.component.sceneAnimation;
    if (sceneAnimation) {
      return sceneAnimation;
    }
    //默认(gestures设为{}或null用来禁用安卓从屏幕左侧滑动返回)
    return {...Navigator.SceneConfigs.PushFromRight, gestures: null}
  }

  renderScene(route, navigator) {
    this.navigator = navigator;
    let Component = route.component;
    return (
      <Component navigator={navigator} route={route}/>
    );
  }

  onBackAndroid() {
    const routers = this.navigator.getCurrentRoutes();
    console.log(routers);
    if ((routers[routers.length - 1].name == 'MainContainer') || (routers[routers.length - 1].name == 'Home') || (routers[routers.length - 1].name == 'Login')) {
      let now = new Date().getTime();
      if (now - lastClickTime < 2500) {
        return false;
      }
      lastClickTime = now;
      toastShort('再按一次退出觅友 Meet U');
      return true;
    } else if (routers[routers.length - 1].name == 'EditPhotos' || routers[routers.length - 1].name == 'EditUserProfile' || routers[routers.length - 1].name == 'EditFriendFilter' || routers[routers.length - 1].name == 'EditPersonalSignature' || routers[routers.length - 1].name == 'Revel' || routers[routers.length - 1].name == 'AnnouncementList') {
      return true;
    } else {
      //如果页面上有弹出选择框,按安卓物理返回键需要手动关闭弹出选择框(如果之前没有关闭的话)
      RNPicker.isPickerShow((status)=> {
        if (status) RNPicker.hide()
      });
      this.navigator.pop();
      return true;
    }
  }

}

export default connect((state)=> {
  return {
    pendingStatus: state.InitialApp.pending
  }
})(App)