/**
 * 重置结算页面(选择金额及支付方式)
 * @author keyy/1501718947@qq.com 17/2/10 14:33
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  ScrollView
} from 'react-native'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import {Button as NBButton, Icon as NBIcon} from 'native-base'
import Recharge from '../pages/Recharge'
import {ComponentStyles,CommonStyles} from '../style'

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  blockBtn: {
    flex: 1,
    borderRadius: 0,
    height: 40
  }
});

class Settlement extends BaseComponent {

  constructor(props) {
    super(props);
  }

  getNavigationBarProps() {
    return {
      title: '充值'
    };
  }

  renderBody() {
    return (
      <View style={ComponentStyles.container}>
        <ScrollView style={styles.scrollView}>

        </ScrollView>
        <NBButton
          block
          style={styles.blockBtn}
          onPress={()=> {
            console.log('12');
          }}
          disabled={true}>
          立即支付
        </NBButton>
      </View>
    )
  }
}

export default connect((state)=> {
  return {
    ...state,
  }
})(Settlement)