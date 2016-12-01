/**
 * 查看用户详情
 * @author keyy/1501718947@qq.com 16/12/1 15:03
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import {componentStyles} from '../style'
import BaseComponent from '../base/BaseComponent'

class UserInfo extends BaseComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  getNavigationBarProps() {
    return {
      title: '个人信息',
      hideRightButton: false,
      rightIcon: {
        name: 'ellipsis-v'
      },
    };
  }

  renderBody() {
    return (
      <View style={componentStyles.container}>
        <Text>{'用户详情'}</Text>
      </View>
    )
  }

}
export default UserInfo
