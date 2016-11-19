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
  BackAndroid
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
    this.state = {
      pending: false,
      hasRegistered: false,
      loading: false,
      getRegistered: false
    }
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
    this.setState({loading: true});
    this.loadRegisteredStatus().done();
  }

  loadRegisteredStatus = async()=> {
    try {
      var value = await Storage.getItem('hasRegistered');
      if (value !== null) {
        this.setState({hasRegistered: value});
        this.getCurrentPosition();
        console.log('已完成注册流程');
      } else {
        console.log('尚未完成注册流程');
      }
      this.setState({loading: false, getRegistered: true});
    } catch (error) {
      console.log('加载缓存注册状态时出错', error.message);
    }
  };

  getCurrentPosition() {
    console.log('定位开始');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let initialPosition = JSON.stringify(position);
        console.log(initialPosition);
      },
      (error) => {
        console.log(JSON.stringify(error));
        if ('"No available location provider."' == JSON.stringify(error)) {
          toastShort('请打开GPS开关');
        }
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 5000}
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
      const params = {
        Lat: lastPosition.LastLocation.Lat,
        Lng: lastPosition.LastLocation.Lng
      };
      dispatch(VicinityActions.saveCoordinate(params));
      navigator.geolocation.clearWatch(watchId);
    });
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
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

  //出场动画
  configureScene(route) {
    let sceneAnimation = route.component.sceneAnimation;
    if (sceneAnimation) {
      return sceneAnimation;
    }
    //默认
    return Navigator.SceneConfigs.FloatFromRight
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
    if ((routers.length > 2 && routers[routers.length - 1] != 'MainContainer' && routers[routers.length-1].name !='UserProfile') || routers[routers.length - 1].name == 'Login') {
      let now = new Date().getTime();
      if (now - lastClickTime < 2500) {
        return false;
      }
      lastClickTime = now;
      toastShort('再按一次退出情缘结');
      return true;
    } else {
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