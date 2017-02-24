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
    borderColor: '#f0f0f0'
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
      selected: this.props.selected
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selected !== nextProps.selected) {
      this.setState({
        selected: nextProps.selected
      })
    }
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
      backgroundColor: this.state.selected ? '#FAFAFA' : '#fff'
    }
  }

  render() {
    return (
      <TouchableHighlight
        onPress={() => {
          this.setState({
            selected: true
          }, () => {
            this.props.press(this.props.id)
          })
        }}
        underlayColor={'#FAFAFA'}>
        <View style={[styles.touchableItem, this.renderBackgroundColor()]}>
          <View style={styles.gift}>
            <Image
              style={styles.image}
              source={{uri: this.props.imageUri}}/>
            <Text style={styles.giftName}>{this.props.name}</Text>
            <Text style={styles.price}>{this.props.type === 1 ? '免费' : `${this.props.price}觅豆`}</Text>
          </View>
          {this.renderSelectIcon()}
        </View>
      </TouchableHighlight>
    )
  }
}

export default GiftImage

GiftImage.propTypes = {
  name: React.PropTypes.string.isRequired,
  id: React.PropTypes.number.isRequired,
  price: React.PropTypes.number.isRequired,
  type: React.PropTypes.number.isRequired,
  imageUri: React.PropTypes.string.isRequired,
  press: React.PropTypes.func.isRequired,
  selected: React.PropTypes.bool.isRequired,
};

GiftImage.defaultProps = {
  selected: false
};