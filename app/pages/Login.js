/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 17:09
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Picker,
  PickerIOS,
  Platform,
  TouchableHighlight
} from 'react-native'
import {getNavigator} from '../navigation/Route'
import * as Storage from '../utils/Storage'
import BaseComponent from '../base/BaseComponent'
import Button from 'react-native-button'
import {CommonStyles} from '../style'
import dismissKeyboard from 'dismissKeyboard'
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'
import Icon from 'react-native-vector-icons/FontAwesome'

const styles = StyleSheet.create({
  loginPage: {
    flex: 1,
    padding: 10,
    backgroundColor: '#E2E2E2'
  },
  flex_1: {
    flex: 1
  },
  tipsArea: {
    flexDirection: 'row',
    marginVertical: 20
  },
  tips: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20
  },
  loginForm: {
    borderRadius: 4,
  },
  picker: {
    width: 100
  },
  pickerMenu: {
    width: 60,
    height: 50,
    justifyContent: 'center'
  },
  pickerView: {
    backgroundColor: '#DADADA',
    marginRight: 10,
    paddingLeft: 10,
    borderRadius: 4
  },
  inputItem: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    height: 50,
    marginBottom: 20
  },
  label: {
    width: 60
  },
  input: {
    backgroundColor: '#DADADA',
    flex: 1,
    paddingLeft: 10,
    borderRadius: 4,
    borderColor: '#444'
  },
  loginBtn: {
    textAlignVertical: 'center',
    backgroundColor: '#3281DD',
    borderColor: '#3281DD',
    borderRadius: 4,
    height: 50,
    marginTop: 30,
    padding: 10,
    color: '#FFF',
    flex: 1
  },
  validCodeBtn: {
    width: 120,
    marginLeft: 10,
    height: 50,
    backgroundColor: '#3281DD',
    borderRadius: 4,
    borderColor: '#3281DD',
    textAlignVertical: 'center',
    color: '#FFF'
  },
  btnDisabled: {
    backgroundColor: '#9DCDFD'
  }
});

class Login extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      validCode: '',
      phoneCountry: '86',
      pending: false,
      validCodeBtnAccessible: true,
      nextBtnAccessible: false,
      maxLength: 11,
      validCodeText: '获取验证码'
    };
  }

  getNavigationBarProps() {
    return {
      title: '登录',
      hideLeftButton: true
    };
  }

  login() {
    //Storage.setItem('user', {name: '张三', age: '18'});
    getNavigator().push({
      name: 'MainContainer'
    });
  }

  getValidCode() {
    dismissKeyboard();
    let second = 5;
    if (this.state.validCodeBtnAccessible == false) {
      return false;
    }
    this.setState({
      validCodeBtnAccessible: false,
      validCodeText: `剩余${second}秒`
    });

    this.timer = setInterval(()=> {
      this.setState({validCodeText: `剩余${second - 1}秒`});
      second -= 1;
      if (second === 0) {
        clearInterval(this.timer);
        this.setState({validCodeBtnAccessible: true});
        this.setState({validCodeText: '获取验证码'});
      }
    }, 1000)
  }

  componentWillUnmount() {
    this.timer && clearInterval(this.timer);
  }

  renderValidCodeBtn(phone) {
    this.setState({
      ...phone,
      validCodeBtnAccessible: '86' == this.state.phoneCountry ? 11 === phone.phone.length : 9 === phone.phone.length
    });
  }

  renderCountry(phoneCountry) {
    this.setState({
      maxLength: '86' == phoneCountry ? 11 : 9,
      phone: '',
      validCode: '',
      phoneCountry: phoneCountry,
      validCodeBtnAccessible: false
    });
  }

  renderTips() {
    return (
      <View style={styles.tipsArea}>
        <Text style={styles.tips}>{'使用手机号一键登录'}</Text>
      </View>
    )
  }

  renderPicker() {
    if (Platform.OS === 'ios') {
      return (
        <View>
          {this.renderPickerIOS()}
        </View>
      )
    } else {
      return (
        <View
          style={styles.pickerView}>
          <Picker
            style={styles.picker}
            selectedValue={this.state.phoneCountry}
            onValueChange={(phoneCountry) => this.renderCountry(phoneCountry)}>
            <Picker.Item label="+86" value="86"/>
            <Picker.Item label="+64" value="64"/>
            <Picker.Item label="+61" value="61"/>
          </Picker>
        </View>
      )
    }
  }

  renderPickerIOS() {
    return (
      <Menu
        style={[styles.pickerMenu, styles.pickerMenu]}
        onSelect={(value) => {
          this.renderCountry(value + '')
        }}>
        <MenuTrigger>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>{'+'}{this.state.phoneCountry}</Text>
            <Icon name="angle-down" size={16} style={{marginRight: 10}}/>
          </View>
        </MenuTrigger>
        <MenuOptions
          optionsContainerStyle={{width: 60}}>
          <MenuOption value={86} text='+86'/>
          <MenuOption value={64} text="+64"/>
          <MenuOption value={61} text="+61"/>
        </MenuOptions>
      </Menu>
    )
  }

  renderForm() {
    return (
      <View style={styles.loginForm}>
        <View style={styles.inputItem}>
          {this.renderPicker()}
          <TextInput
            style={styles.input}
            keyboardType={'numeric'}
            underlineColorAndroid={'transparent'}
            placeholder={'请输入手机号'}
            maxLength={this.state.maxLength}
            onChangeText={(phone) => this.renderValidCodeBtn({phone})}
            value={this.state.phone}
            returnKeyType={'done'}
          />
        </View>
        <View style={styles.inputItem}>
          <TextInput
            multiline={false}
            keyboardType={'numeric'}
            style={styles.input}
            underlineColorAndroid={'transparent'}
            placeholder={'请输入验证码'}
            returnKeyType={'done'}
            onChangeText={(validCode)=>this.setState({validCode})}
            value={this.state.validCode}/>
          <Button
            style={styles.validCodeBtn}
            onPress={()=> {
              this.getValidCode()
            }}
            styleDisabled={[styles.validCodeBtn, styles.btnDisabled]}
            disabled={!this.state.validCodeBtnAccessible}>
            {this.state.validCodeText}
          </Button>
        </View>
      </View>
    )
  }

  renderBody() {
    return (
      <MenuContext style={{flex: 1}}>
        <View style={styles.loginPage}>
          {this.renderTips()}
          {this.renderForm()}
          <Button
            style={styles.loginBtn}
            onPress={()=> {
              this.login()
            }}>
            登录
          </Button>
        </View>
      </MenuContext>
    )
  }
}

export default Login
