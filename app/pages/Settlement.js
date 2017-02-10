/**
 * 重置结算页面(选择金额及支付方式)
 * @author keyy/1501718947@qq.com 17/2/10 14:33
 * @description
 */
import React,{Component} from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'

const styles=StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
});

class Settlement extends BaseComponent{
  constructor(props){
    super(props);
  }

  getNavigationBarProps() {
    return {
      title: '充值'
    };
  }

  renderBody(){
    return(
      <View style={styles.container}>

      </View>
    )
  }
}

export default connect((state)=> {
  return {
    ...state,
  }
})(Settlement)