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

let lastClickTime = 0;

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
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }

    //这里向缓存中写入假的登录信息
    //Storage.setItem('user',{name:'张三',age:'18'});

  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  //出场动画
  configureScene(route) {
    let sceneAnimation = getRouteMap().get(route.name).sceneAnimation;
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
    let Component = getRouteMap().get(route.name).component;
    if (!Component) {
      return (
        <View style={styles.errorView}>
          <Text style={styles.errorText}>您所启动的Component未在routeMap中注册</Text>
        </View>
      );
    }
    return (
      <Component {...route}/>
    );
  }

  onBackAndroid() {
    const routers = this.navigator.getCurrentRoutes();
    if ((routers.length === 2 && routers[0].name == 'Login') || routers[routers.length - 1].name == 'Login' || routers[routers.length - 2].name == 'Login') {
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

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar
          backgroundColor="#3281DD"
          barStyle="default"
        />
        <Navigator
          style={styles.navigator}
          configureScene={this.configureScene}
          renderScene={this.renderScene}
          initialRoute={{
            name: 'Login',//MainContainer
          }}/>
      </View>
    );
  }
}
export default App