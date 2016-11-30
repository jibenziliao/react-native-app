/**
 *
 * @author keyy/1501718947@qq.com 16/11/9 11:57
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

class VicinityList extends BaseComponent{
  constructor(props){
    super(props);
  }

  componentDidMount(){

  }

  render(){
    return(
      <View style={componentStyles.container}>
        <Text>222</Text>
      </View>
    )
  }

}
export default VicinityList
