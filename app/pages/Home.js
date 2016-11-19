/**
 *
 * @author keyy/1501718947@qq.com 16/11/8 17:00
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
import {Button as NBButton} from 'native-base'
import {StyleConfig, CommonStyles,componentStyles} from '../style'

class Home extends Component{
  constructor(props){
    super(props);
    console.log(props);
  }

  initApp(){
    const {dispatch}=this.props;
    dispatch(InitialAppActions.init());
  }

  onRight(props){
    console.log('456');
  }

  componentDidMount(){
    this.initApp();
  }

  render(){
    return(
      <View style={componentStyles.container}>
        <Text>111</Text>
      </View>
    )
  }

}
export default connect()(Home)
