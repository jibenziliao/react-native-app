/**
 *
 * @author keyy/1501718947@qq.com 16/11/9 16:49
 * @description
 */
import React,{Component} from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'
import Button from 'react-native-button'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import {componentStyles} from '../style'


class Message extends BaseComponent{
  constructor(props){
    super(props);
  }

  componentDidMount(){

  }

  render(){
    return(
      <View style={componentStyles.container}>
        <Text>{'333'}</Text>
      </View>
    )
  }

}
export default Message
