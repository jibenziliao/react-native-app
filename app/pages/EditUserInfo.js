/**
 * 编辑我的详细资料
 * @author keyy/1501718947@qq.com 16/12/5 16:02
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
import BaseComponent from '../base/BaseComponent'

const styles=StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
});

class EditUserInfo extends BaseComponent{
  constructor(props){
    super(props);
    this.state={
      ...this.props.route.params
    };
    console.log(this.props.route.params);
  }

  componentDidMount(){

  }

  getNavigationBarProps() {
    return {
      title: '编辑资料',
      hideRightButton: false,
      rightTitle:'完成'
    };
  }

  renderBody(){
    return(
      <View style={styles.container}>
        <Text>{'编辑我的资料'}</Text>
      </View>
    )
  }

}
export default EditUserInfo
