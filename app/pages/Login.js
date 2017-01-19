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
  Keyboard,
  findNodeHandle
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
import tmpGlobal from '../utils/TmpVairables'
import {toastShort} from '../utils/ToastUtil'

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

let refTarget = 'validCode';

let ancestorTarget;

let moveY;

let second = 10;

class Login extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      counting: false,
      validCode: '',
      phoneCountry: '86',
      pending: false,
      validCodeBtnAccessible: false,
      maxLength: 11,
      validCodeText: '获取验证码',
      tipsText: '使用手机号一键登录',
      hasSendCode: false
    };
    navigator = this.props.navigator;
    this.login = this.login.bind(this);
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
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

  _validPhoneNumber(phoneCountry, phone) {
    if (phoneCountry === '61') {
      if (phone.indexOf('0') === 0) {
        let tmpPhone = phone.substring(1);
        if (tmpPhone.indexOf('4') !== 0) {
          toastShort('澳洲地区手机号为+61-4开头,请检查您的手机号');
          return false;
        }
      } else if (phone.indexOf('4') !== 0) {
        toastShort('澳洲地区手机号为+61-4开头,请检查您的手机号');
        return false;
      }
      return true;
    } else if (phoneCountry === '64') {
      if (phone.indexOf('0') === 0) {
        let tmpPhone = phone.substring(1);
        if (tmpPhone.indexOf('2') !== 0) {
          toastShort('新西兰手机号为+64-2开头,请检查您的手机号');
          return false;
        }
      } else if (phone.indexOf('2') !== 0) {
        toastShort('新西兰手机号为+64-2开头,请检查您的手机号');
        return false;
      }
      return true;
    } else {
      if (phone.indexOf('1') !== 0) {
        toastShort('中国手机号为+86-1开头,请检查您的手机号');
        return false;
      }
      return true;
    }
  }

  login(data) {
    Keyboard.dismiss();
    const {dispatch} = this.props;
    dispatch(LoginActions.validSmsCode(data,
      (json)=> {
        this.loginSuccess(json);
      },
      (error)=> {
        //不需要做特殊处理
      }
    ));
  }

  loginSuccess(json) {
    this.setState({
      hasSendCode: false,
    });
    tmpGlobal.currentUser = json.Result;
    console.log('登录成功后,保存用户信息到全局变量', tmpGlobal.currentUser);

    let saveUserInfo = async()=> {
      try {
        await Storage.setItem('userInfo', json.Result);
        if (json.Result.IsFullyRegistered === false) {
          navigator.push({
            component: UserProfile,
            name: 'UserProfile'
          });
        } else {
          //如果新装APP登录老账号,这里默认用户已注册,以便下次打开APP时,直接进入首页
          Storage.setItem('hasRegistered', true);
          navigator.resetTo({
            component: MainContainer,
            name: 'MainContainer'
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    saveUserInfo();
  }

  getValidCode(phoneCountry, phone) {
    Keyboard.dismiss();
    this.setState({
      validCode:''
    });
    this.showToastTimer = setTimeout(()=> {
      if (this._validPhoneNumber(phoneCountry, phone)) {
        const data = {
          Country: phoneCountry,
          Mobile: this._handleSubmitPhone(phoneCountry, phone)
        };
        const {dispatch} = this.props;
        dispatch(LoginActions.getSmsCode(data, (json)=> {
          this.initDict();
          this._startCountdown();
        }, (error)=> {
          //不做特殊处理
        }));
      }
    }, 300);
  }

  //如果是02或者04开头,则替换成2或者4开头,再提交后台。
  _handleSubmitPhone(phoneCountry, phone) {
    if (phoneCountry === '61') {
      if (phone.indexOf('0') === 0) {
        return phone.substring(1);
      } else if (phone.indexOf('4') === 0) {
        return phone;
      }
    } else if (phoneCountry === '64') {
      if (phone.indexOf('0') === 0) {
        return phone.substring(1);
      } else if (phone.indexOf('2') === 0) {
        return phone;
      }
    } else {
      return phone;
    }
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

  _startCountdown() {
    let second = 10;
    let phone = this.state.phone;
    let phoneCountry = this.state.phoneCountry;
    this.setState({
      counting: true,
      hasSendCode: true,
      validCodeBtnAccessible: false,
      validCodeText: `剩余${second}秒`,
      tipsText: `我们已经给你的手机号码+${phoneCountry}-${this._handleSubmitPhone(phoneCountry, phone)}发送了一条验证短信`
    });
    this.timer = BackgroundTimer.setInterval(()=> {
      this.setState({validCodeText: `剩余${second - 1}秒`});
      second -= 1;
      if (second === 0) {
        BackgroundTimer.clearInterval(this.timer);
        this.setState({
          counting: false,
          validCodeBtnAccessible: true,
          validCodeText: '获取验证码',
          tipsText: '使用手机号一键登录',
        });
      }
    }, 1000);
  }

  componentWillUnmount() {
    if (this.showToastTimer) {
      clearTimeout(this.showToastTimer);
    }
    if (this.timer) {
      BackgroundTimer.clearInterval(this.timer);
    }
    this.keyboardDidShowListener.remove();
  }

  //当键盘弹起来
  _keyboardDidShow(e) {
    this._inputMeasure(e);
  }

  _inputMeasure(e) {
    moveY = 0;
    if (Platform.OS === 'ios') {
      this.refs[refTarget].measureLayout(findNodeHandle(this.refs['root']), (x, y, width, height)=> {
        //console.log(x, y, width, height);
        //height为input框高度,64为iOS导航栏高度
        moveY = e.startCoordinates.height - (e.startCoordinates.screenY - y) + height + 64;
        //console.log(moveY, e, y);
        if (moveY > 0) {
          this.refs.scroll.scrollTo({y: moveY, x: 0, animated: true});
        }
      }, (error)=> {
        console.log(error);
      });
    }
  }

  renderValidCodeBtn(phone) {
    this.setState({
      ...phone,
      validCodeBtnAccessible: this._validCodeBtnHandler(phone)
    });
  }

  _validCodeBtnHandler(phone) {
    if (this.state.phoneCountry === '86' && !this.state.counting) {
      return 11 <= phone.phone.length;
    } else if (this.state.phoneCountry === '64' && !this.state.counting) {
      if (phone.phone.indexOf('0') === 0) {
        this.setState({
          maxLength: 10
        });
        return 9 <= phone.phone.length
      }
      this.setState({
        maxLength: 9
      });
      return 8 <= phone.phone.length
    } else if (this.state.phoneCountry === '61' && !this.state.counting) {
      if (phone.phone.indexOf('0') === 0) {
        this.setState({
          maxLength: 10
        });
        return 10 <= phone.phone.length
      }
      this.setState({
        maxLength: 9
      });
      return 9 <= phone.phone.length
    } else {
      return false;
    }
  }

  renderCountry(phoneCountry) {
    this.setState({
      maxLength: '86' == phoneCountry ? 11 : 10,
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
    return (
      <View style={{width: 120, height: 40, backgroundColor: '#DADADA', marginRight: 20, borderRadius: 4}}>
        {this.renderPickerIOS()}
      </View>
    )
  }

  _renderCountry() {
    if (this.state.phoneCountry === '86') {
      return '(中国)'
    } else if (this.state.phoneCountry === '61') {
      return '(澳洲)'
    } else {
      return '(新西兰)'
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
            paddingHorizontal: 10,
            width: 120
          }}>
            <Text>{this._renderCountry() + '+'}{this.state.phoneCountry}</Text>
            <Icon name="angle-down" size={16} style={{marginRight: 10}}/>
          </View>
        </MenuTrigger>
        <MenuOptions
          optionsContainerStyle={{width: 120}}>
          <MenuOption value={86} text='(中国)+86'/>
          <MenuOption value={64} text="(新西兰)+64"/>
          <MenuOption value={61} text="(澳洲)+61"/>
        </MenuOptions>
      </Menu>
    )
  }

  _renderLoginBtnStatus() {
    return !(this.state.hasSendCode && this.state.validCode.length === 6);
  }

  renderBody() {
    return (
      <MenuContext
        ref={'root'}
        style={{flex: 1}}>
        <ScrollView
          ref={'scroll'}
          style={styles.loginPage}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={true}>
          <View
            style={{flex: 1}}
            onStartShouldSetResponderCapture={(e) => {
              ancestorTarget = e.nativeEvent.target;
              if (ancestorTarget !== findNodeHandle(this.refs[refTarget])) {
                this.refs[refTarget].blur();
              }
            }}>
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
                ref={'validCode'}
                onFocus={()=> {
                  refTarget = 'validCode'
                }}
                onBlur={()=> {
                  this.refs.scroll.scrollTo({y: 0, x: 0, animated: true})
                }}
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
          </View>
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
