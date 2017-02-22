/**
 * 空页面提示
 * @author keyy/1501718947@qq.com 17/2/22 10:05
 * @description
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Image,
} from 'react-native'
import pxToDp from '../utils/PxToDp'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: pxToDp(300)
  }
});

class EmptyView extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          resizeMode={'contain'}
          source={require('./img/empty.png')}
        />
      </View>
    )
  }
}

export default EmptyView;