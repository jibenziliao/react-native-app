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
  Dimensions
} from 'react-native'
import {connect} from 'react-redux'
import tmpGlobal from '../utils/TmpVairables'
import {toastLong} from '../utils/ToastUtil'
import * as HomeActions from '../actions/Home'
import {ComponentStyles, CommonStyles} from '../style'
import {URL_DEV, URL_ADMIN_IMG_DEV} from '../constants/Constant'
import pxToDp from '../utils/PxToDp'
import BaseComponent from '../base/BaseComponent'
import {Button as NBButton, Icon as NBIcon} from 'native-base'
import GiftImage from '../components/GiftImage'
import EmptyView from '../components/EmptyView'
import Recharge from '../pages/Recharge'

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

class Gift extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      ...this.props.route.params,
      giftArr: [],
      selectedGift: null
    };
    navigator = this.props.navigator;
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
      //送礼物
      console.log('送礼物');
    }
  }

  _goRecharge() {
    navigator.push({
      component: Recharge,
      name: 'Recharge'
    });
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
    return tmpGlobal.currentUser.UserBalance > data
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
          name={'ios-chatbubbles-outline'}
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