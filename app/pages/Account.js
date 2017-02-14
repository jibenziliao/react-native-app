/**
 * 账户资料
 * @author keyy/1501718947@qq.com 17/2/9 16:01
 * @description
 */

import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableHighlight,
  Dimensions,
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import Icon from 'react-native-vector-icons/FontAwesome'
import tmpGlobal from '../utils/TmpVairables'
import {URL_DEV} from '../constants/Constant'
import TranscationRecordList from '../pages/TranscationRecordList'
import Recharge from '../pages/Recharge'
import * as HomeActions from '../actions/Home'
import * as Storage from '../utils/Storage'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  btnRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  avatarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  avatar: {
    width: width / 6,
    height: width / 6,
    borderRadius: width / 12
  },
  userInfo: {
    flex: 1,
    justifyContent: 'space-around'
  },
  userName: {
    fontWeight: '400',
    fontSize: 18
  },
  btnContainer: {
    flex: 1
  },
  btnLeft: {
    borderRightWidth: 0.5,
    borderRightColor: '#E2E2E2'
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    flex: 1
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20
  },
  money: {
    color: '#4CD472'
  },
  btnText: {
    fontSize: 20
  }
});

let navigator;

class Account extends BaseComponent {

  constructor(props) {
    super(props);
    navigator = this.props.navigator;
    this.state = {
      PhotoUrl: tmpGlobal.currentUser.PhotoUrl,
      Nickname: tmpGlobal.currentUser.Nickname,
      UserBalance: tmpGlobal.currentUser.UserBalance
    };
  }

  getNavigationBarProps() {
    return {
      title: '账户资料'
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=> {
      this._getUserInfo();
    })
  }

  _getUserInfo() {
    const {dispatch}=this.props;
    dispatch(HomeActions.getCurrentUserProfile('', (json)=> {
      this.setState({
        PhotoUrl: json.Result.PhotoUrl,
        Nickname: json.Result.Nickname,
        UserBalance: json.Result.UserBalance
      });
      tmpGlobal.currentUser = json.Result;
      Storage.setItem('userInfo', json.Result);
    }, (error)=> {
    }));
  }

  _goRecharge() {
    navigator.push({
      component: Recharge,
      name: 'Recharge'
    });
  }

  _goTransRecord() {
    navigator.push({
      component: TranscationRecordList,
      name: 'TranscationRecordList'
    });
  }

  renderAccountInfo() {
    return (
      <View style={styles.userInfoContainer}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{uri: URL_DEV + this.state.PhotoUrl}}/>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{this.state.Nickname}</Text>
          <Text>
            {'剩余觅豆'}
            <Text style={styles.money}>{this.state.UserBalance}</Text>
            {'个'}
          </Text>
        </View>
      </View>
    )
  }

  renderAccountAction() {
    return (
      <View style={styles.btnRow}>
        <TouchableHighlight
          style={[styles.btnContainer, styles.btnLeft]}
          underlayColor={'#b8b8bf'}
          onPress={()=> {
            this._goRecharge()
          }}>
          <View style={styles.btn}>
            <View style={styles.iconBox}>
              <Icon name={'usd'} size={24} color={'#4CD472'}/>
            </View>
            <Text style={styles.btnText}>{'充值'}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.btnContainer}
          underlayColor={'#b8b8bf'}
          onPress={()=> {
            this._goTransRecord()
          }}>
          <View style={styles.btn}>
            <View style={styles.iconBox}>
              <Icon name={'history'} size={24} color={'#e29e40'}/>
            </View>
            <Text style={styles.btnText}>{'交易记录'}</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  renderBody() {
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.renderAccountInfo()}
          {this.renderAccountAction()}
        </ScrollView>
      </View>
    )
  }
}

export default connect((state)=> {
  return {
    ...state,
  }
})(Account)
