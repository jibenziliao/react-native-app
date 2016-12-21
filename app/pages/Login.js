/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 17:09
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Picker,
  PickerIOS,
  Platform,
  TouchableHighlight,
  Animated,
  Keyboard
} from 'react-native'
import * as Storage from '../utils/Storage'
import BaseComponent from '../base/BaseComponent'
import MainContainer from '../containers/MainContainer'
import {connect} from 'react-redux'
import DeviceInfo from 'react-native-device-info'
import * as InitialAppActions from '../actions/InitialApp'
import * as LoginActions from '../actions/Login'
import UserProfile from './UserProfile'
import BackgroundTimer from 'react-native-background-timer'
import {Button as NBButton} from 'native-base'
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'
import Icon from 'react-native-vector-icons/FontAwesome'
import {setDictArr} from '../utils/Dict'

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
  picker: {
    width: 100,
    height: 40
  },
  pickerView: {
    backgroundColor: '#DADADA',
    marginRight: 10,
    paddingLeft: 10,
    borderRadius: 4,
    height: 40
  },
  inputItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
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
    borderColor: '#444',
    height: 40
  }
});

let navigator;

class Login extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      validCode: '',
      phoneCountry: '86',
      pending: false,
      validCodeBtnAccessible: false,
      maxLength: 11,
      validCodeText: '获取验证码',
      tipsText: '使用手机号一键登录',
      hasSendCode:false
    };
    navigator = this.props.navigator;
    this.login = this.login.bind(this);
  }

  componentWillMount() {
    let systemType = DeviceInfo.getSystemName();
    if (systemType && systemType == 'iPhone OS') {
      systemType = 'iOS';
    } else {
      systemType = 'Android';
    }

    const data = {
      DeviceType: systemType,
      DeviceVersion: DeviceInfo.getSystemVersion() || '1.0.0',
      DeviceInfo: DeviceInfo.getDeviceName() || 'NX507J'
    };

    const {dispatch}= this.props;
    Storage.getItem('hasInit').then((response)=> {
      if (!response) {
        dispatch(InitialAppActions.initDevice(data, (json)=> {
          Storage.setItem('hasInit', true);
        }, (json)=> {
          //不需要做特殊处理
        }));
      }
    });
  }

  getNavigationBarProps() {
    return {
      title: '登录',
      hideLeftButton: true
    };
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

  login(data) {
    Keyboard.dismiss();
    const {dispatch} = this.props;
    dispatch(LoginActions.validSmsCode(data,
      (json)=> {
        this.loginSuccess(json)
      },
      (error)=> {
        //不需要做特殊处理
      }
    ));
  }

  loginSuccess(json) {
    this.setState({
      hasSendCode:false,
    });
    if (json.Result.IsFullyRegistered === false) {
      navigator.push({
        component: UserProfile,
        name: 'UserProfile'
      });
    } else {
      //如果新装APP登录老账号,这里默认用户已注册,以便下次打开APP时,直接进入首页
      Storage.setItem('hasRegistered',true);
      navigator.resetTo({
        component: MainContainer,
        name: 'MainContainer'
      });
    }
  }

  getValidCode(phoneCountry, phone) {
    Keyboard.dismiss();
    const data = {
      Country: phoneCountry,
      Mobile: phone
    };
    const {dispatch} = this.props;
    dispatch(LoginActions.getSmsCode(data, (json)=> {
      this.initDict();
      this._startCountdown();
    }, (error)=> {
      //不做特殊处理
    }));
  }

  //初始化字典
  initDict() {
    const {dispatch} = this.props;
    dispatch(LoginActions.getDict(null, (json)=> {
      setDictArr(json.Result);
    }, (error)=> {
      //
    }));
  }

  _startCountdown(){
    let second = 10;
    let phone = this.state.phone;
    let phoneCountry = this.state.phoneCountry;
    this.setState({
      hasSendCode:true,
      validCodeBtnAccessible: false,
      validCodeText: `剩余${second}秒`,
      tipsText: `我们已经给你的手机号码+${phoneCountry}-${phone}发送了一条验证短息`
    });
    this.timer = BackgroundTimer.setInterval(()=> {
      this.setState({validCodeText: `剩余${second - 1}秒`});
      second -= 1;
      if (second === 0) {
        BackgroundTimer.clearInterval(this.timer);
        this.setState({
          validCodeBtnAccessible: true,
          validCodeText: '获取验证码',
          tipsText: '使用手机号一键登录',
        });
      }
    }, 1000);
  }

  componentWillUnmount() {
    BackgroundTimer.clearInterval(this.timer);
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
      tipsText: '使用手机号一键登录',
    });
  }

  renderTips() {
    return (
      <View style={styles.tipsArea}>
        <Text style={styles.tips}>{this.state.tipsText}</Text>
      </View>
    )
  }

  renderPicker() {
    if (Platform.OS === 'ios') {
      return (
        <View style={{width: 80, height: 40, backgroundColor: '#DADADA', marginRight: 20, borderRadius: 4}}>
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
            onValueChange={
              (phoneCountry) => this.renderCountry(phoneCountry)
            }>
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
        onSelect={(value) => {
          this.renderCountry(value + '')
        }}>
        <MenuTrigger>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 40,
            alignItems: 'center',
            paddingHorizontal: 10
          }}>
            <Text>{'+'}{this.state.phoneCountry}</Text>
            <Icon name="angle-down" size={16} style={{marginRight: 10}}/>
          </View>
        </MenuTrigger>
        <MenuOptions
          optionsContainerStyle={{width: 80}}>
          <MenuOption value={86} text='+86'/>
          <MenuOption value={64} text="+64"/>
          <MenuOption value={61} text="+61"/>
        </MenuOptions>
      </Menu>
    )
  }

  _renderLoginBtnStatus() {
    return !(this.state.hasSendCode && this.state.validCode.length === 6);
  }

  renderBody() {
    return (
      <MenuContext style={{flex: 1}}>
        <ScrollView style={styles.loginPage}
                    keyboardDismissMode={'interactive'}
                    keyboardShouldPersistTaps={true}>
          {this.renderTips()}
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
              maxLength={6}
              returnKeyType={'done'}
              onChangeText={(validCode)=>this.setState({validCode})}
              value={this.state.validCode}/>
            <NBButton
              block
              style={{height: 40, marginLeft: 20, width: 120}}
              onPress={()=> {
                this.getValidCode(this.state.phoneCountry, this.state.phone)
              }}
              disabled={!this.state.validCodeBtnAccessible}>
              {this.state.validCodeText}
            </NBButton>
          </View>
          <NBButton
            block
            style={{marginTop: 20, height: 40, alignItems: 'center'}}
            onPress={()=>this.login(this.state.validCode)}
            disabled={this._renderLoginBtnStatus()}>
            登录
          </NBButton>
        </ScrollView>
      </MenuContext>
    )
  }
}

export default connect((state)=> {
  return {
    ...state
  }
})(Login)
