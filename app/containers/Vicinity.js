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
import BaseComponent from '../base/BaseComponent';

class Vicinity extends BaseComponent{
  constructor(props){
    super(props)
  }

  getNavigationBarProps() {
    return {
      title: '附近',
      hideLeftButton:true
    };
  }

  renderBody() {
    return(
      <View>
        <Text>222</Text>
      </View>
    )
  }
}

export default Vicinity