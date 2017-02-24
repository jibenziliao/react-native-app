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
import {ComponentStyles, CommonStyles} from '../style'
import {URL_DEV} from '../constants/Constant'
import pxToDp from '../utils/PxToDp'
import BaseComponent from '../base/BaseComponent'
import {Button as NBButton, Icon as NBIcon} from 'native-base'
import GiftImage from '../components/GiftImage'

const {width, height}=Dimensions.get('window');

let giftArr = [
  {id: 0, name: 'apple', price: 10},
  {id: 1, name: 'apple', price: 10},
  {id: 2, name: 'apple', price: 10},
  {id: 3, name: 'apple', price: 10},
  {id: 4, name: 'apple', price: 10},
  {id: 5, name: 'apple', price: 10},
  {id: 6, name: 'apple', price: 10},
  {id: 7, name: 'apple', price: 10},
  {id: 8, name: 'apple', price: 10},
  {id: 9, name: 'apple', price: 10},
  {id: 10, name: 'apple', price: 10}
];

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

class Gift extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      ...this.props.route.params
    };

    console.log(giftArr);
  }

  getNavigationBarProps() {
    return {
      title: '送礼物',
    };
  }

  componentDidMount() {

  }

  _sendGift() {
    console.log('送礼物');
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
          {this.renderGiftImage()}
        </View>
      </ScrollView>
    )
  }

  renderGiftImage() {
    let tmpArr = [];
    for (let i = 0; i < 30; i++) {
      tmpArr.push({id: i, name: 'apple', price: 10})
    }

    return tmpArr.map((item) => {
      return (
        <GiftImage
          key={item.id}
          onPress={(item) => {
            this._selectItem(item)
          }}
          {...item}/>
      )
    })
  }

  _selectItem(item) {
    console.log(item);
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