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
import Button from 'react-native-button'
import MessageDetail from '../pages/MessageDetail'
import Login from '../pages/Login'

let navigator;

class Home extends BaseComponent{
  constructor(props){
    super(props);
    navigator=this.props.navigator;

  }

  getNavigationBarProps() {
    return {
      title: '广场',
      hideLeftButton:true
    };
  }

  onRightPressed(){
    console.log('这是继承后的方法');
  }

  goMessageDetail(){
    navigator.push({
      component:MessageDetail,
      name:'MessageDetail'
    })
  }

  goLogin(){
    navigator.push({
      component:Login,
      name: 'Login'
    });
  }

  renderBody() {
    return(
      <View style={{flex:1,paddingHorizontal:10}}>
        <Button
          style={{
            backgroundColor:'#3281DD',
            marginVertical:30,
            borderRadius:4,
            height:50,
            color:'#FFF',
            padding:10,
            textAlignVertical:'center',
          }}
        onPress={()=>{this.goMessageDetail()}}>
          测试页面跳转
        </Button>
        <Button
          style={{
            backgroundColor:'#3281DD',
            marginVertical:30,
            borderRadius:4,
            height:50,
            color:'#FFF',
            padding:10,
            textAlignVertical:'center',
          }}
          onPress={()=>{this.goLogin()}}>
          测试登录
        </Button>
      </View>
    )
  }
}

export default Home