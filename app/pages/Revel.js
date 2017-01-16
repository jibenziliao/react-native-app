/**
 * 随缘
 * @author keyy/1501718947@qq.com 17/1/12 15:54
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  DeviceEventEmitter,
  Keyboard,
  Alert,
  BackAndroid,
  Platform,
  Dimensions,
  ScrollView
} from 'react-native'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import {Button as NBButton} from 'native-base'
import * as HomeActions from '../actions/Home'
import {toastShort} from '../utils/ToastUtil'

const {width, height}=Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2',
    padding: 10
  },
  scrollView: {
    flex: 1
  },
  tips:{
    flexDirection:'row',
    textAlign:'center',
    fontSize:14,
    paddingHorizontal:10,
    marginVertical:10
  },
  signatureContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    height: width / 3,
    backgroundColor: '#FFF',
    textAlign: 'left',
    textAlignVertical: 'top',
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  saveBtn: {
    marginTop: 20,
    height: 40,
    alignItems: 'center'
  }
});

let navigator;

class Revel extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      hasChanged: false,
      msg:''
    };
    navigator = this.props.navigator;
    this.onBackAndroid = this.onBackAndroid.bind(this);
  }

  getNavigationBarProps() {
    return {
      title: '随缘'
    };
  }

  //保存随缘
  _saveFloatMsg(data) {
    Keyboard.dismiss();
    const {dispatch}=this.props;
    dispatch(HomeActions.setFloatMsg({Msg:data},(json)=>{
      toastShort('发送成功');
      this.sendFloatTimer = setTimeout(()=> {
        navigator.pop();
      }, 1000)
    },(error)=>{
      toastShort(json.Message);
    }));
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  onLeftPressed() {
    this._backAlert();
  }

  onBackAndroid() {
    this._backAlert();
  }

  _backAlert() {
    Keyboard.dismiss();
    if (this.state.hasChanged) {
      Alert.alert('提示', '您编辑的资料未保存,确定要离开吗?', [
        {
          text: '确定', onPress: () => {
          navigator.pop();
        }
        },
        {
          text: '取消', onPress: () => {
        }
        }
      ]);
    } else {
      navigator.pop();
    }
  }

  componentWillUnmount() {
    if (this.sendFloatTimer) {
      clearTimeout(this.sendFloatTimer);
    }
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  renderBody() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={true}>
          <Text style={styles.tips}>
            {'您的随缘消息会随机发给若干个人,期待有缘人'}
          </Text>
          <TextInput
            placeholder={'请在此编辑你想说的话'}
            multiline={true}
            maxLength={25}
            style={styles.signatureContent}
            value={this.state.msg}
            underlineColorAndroid={'transparent'}
            onChangeText={(msg)=> {
              this.setState({msg: msg, hasChanged: true})
            }}
          />
          <NBButton
            block
            style={styles.saveBtn}
            onPress={()=>this._saveFloatMsg(this.state.msg)}
            disabled={!this.state.msg}>
            完成
          </NBButton>
        </ScrollView>
      </View>
    )
  }

}

export default connect((state)=> {
  return {
    ...state
  }
})(Revel)