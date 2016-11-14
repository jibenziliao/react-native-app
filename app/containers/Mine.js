/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 09:54
 * @description
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  InteractionManager
} from 'react-native';
import {getNavigator} from '../navigation/Route'
import BaseComponent from '../base/BaseComponent'
import * as Storage from '../utils/Storage'

class Mine extends BaseComponent{
  constructor(props){
    super(props)
  }

  getNavigationBarProps() {
    return {
      title: '我的',
      hideLeftButton:true
    };
  }

  componentWillMount(){

  }

  renderBody() {
    return(
      <View>
        <Text>444</Text>
      </View>
    )
  }
}

export default Mine