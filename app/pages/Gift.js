/**
 * 送礼物
 * @author keyy/1501718947@qq.com 17/2/24 11:21
 * @description
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  ScrollView,
  InteractionManager,
  Alert,
  Dimensions,
  NativeAppEventEmitter,
  DeviceEventEmitter,
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import tmpGlobal from '../utils/TmpVairables'
import * as HomeActions from '../actions/Home'
import * as Storage from '../utils/Storage'
import {ComponentStyles, CommonStyles} from '../style'
import {URL_DEV, URL_ADMIN_IMG_DEV} from '../constants/Constant'
import pxToDp from '../utils/PxToDp'
import BaseComponent from '../base/BaseComponent'
import {Button as NBButton, Icon as NBIcon} from 'native-base'
import GiftImage from '../components/GiftImage'
import EmptyView from '../components/EmptyView'
import Recharge from '../pages/Recharge'
import {dateFormat} from '../utils/DateUtil'
import {toastShort} from '../utils/ToastUtil'

const {width, height}=Dimensions.get('window');

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#fff'
  },
  userInfoContainer: {
    width: width,
    alignItems: 'center',
    paddingVertical: pxToDp(20),
  },
  userAvatar: {
    width: pxToDp(160),
    height: pxToDp(160),
    borderRadius: pxToDp(20),
  },
  userName: {
    fontSize: pxToDp(32),
    marginTop: pxToDp(20)
  },
  giftContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  bottomBtn: {
    height: pxToDp(80),
    borderRadius: 0,
  },
  btnIcon: {
    color: '#fff'
  }
});

let navigator;
let emitter;

class Gift extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      ...this.props.route.params,
      giftArr: [],
      selectedGift: null
    };
    navigator = this.props.navigator;
    emitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter;
  }

  getNavigationBarProps() {
    return {
      title: '送礼物',
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this._getGiftList();
    });
  }

  componentWillUnmount() {
    if (this.sendTimer) {
      clearTimeout(this.sendTimer);
    }
  }

  _getGiftList() {
    const {dispatch}=this.props;
    dispatch(HomeActions.getGifts('', (json) => {
      this._renderGiftHandler(json.Result);
    }, (error) => {
    }));
  }

  _renderGiftHandler(data) {
    let tmpArr = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].IsValid) {
        data[i].selected = false;
        tmpArr.push(data[i]);
      }
    }
    this.setState({
      giftArr: tmpArr
    });
  }

  _sendGift() {
    if (!this.state.selectedGift) {
      this._alert('你还没有选择礼物，请先选择礼物', () => {
      }, false);
    } else if (!this._canSendGift(this.state.selectedGift.Amount)) {
      this._alert('你的觅豆不足，请充值', () => {
        this._goRecharge()
      }, true)
    } else {
      this._sendGiftRequest();
    }
  }

  _sendGiftRequest() {
    const {dispatch}=this.props;
    let data = {
      receiverId: this.state.UserId,
      giftId: this.state.selectedGift.Id
    };
    dispatch(HomeActions.sendGift(data, (json) => {
      this._sendGiftMsg(this.state.selectedGift.Name);
      toastShort('赠送成功');
      this.sendTimer = setTimeout(() => {
        navigator.pop();
      }, 1000);
    }, (error) => {

    }));
  }

  _goRecharge() {
    navigator.push({
      component: Recharge,
      name: 'Recharge'
    });
  }

  _sendGiftMsg(str) {
    let tmpId = Math.round(Math.random() * 1000000);
    //单条发送的消息存入缓存中时,需要将日期转成字符串存储
    let params = {
      MsgContent: `[礼物]你已成功赠送${str}给${this.state.Nickname}。`,
      MsgId: tmpId,
      MsgType: 5,//5代表送礼物/接收礼物
      SendTime: dateFormat(new Date()),
      HasSend: true,
      _id: tmpId,
      text: `[礼物]你已成功赠送${str}给${this.state.Nickname}。`,
      createdAt: dateFormat(new Date()),
      user: {
        _id: tmpGlobal.currentUser.UserId,
        name: tmpGlobal.currentUser.Nickname,
        avatar: URL_DEV + tmpGlobal.currentUser.PhotoUrl,
        myUserId: tmpGlobal.currentUser.UserId
      },
    };

    let sendMsgParams = {
      H: 'chatcore',
      M: 'UserSendMsgToUser',
      A: [this.state.UserId + '', `[礼物]${tmpGlobal.currentUser.Nickname}赠送${str}给你，快去礼物中心看看吧`],
      I: Math.floor(Math.random() * 11)
    };

    if (tmpGlobal.ws.readyState === 1) {
      this._sendSaveRecord(params);
      tmpGlobal.ws.send(JSON.stringify(sendMsgParams));
    }
  }

  //发送时缓存(同时需要发布订阅,供Message页面监听)
  _sendSaveRecord(data) {
    //跟当前用户没有聊天记录
    let allMsg = {
      SenderAvatar: this.state.PrimaryPhotoFilename,
      SenderId: this.state.UserId,
      SenderNickname: this.state.Nickname,
      MsgList: [data]
    };
    Storage.getItem(`${tmpGlobal.currentUser.UserId}_MsgList`).then((res) => {
      if (res !== null && res.length > 0) {
        let index = res.findIndex((item) => {
          return item.SenderId === this.state.UserId
        });
        if (index > -1) {
          res[index].MsgList.push(data);
        } else {
          res.push(allMsg);
        }
        for (let i = 0; i < res.length; i++) {
          res[i].MsgList = this._updateAvatar(res[i].MsgList)
        }
        console.log('发送时更新消息缓存数据', res, data);
        Storage.setItem(`${tmpGlobal.currentUser.UserId}_MsgList`, res).then(() => {
          emitter.emit('MessageCached', {data: res, message: '消息缓存成功'});
        });
      } else {
        Storage.setItem(`${tmpGlobal.currentUser.UserId}_MsgList`, [allMsg]).then(() => {
          emitter.emit('MessageCached', {data: [allMsg], message: '消息缓存成功'});
        });
      }
    });
  }

  //发送消息时，更改本地缓存中的当前用户的头像(如果用户改了头像的话)
  _updateAvatar(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].user._id === data[i].user.myUserId) {
        data[i].user.avatar = URL_DEV + tmpGlobal.currentUser.PhotoUrl
      }
    }
    return data;
  }

  _alert(str, callback, twoBtn) {
    Alert.alert('提示', str, [
      {
        text: '确定', onPress: () => {
        callback()
      }
      },
      twoBtn ? {
          text: '取消', onPress: () => {
          }
        } : null
    ]);
  }

  _canSendGift(data) {
    return tmpGlobal.currentUser.UserBalance >= data
  }

  renderUserInfo() {
    return (
      <View style={styles.userInfoContainer}>
        <Image
          source={{uri: URL_DEV + this.state.PrimaryPhotoFilename}}
          style={styles.userAvatar}/>
        <Text style={styles.userName}>{`送给${this.state.Nickname}的小礼物`}</Text>
      </View>
    )
  }

  renderGift() {
    return (
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.giftContainer}>
          {this.renderGiftImage(this.state.giftArr)}
        </View>
      </ScrollView>
    )
  }

  renderGiftImage(data) {
    if (data && data.length > 0) {
      return data.map((item) => {
        return (
          <GiftImage
            key={item.Id}
            press={(id) => {
              this._selectItem(id)
            }}
            name={item.Name}
            id={item.Id}
            type={item.GiftType}
            price={item.Amount}
            selected={item.selected}
            imageUri={URL_ADMIN_IMG_DEV + item.GiftImg}/>
        )
      });
    } else {
      return <EmptyView/>
    }
  }

  _selectItem(data) {
    for (let i = 0; i < this.state.giftArr.length; i++) {
      this.state.giftArr[i].selected = false;
    }
    let index = this.state.giftArr.findIndex((item) => {
      return data === item.Id;
    });

    this.state.giftArr[index].selected = true;
    this.setState({
      giftArr: this.state.giftArr,
      selectedGift: this.state.giftArr[index]
    });
  }

  renderSendBtn() {
    return (
      <NBButton
        block
        iconLeft
        textStyle={ComponentStyles.btnText}
        style={[styles.bottomBtn, CommonStyles.background_primary]}
        onPress={() => {
          this._sendGift()
        }}>
        <NBIcon
          name={'ios-archive-outline'}
          style={styles.btnIcon}/>
        送礼物
      </NBButton>
    )
  }

  renderBody() {
    return (
      <View style={ComponentStyles.container}>
        {this.renderUserInfo()}
        {this.renderGift()}
        {this.renderSendBtn()}
      </View>
    )
  }
}

export default connect((state) => {
  return {
    ...state
  }
})(Gift)