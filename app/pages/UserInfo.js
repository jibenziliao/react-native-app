/**
 * 查看用户详情
 * @author keyy/1501718947@qq.com 16/12/1 15:03
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import {componentStyles} from '../style'
import BaseComponent from '../base/BaseComponent'
import {URL_DEV, TIME_OUT} from '../constants/Constant'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  scrollViewContainer: {
    flex: 1,
    padding: 10
  },
  photoContainer: {
    flexDirection:'row',
  },
  photos: {
    width: 100,
    height: 100,
    marginRight: 10
  }
});

class UserInfo extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.route.params
    };
    console.log(this.props.route.params);
  }

  componentDidMount() {

  }

  getNavigationBarProps() {
    return {
      title: this.state.Nickname,
      hideRightButton: false,
      rightIcon: {
        name: 'ellipsis-v'
      },
    };
  }

  //渲染用户的相册
  _renderPhotos(arr) {
    console.log(arr);
    return arr.map((item, index)=> {
      return (
        <Image
          key={index}
          style={styles.photos}
          source={{uri: URL_DEV + item.PhotoUrl}}/>
      )
    })
  }

  renderBody() {
    return (
      <View style={styles.container}>
        <View style={styles.scrollViewContainer}>
          <ScrollView
            horizontal={true}
            style={styles.photoContainer}>
            {this._renderPhotos(this.state.userPhotos)}
          </ScrollView>
        </View>
      </View>
    )
  }

}
export default UserInfo
