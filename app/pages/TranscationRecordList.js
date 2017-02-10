/**
 * 交易记录
 * @author keyy/1501718947@qq.com 17/2/10 14:05
 * @description
 */
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
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'

const styles=StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
});

class TranscationRecordList extends BaseComponent{

  constructor(props){
    super(props);
  }

  getNavigationBarProps() {
    return {
      title: '交易记录'
    };
  }

  renderBody(){
    return(
      <View style={styles.container}>

      </View>
    )
  }
}

export default connect((state)=> {
  return {
    ...state,
  }
})(TranscationRecordList)
