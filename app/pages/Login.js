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
  findNodeHandle,
  AppState
} from 'react-native'
import * as Storage from '../utils/Storage'
import BaseComponent from '../base/BaseComponent'
import MainContainer from '../containers/MainContainer'
import {connect} from 'react-redux'
import DeviceInfo from 'react-native-device-info'
import * as InitialAppActions from '../actions/InitialApp'
import * as LoginActions from '../actions/Login'
import UserProfile from './UserProfile'
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
import customTheme from '../themes/MyThemes'
import pxToDp from '../utils/PxToDp'
import {ComponentStyles, CommonStyles} from '../style'

const styles = StyleSheet.create({
  picker: {
    width: pxToDp(240),
    height: pxToDp(80),
    backgroundColor: '#DADADA',
  },
  mRightRadius: {
    marginRight: pxToDp(40),
    borderRadius: pxToDp(8)
  },
  inputHeight: {
    height: pxToDp(80)
  },
  pickerView: {
    backgroundColor: '#DADADA',
    marginRight: pxToDp(20),
    paddingLeft: pxToDp(20),
    borderRadius: pxToDp(8),
    height: pxToDp(80)
  },
  menuTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: pxToDp(20),
    width: pxToDp(240)
  },
  menuIcon: {
    marginRight: pxToDp(20)
  },
  menuOptions: {
    width: pxToDp(240)
  },
  inputItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pxToDp(40)
  },
  label: {
    width: pxToDp(120)
  },
  input: {
    backgroundColor: '#DADADA',
    flex: 1,
    paddingLeft: pxToDp(20),
    borderRadius: pxToDp(8),
    borderColor: '#444',
  },
  validCodeBtn: {
    marginLeft: pxToDp(40),
  },
  loginBtn: {
    marginTop: pxToDp(80),
  },
});

let navigator;

let refTarget = 'validCode';

let ancestorTarget;

let moveY;

