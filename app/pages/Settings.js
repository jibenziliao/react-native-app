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
  TouchableOpacity,
  Switch,
  Alert,
  DeviceEventEmitter
} from 'react-native'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import * as Storage from '../utils/Storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import Login from '../pages/Login'
import {toastShort} from '../utils/ToastUtil'
import tmpGlobal from '../utils/TmpVairables'
import * as HomeActions from '../actions/Home'
import {ComponentStyles,CommonStyles} from '../style'

const styles = StyleSheet.create({
  topItem: {
    marginTop: 10
  },
  listItem: {
    backgroundColor: '#fff',
    borderBottomColor: '#F3F3F3',
    borderBottomWidth: 1,
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    margin: 10,
    marginTop: 0,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  itemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemIconContainer: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemIcon: {}
});

let navigator;

class Settings extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      MapPrecision: tmpGlobal.currentUser.MapPrecision,
      TurnPushOn: tmpGlobal.currentUser.TurnPushOn
    };
    navigator = this.props.navigator;
    console.log(tmpGlobal.currentUser);
  }

  getNavigationBarProps() {
    return {
      title: '设置'
    };
  }

  _logOutConfirm() {
    Alert.alert('提示', '确定要注销吗?', [
      {
        text: '确定', onPress: () => {
        this._logOut();
      }
      },
      {
        text: '取消', onPress: () => {
      }
      }
    ]);
  }

  _logOut() {
    //websocket注销当前用户
    tmpGlobal.ws = null;
    tmpGlobal.currentUser = null;
    tmpGlobal.cookie = null;
    Storage.removeItem('hasRegistered');
    Storage.removeItem('userInfo');
    Storage.removeItem('hasInit');
    toastShort('注销成功');
    this.logoutTimer = setTimeout(()=> {
      //这里用replace,避免跳转登录页后安卓物理返回键监听失效。但这样做的话,app运行期间,每进行一次注销重新登录,路由栈中就会多一个MainContainer的路由。
      navigator.resetTo({
        component: Login,
        name: 'Login'
      });
    }, 1000);
  }

  componentWillUnmount() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  }

  _updateMapPrecisionQuiet(data) {
    const {dispatch}=this.props;
    dispatch(HomeActions.setMapPrecisionQuiet({MapPrecision: data}, (json)=> {
      DeviceEventEmitter.emit('userInfoChanged', '成功开启隐身');
    }, (error)=> {

    }));
  }

  _confirmChange(value) {
    //value的值是反的,当前是未开启的状态,value为true,反之则为false
    if (value) {
      Alert.alert('提示', '开启隐身后，不可使用寻TA功能，且对附近的人隐身！是否确定隐身？', [
        {
          text: '确定', onPress: () => {
          this.setState({
            MapPrecision: null
          }, ()=> {
            this._updateMapPrecisionQuiet(this.state.MapPrecision);
          });
        }
        },
        {
          text: '取消', onPress: () => {
          this.setState({
            MapPrecision: 1000
          })
        }
        }
      ]);
    } else {
      this.setState({
        MapPrecision: 1000
      }, ()=> {
        this._updateMapPrecisionQuiet(this.state.MapPrecision);
      });
    }
  }

  _pushSwitch(value) {
    const {dispatch}=this.props;
    dispatch(HomeActions.pushSwitch('', (json)=> {
      this._updateUserInfo()
    }, (error)=> {
      this.setState({
        TurnPushOn: !value
      }, ()=> {
        this._updateUserInfo()
      });
    }));
  }

  _updateUserInfo() {
    const {dispatch}=this.props;
    dispatch(HomeActions.getCurrentUserProfile('', (json)=> {
      Storage.setItem('userInfo', json.Result);
      tmpGlobal.currentUser = json.Result;
      this.setState({
        TurnPushOn: tmpGlobal.currentUser.TurnPushOn
      });
    }, (error)=> {
    }));
  }

  renderBody() {
    return (
      <View style={ComponentStyles.container}>
        <View>
          <TouchableOpacity
            onPress={()=> {
              this._logOutConfirm()
            }}
            style={[styles.listItem, styles.topItem]}>
            <View style={styles.itemLeft}>
              <View style={styles.itemIconContainer}>
                <Icon
                  name={'sign-out'}
                  style={styles.itemIcon}
                  size={20}
                />
              </View>
              <Text>{'注销'}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.listItem}>
            <View style={styles.itemLeft}>
              <View style={styles.itemIconContainer}>
                <Icon
                  name={'low-vision'}
                  style={styles.itemIcon}
                  size={20}/>
              </View>
              <Text style={styles.itemText}>{'隐身'}</Text>
            </View>
            <Switch
              onValueChange={(value)=> {
                this.setState({
                  MapPrecision: null
                }, ()=> {
                  this._confirmChange(value)
                });
              }}
              value={this.state.MapPrecision === null}/>
          </View>
          <View style={styles.listItem}>
            <View style={styles.itemLeft}>
              <View style={styles.itemIconContainer}>
                <Icon
                  name={'commenting-o'}
                  style={styles.itemIcon}
                  size={20}/>
              </View>
              <Text style={styles.itemText}>{'新消息通知'}</Text>
            </View>
            <Switch
              onValueChange={(value)=> {
                this.setState({
                  TurnPushOn: value
                }, (value)=> {
                  this._pushSwitch(value);
                })
              }}
              value={this.state.TurnPushOn}/>
          </View>
          <View style={styles.listItem}>
            <View style={styles.itemLeft}>
              <View style={styles.itemIconContainer}>
                <Icon
                  name={'info-circle'}
                  style={styles.itemIcon}
                  size={20}/>
              </View>
              <Text style={styles.itemText}>{'软件版本'}</Text>
            </View>
            <Text>{tmpGlobal.appInfo.appVersionReadable}</Text>
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
