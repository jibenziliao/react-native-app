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
  StyleSheet,
  Navigator,
  Platform,
  BackAndroid,
  Alert,
  NetInfo
} from 'react-native'
import {connect} from 'react-redux'
import {toastShort} from '../utils/ToastUtil'
import {getRouteMap, registerNavigator} from '../navigation/Route'
import * as Storage from '../utils/Storage'
import Login from '../pages/Login'
import MainContainer from '../containers/MainContainer'
import * as VicinityActions from '../actions/Vicinity'
import {calculateRegion} from '../utils/MapHelpers'
import Spinner from '../components/Spinner'
import RNPicker from 'react-native-picker'
import tmpGlobal from '../utils/TmpVairables'

let lastClickTime = 0;
let watchId;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navigator: {
    flex: 1,
    backgroundColor: 'white'
  },
  errorView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  errorText: {
    color: 'red',
    fontSize: 16
  }

});

class App extends Component {
  constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
    this.onBackAndroid = this.onBackAndroid.bind(this);
    this._handleConnectivityChange=this._handleConnectivityChange.bind(this);
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
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
    this.setState({loading: true});
    this.loadRegisteredStatus().done();
  }

  componentDidMount() {
    NetInfo.addEventListener('change', this._handleConnectivityChange);
    this.setState({loading: true});
  }

  _getNetStatus() {
    //检测网络是否连接
    NetInfo.fetch().done(
      (isConnected) => {
        console.log('###isConnected', isConnected);
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

  _Alert() {
    Alert.alert('提示', '本APP依赖手机的GPS,请打开手机的GPS后,重新打开本APP', [
      {
        text: '确定', onPress: () => {
      }
      }
    ]);
  }

  getCurrentPosition() {
    console.log('定位开始');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let initialPosition = JSON.stringify(position);
        console.log(initialPosition);
      },
      (error) => {
        console.log(JSON.stringify(error));
        //this._Alert();
        this.setState({loading: false, getRegistered: true});
        if ('"No available location provider."' == JSON.stringify(error)) {
          //toastShort('请打开GPS开关');
          this._Alert();
        }
      },
      {enableHighAccuracy: true, timeout: 30000, maximumAge: 5000}
    );
    watchId = navigator.geolocation.watchPosition((position) => {
      const lastPosition = {
        UserId: 0,
        PhotoUrl: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
        Nickname: 'You are here!',
        LastLocation: {
          Lat: position.coords.latitude,
          Lng: position.coords.longitude
        },
        DatingPurpose: ''
      };

      const initLocation = [{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }];
      //根据坐标计算区域(latPadding=0.15时,zoomLevel是10)
      const region = calculateRegion(initLocation, {latPadding: 0.15, longPadding: 0.15});

      console.log('成功获取当前区域', region);
      console.log('成功获取当前位置', lastPosition);

      const {dispatch}=this.props;
      const params = tmpGlobal.currentLocation = {
        Lat: lastPosition.LastLocation.Lat,
        Lng: lastPosition.LastLocation.Lng
      };

      //定位成功后,关闭加载指示器
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

      navigator.geolocation.clearWatch(watchId);
    },(error)=>{
      const {dispatch}=this.props;
      const params = tmpGlobal.currentLocation = {
        Lat: 0,
        Lng: 0
      };
      async function saveLocation() {
        await Storage.setItem('currentLocation', params);
        Storage.getItem('hasRegistered').then(
          (response)=> {
            if (response != null) {
              console.log('用户已注册,开始向后台发送用户位置信息(没有获取到经纬度,使用默认位置)');
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
    });
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
    NetInfo.removeEventListener('change', this._handleConnectivityChange
    );
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
            style={styles.navigator}
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
            style={styles.navigator}
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
          backgroundColor="#5067FF"
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
    return {...Navigator.SceneConfigs.FloatFromRight, gestures: null}
  }

  renderScene(route, navigator) {
    this.navigator = navigator;
    registerNavigator(navigator);
    //Each component name should start with an uppercase letter
    //jsx中的组件都得是大写字母开头, 否则将报错, expected a component class, got [object Object]
    let Component = route.component;
    if (!Component) {
      return (
        <View style={styles.errorView}>
          <Text style={styles.errorText}>您所启动的Component未在routeMap中注册</Text>
        </View>
      );
    }
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
      toastShort('再按一次退出情缘结');
      return true;
    } else if (routers[routers.length - 1].name == 'EditPhotos') {
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