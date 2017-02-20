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

  renderBody() {
    return (
      <View style={ComponentStyles.container}>
        <WebView
          javaScriptEnabled={true}
          bounces={false}
          style={styles.webView}
          source={{uri:'http://120.26.162.192/Settlement.html'}}
        />
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
