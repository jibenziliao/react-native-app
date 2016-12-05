/**
 * 用户的全部动态列表
 * @author keyy/1501718947@qq.com 16/12/5 17:27
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

const styles=StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
});

class AnnouncementList extends BaseComponent{
  constructor(props){
    super(props);
    this.state={
      ...this.props.route.params
    };
  }

  componentDidMount(){

  }

  getNavigationBarProps() {
    return {
      title: this.state.Nickname
    };
  }

  renderBody(){
    return(
      <View style={styles.container}>
        <Text>{'附近列表模式'}</Text>
      </View>
    )
  }

}
export default AnnouncementList
