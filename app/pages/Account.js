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
import {ComponentStyles, CommonStyles, StyleConfig} from '../style'
import pxToDp from '../utils/PxToDp'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  btnRow: {
    marginTop: pxToDp(40),
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  avatarContainer: {
    paddingHorizontal: pxToDp(40),
    paddingVertical: pxToDp(20)
  },
  avatar: {
    width: pxToDp(120),
    height: pxToDp(120),
    borderRadius: pxToDp(60)
  },
  userInfo: {
    flex: 1,
    justifyContent: 'space-around'
  },
  userName: {
    fontWeight: '400',
    fontSize: pxToDp(36)
  },
  btnContainer: {
    flex: 1
  },
  btnLeft: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#F3F3F3'
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: pxToDp(40),
    flex: 1
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: pxToDp(40)
  },
  money: {
    color: StyleConfig.color_primary
  },
  btnText: {
    fontSize: pxToDp(40)
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
          underlayColor={'#E9E9E9'}
          onPress={()=> {
            this._goRecharge()
          }}>
          <View style={styles.btn}>
            <View style={styles.iconBox}>
              <Icon
                name={'usd'}
                size={pxToDp(48)}
                color={'#4CD472'}/>
            </View>
            <Text style={styles.btnText}>{'充值'}</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.btnContainer}
          underlayColor={'#E9E9E9'}
          onPress={()=> {
            this._goTransRecord()
          }}>
          <View style={styles.btn}>
            <View style={styles.iconBox}>
              <Icon
                name={'history'}
                size={pxToDp(48)}
                color={'#e29e40'}/>
            </View>
            <Text style={styles.btnText}>{'交易记录'}</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  renderBody() {
    return (
      <View style={ComponentStyles.container}>
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
