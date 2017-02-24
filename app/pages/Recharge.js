/**
 * 充值页面
 * @author keyy/1501718947@qq.com 17/2/9 16:51
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
  InteractionManager,
  Dimensions,
  WebView,
  Platform,
  StatusBar
} from 'react-native'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import Spinner from '../components/Spinner'
import {ComponentStyles,CommonStyles} from '../style'
import {URL_RECHARGE,URL_RECHARGE_DESKTOP} from '../constants/Constant'
import pxToDp from '../utils/PxToDp'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    ...Platform.select({
      ios: {
        height: height - 64
      },
      android: {
        height: height - StatusBar.currentHeight - 54
      }
    })
  },
  tipsContainer:{
    justifyContent:'center',
    alignItems:'center'
  },
  tipsText:{
    fontSize:pxToDp(32)
  }
});

class Recharge extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  getNavigationBarProps() {
    return {
      title: '充值'
    };
  }

  //http://120.26.162.192/Settlement.html
  //require('./html/Settlement.html')
  renderBody() {
    /*return (
      <View style={ComponentStyles.container}>
        <WebView
          javaScriptEnabled={true}
          bounces={false}
          style={styles.webView}
          source={{uri:`${URL_RECHARGE}`}}
        />
      </View>
    )*/

    return(
      <View style={[ComponentStyles.container,styles.tipsContainer]}>
        <Text style={styles.tipsText}>{'手机端充值暂未开通'}</Text>
        <Text style={styles.tipsText}>{'请在电脑端完成充值'}</Text>
        <Text style={styles.tipsText}>{'地址：'}{URL_RECHARGE_DESKTOP}</Text>
      </View>
    )
  }

  renderSpinner() {
    if (this.state.loading) {
      return (
        <Spinner animating={this.state.loading}/>
      )
    }
  }

}

export default connect((state)=> {
  return {
    ...state,
  }
})(Recharge)
