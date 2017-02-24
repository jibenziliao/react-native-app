/**
 * 送礼物单个礼物组件
 * @author keyy/1501718947@qq.com 17/2/24 11:58
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableHighlight,
  Dimensions,
} from 'react-native'
import IonIcon from 'react-native-vector-icons/Ionicons'
import pxToDp from '../utils/PxToDp'
import {ComponentStyles, CommonStyles, StyleConfig} from '../style'

const {width, height}=Dimensions.get('window');

const styles = StyleSheet.create({
  touchableItem: {
    width: width / 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#cecece'
  },
  gift: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: pxToDp(40),
    paddingHorizontal: pxToDp(40)
  },
  icon: {
    position: 'absolute',
    top: pxToDp(6),
    right: pxToDp(10)
  },
  giftName: {
    fontSize: pxToDp(28),
    marginTop: pxToDp(20),
    marginBottom: pxToDp(10)
  },
  price: {
    fontSize: pxToDp(24)
  },
  image: {
    width: width / 6,
    height: width / 6
  },
});

class GiftImage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
    console.log(this.props);
  }

  renderSelectIcon() {
    if (this.state.selected) {
      return (
        <IonIcon
          name={'ios-checkmark-circle'}
          color={StyleConfig.color_primary}
          size={pxToDp(58)}
          style={styles.icon}/>
      )
    } else {
      return null;
    }
  }

  renderBackgroundColor() {
    return {
      backgroundColor: this.state.selected ? '#dfa' : '#fff'
    }
  }

  render() {
    return (
      <TouchableHighlight
        onPress={() => {
          this.setState({
            selected: true
          }, () => {
            this.props.onPress(this.props.id)
          })
        }}
        underlayColor={'#cecece'}>
        <View style={[styles.touchableItem, this.renderBackgroundColor()]}>
          <View style={styles.gift}>
            <Image
              style={styles.image}
              source={require('./img/imgLoading.gif')}/>
            <Text style={styles.giftName}>{'蛋糕'}</Text>
            <Text style={styles.price}>{'19觅豆'}</Text>
          </View>
          {this.renderSelectIcon()}
        </View>
      </TouchableHighlight>
    )
  }
}

export default GiftImage