let tmpDate;

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
      hasSendCode: false,
    };
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
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
    Storage.getItem('hasInit').then((response) => {
      if (!response) {
        dispatch(InitialAppActions.initDevice(data, (json) => {
          Storage.setItem('hasInit', true);
        }, (json) => {
          //不需要做特殊处理
        }));
      }
    });
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange(appState) {
    if (tmpDate && appState === 'active') {
      clearInterval(this.backgroundTimer);
      this._startCountdown();
    }
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
      (json) => {
        this.loginSuccess(json);
      },
      (error) => {
        //不需要做特殊处理
      }
    ));
  }

  loginSuccess(json) {

    tmpGlobal.currentUser = json.Result;
    console.log('登录成功后,保存用户信息到全局变量', tmpGlobal.currentUser);

    let saveUserInfo = async() => {
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
          //这里用resetTo进入首页后,安卓物理返回键监听会失效,用replace代替
          navigator.replace({
            component: MainContainer,
            name: 'MainContainer'
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    this.setState({
      hasSendCode: false,
    }, () => {
      saveUserInfo();
    });
  }

  getValidCode(phoneCountry, phone) {
    Keyboard.dismiss();
    this.setState({
      validCode: ''
    });
    this.showToastTimer = setTimeout(() => {
      if (this._validPhoneNumber(phoneCountry, phone)) {
        const data = {
          Country: phoneCountry,
          Mobile: this._handleSubmitPhone(phoneCountry, phone)
        };
        const {dispatch} = this.props;
        dispatch(LoginActions.getSmsCode(data, (json) => {
          this.initDict();
        }, (error) => {
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
    dispatch(LoginActions.getDict('', (json) => {
      setDictArr(json.Result);
      tmpDate = new Date();
      tmpDate.setMinutes(tmpDate.getMinutes() + 2);
      this._startCountdown()
    }, (error) => {
      //
    }));
  }

  _startCountdown() {
    let phone = this.state.phone;
    let phoneCountry = this.state.phoneCountry;
    let lastSecond = Math.round((tmpDate.getTime() - new Date().getTime()) / 1000);

    this.setState({
      counting: true,
      hasSendCode: true,
      validCodeBtnAccessible: false,
      validCodeText: `剩余${lastSecond}秒`,
      tipsText: `我们已经给你的手机号码+${phoneCountry}-${this._handleSubmitPhone(phoneCountry, phone)}发送了一条验证短信`
    }, () => {
      this.backgroundTimer = setInterval(() => {
        //console.log('开始倒计时');
        lastSecond = Math.round((tmpDate.getTime() - new Date().getTime()) / 1000);
        this.setState({validCodeText: `剩余${lastSecond}秒`});
        if (lastSecond <= 0) {
          tmpDate = null;
          clearInterval(this.backgroundTimer);
          this.setState({
            counting: false,
            validCodeBtnAccessible: true,
            validCodeText: '获取验证码',
            tipsText: '使用手机号一键登录',
          });
        }
      }, 1000);
    });
  }

  componentWillUnmount() {
    //console.log('页面即将销毁');
    if (this.showToastTimer) {
      clearTimeout(this.showToastTimer);
    }
    if (this.backgroundTimer) {
      clearInterval(this.backgroundTimer);
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
      this.refs[refTarget].measureLayout(findNodeHandle(this.refs['root']), (x, y, width, height) => {
        //console.log(x, y, width, height);
        //height为input框高度,64为iOS导航栏高度
        moveY = e.startCoordinates.height - (e.startCoordinates.screenY - y) + height + 64;
        //console.log(moveY, e, y);
        if (moveY > 0) {
          this.refs.scroll.scrollTo({y: moveY, x: 0, animated: true});
        }
      }, (error) => {
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
      <View style={[CommonStyles.flexRow, CommonStyles.m_y_20]}>
        <Text style={[CommonStyles.text_center, CommonStyles.font_lg, CommonStyles.flex_1]}>{this.state.tipsText}</Text>
      </View>
    )
  }

  renderPicker() {
    return (
      <View style={[styles.picker, styles.mRightRadius, styles.inputHeight]}>
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
          <View style={[styles.menuTrigger, styles.inputHeight]}>
            <Text>{this._renderCountry() + '+'}{this.state.phoneCountry}</Text>
            <Icon name="angle-down" size={pxToDp(32)} style={styles.menuIcon}/>
          </View>
        </MenuTrigger>
        <MenuOptions
          optionsContainerStyle={styles.menuOptions}>
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
        style={CommonStyles.flex_1}>
        <ScrollView
          ref={'scroll'}
          style={[CommonStyles.p_a_10, CommonStyles.flex_1, CommonStyles.background_second]}
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={true}>
          <View
            style={CommonStyles.flex_1}
            onStartShouldSetResponderCapture={(e) => {
              ancestorTarget = e.nativeEvent.target;
              if (ancestorTarget !== findNodeHandle(this.refs[refTarget])) {
                this.refs[refTarget].blur();
              }
            }}>
            {this.renderTips()}
            <View style={[styles.inputItem, styles.inputHeight]}>
              {this.renderPicker()}
              <TextInput
                style={[styles.input, styles.inputHeight]}
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
                style={[styles.input, styles.inputHeight]}
                underlineColorAndroid={'transparent'}
                placeholder={'请输入验证码'}
                maxLength={6}
                ref={'validCode'}
                onFocus={() => {
                  refTarget = 'validCode'
                }}
                onBlur={() => {
                  this.refs.scroll.scrollTo({y: 0, x: 0, animated: true})
                }}
                returnKeyType={'done'}
                onChangeText={(validCode) => this.setState({validCode})}
                value={this.state.validCode}/>
              <NBButton
                theme={customTheme}
                block
                textStyle={ComponentStyles.btnText}
                style={[styles.validCodeBtn, styles.inputHeight, styles.menuOptions]}
                onPress={() => {
                  this.getValidCode(this.state.phoneCountry, this.state.phone)
                }}
                disabled={!this.state.validCodeBtnAccessible}>
                {this.state.validCodeText}
              </NBButton>
            </View>
            <NBButton
              theme={customTheme}
              block
              textStyle={ComponentStyles.btnText}
              style={[styles.loginBtn, styles.inputHeight]}
              onPress={() => this.login(this.state.validCode)}
              disabled={this._renderLoginBtnStatus()}>
              登录
            </NBButton>
          </View>
        </ScrollView>
      </MenuContext>
    )
  }
}

export default connect((state) => {
  return {
    ...state
  }
})(Login)
