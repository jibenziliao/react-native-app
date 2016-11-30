/**
 * 添加公告页面
 * @author keyy/1501718947@qq.com 16/11/30 18:21
 * @description
 */
import React,{Component} from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import {componentStyles} from '../style'
import BaseComponent from '../base/BaseComponent'

class Addannouncement extends BaseComponent{
  constructor(props){
    super(props);
  }

  componentDidMount(){

  }

  getNavigationBarProps() {
    return {
      title: '发布公告',
      hideRightButton: false,
      rightTitle:'完成'
    };
  }

  renderBody(){
    return(
      <View style={componentStyles.container}>
        <Text>{'这是发布公告页面'}</Text>
      </View>
    )
  }

}
export default Addannouncement
