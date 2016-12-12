/**
 *
 * @author keyy/1501718947@qq.com 16/12/12 14:44
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import * as Storage from '../utils/Storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import Login from '../pages/Login'
import {toastShort} from '../utils/ToastUtil'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  listItem: {
    backgroundColor: '#fff',
    borderBottomColor: '#E2E2E2',
    borderBottomWidth: 1,
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection:'row',
    margin:10
  },
  itemIcon: {
    width: 60,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  itemText:{
    textAlignVertical:'center'
  }
});

let navigator;

class Settings extends BaseComponent {
  constructor(props) {
    super(props);
    navigator = this.props.navigator;
  }

  getNavigationBarProps() {
    return {
      title: '设置'
    };
  }

  _logOut() {
    Storage.removeItem('hasRegistered');
    Storage.removeItem('userInfo');
    toastShort('注销成功');
    this.timer=setTimeout(()=>{
      navigator.resetTo({
        component:Login,
        name:'Login'
      })
    },1000);
  }

  componentWillUnmount(){
    if(this.timer){
      clearTimeout(this.timer);
    }
  }

  renderBody() {
    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            onPress={()=> {
              this._logOut()
            }}
            style={styles.listItem}>
            <Icon
              name={'sign-out'}
              style={styles.itemIcon}
              size={20}
            />
            <Text style={styles.itemText}>{'注销'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default connect((state)=> {
  return {
    ...state
  }
})(Settings)
