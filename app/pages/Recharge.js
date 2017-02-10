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

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
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
      <View style={styles.container}>
        <WebView
          javaScriptEnabled={true}
          bounces={false}
          style={styles.webView}
          onLoadStart={()=> {
            {/*this.setState({loading: true})*/}
          }}
          onLoadEnd={()=> {
            {/*this.setState({loading: false})*/}
          }}
          source={{uri: 'https://m.baidu.com'}}
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
