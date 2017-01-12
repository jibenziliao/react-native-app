/**
 *
 * @author keyy/1501718947@qq.com 16/12/12 14:44
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import * as Storage from '../utils/Storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import Login from '../pages/Login'
import {toastShort} from '../utils/ToastUtil'
import tmpGlobal from '../utils/TmpVairables'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  topItem: {
    marginTop: 10
  },
  listItem: {
    backgroundColor: '#fff',
    borderBottomColor: '#E2E2E2',
    borderBottomWidth: 1,
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    margin: 10,
    marginTop: 0,
    alignItems: 'center'
  },
  itemIcon: {
    width: 60,
    textAlign: 'center'
  }
});

let navigator;

class Settings extends BaseComponent {
  constructor(props) {
    super(props);
    navigator = this.props.navigator;
    console.log(tmpGlobal.currentUser);
  }

  getNavigationBarProps() {
    return {
      title: '设置'
    };
  }

  _logOut() {
    //websocket注销当前用户
    //tmpGlobal.proxy.invoke('logout', tmpGlobal.cookie);
    //tmpGlobal.connection.stop();
    //注销后,重置signalr连接
    tmpGlobal.connection = null;
    tmpGlobal.proxy = null;
    tmpGlobal.currentUser = null;
    tmpGlobal.cookie = null;
    Storage.removeItem('hasRegistered');
    Storage.removeItem('userInfo');
    Storage.removeItem('hasInit');
    toastShort('注销成功');
    this.logoutTimer = setTimeout(()=> {
      navigator.resetTo({
        component: Login,
        name: 'Login'
      })
    }, 1000);
  }

  componentWillUnmount() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }

  renderBody() {
    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            onPress={()=> {
              this._logOut()
            }}
            style={[styles.listItem, styles.topItem]}>
            <Icon
              name={'sign-out'}
              style={styles.itemIcon}
              size={20}
            />
            <Text>{'注销'}</Text>
          </TouchableOpacity>
          <View style={styles.listItem}>
            <View>
              <Icon
                name={'sign-out'}
                style={styles.itemIcon}
                size={20}/>

            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default connect((state)=> {
  return {
    ...state
  }
})(Settings)
