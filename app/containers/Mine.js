/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 09:54
 * @description
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  InteractionManager,
  Image,
  TouchableOpacity,
  DeviceEventEmitter,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  Platform
} from 'react-native'
import BaseComponent from '../base/BaseComponent'
import Icon from 'react-native-vector-icons/FontAwesome'
import {URL_DEV} from '../constants/Constant'
import Spinner from '../components/Spinner'
import EditPersonalSignature from '../pages/EditPersonalSignature'
import UserInfo from '../pages/UserInfo'
import {connect} from 'react-redux'
import * as HomeActions from '../actions/Home'
import tmpGlobal from '../utils/TmpVairables'
import Settings from '../pages/Settings'
import * as Storage from '../utils/Storage'
import {ComponentStyles, CommonStyles, StyleConfig} from '../style'
import pxToDp from '../utils/PxToDp'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  avatarArea: {
    alignItems: 'center',
    paddingBottom: 10,
    ...Platform.select({
      ios: {
        height: pxToDp(500) - 64
      },
      android: {
        height: pxToDp(500) - 54
      }
    }),
  },
  userAvatar: {
    height: pxToDp(182),
    width: pxToDp(182),
    borderRadius: pxToDp(40),
    marginBottom: 20
  },
  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: pxToDp(20)
  },
  ageText: {
    color: '#fff',
    fontSize: pxToDp(28),
    marginLeft: pxToDp(20)
  },
  signatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: pxToDp(10),
    paddingHorizontal: pxToDp(60)
  },
  signatureText: {
    color: '#fff',
    fontSize: pxToDp(32),
    marginRight: pxToDp(20),
    flexWrap: 'nowrap',
    overflow: 'hidden',
    paddingBottom: pxToDp(8)
  },
  avatarText: {
    color: '#fff',
    marginHorizontal: 5
  },
  userAvatarLabel: {
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    paddingVertical: 0.5,
    flex: 1
  },
  signatureItem: {
    paddingVertical: 10
  },

  touchableItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: pxToDp(100),
    marginBottom: pxToDp(10),
    borderBottomColor: '#cecece',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  itemRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    fontSize: pxToDp(32)
  },
  listItemIcon: {
    width: 50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listItemLeft: {
    flex: 1,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

let navigator;

class Mine extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.isOpen,
      pending: false,
      loadUserInfo: true,
      myLocation: tmpGlobal.currentLocation,
      ...tmpGlobal.currentUser
    };
    navigator = this.props.navigator;
  }

  getNavigationBarProps() {
    return {
      title: `${tmpGlobal.currentUser.Nickname}`,
      hideLeftButton: true
    };
  }

  onLeftPressed() {
    this.props.menuChange(true);
  }

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener('photoChanged', ()=> {
      this._getCurrentUserInfo()
    });
    this.userProfileListener = DeviceEventEmitter.addListener('userInfoChanged', ()=> {
      this._getCurrentUserInfo()
    });
    this.signatureListener = DeviceEventEmitter.addListener('signatureChanged', (data)=> {
      this._updateSignature(data)
    });

  }

  componentWillUnmount() {
    this.subscription.remove();
    this.signatureListener.remove();
    this.userProfileListener.remove();
  }

  _getCurrentUserInfo() {
    this.setState({pending: true});
    const {dispatch}=this.props;
    dispatch(HomeActions.getCurrentUserProfile('', (json)=> {
      tmpGlobal.currentUser = json.Result;
      this.setState({
        ...json.Result,
        pending: false,
        myLocation: tmpGlobal.currentLocation,
        loadUserInfo: true,
      });
      Storage.setItem('userInfo', json.Result);
    }, (error)=> {
    }));
  }

  //编辑签名
  _editSignature(data) {
    navigator.push({
      component: EditPersonalSignature,
      name: 'EditPersonalSignature',
      params: {
        personalSignature: data
      },
    });
  }

  //刷新签名
  _updateSignature(data) {
    tmpGlobal.currentUser.PersonSignal = data.data;
    this.setState({
      PersonSignal: data.data
    });
    Storage.setItem('userInfo', tmpGlobal.currentUser);
  }

  //前往查看我的详细资料(需要先获取我的相册)
  _editMyDetail(data) {
    navigator.push({
      component: UserInfo,
      name: 'UserInfo',
      params: {
        Nickname: data.Nickname,
        UserId: data.UserId,
        isSelf: true
      }
    });
  }

  //前往设置页
  _goSettings() {
    navigator.push({
      component: Settings,
      name: 'Settings'
    })
  }

  _renderLocation(data) {
    if (data !== null) {
      return (
        <Text style={styles.avatarText}>{data}</Text>
      )
    } else {
      return null;
    }
  }

  _renderGenderStyle(gender) {
    return {
      backgroundColor: gender ? '#1496ea' : 'pink',
      borderColor: gender ? '#1496ea' : 'pink',
    }
  }

  renderGender() {
    return (
      <View style={styles.genderRow}>
        <Icon
          color={this.state.Gender ? '#1496ea' : 'pink'}
          name={this.state.Gender ? 'mars-stroke' : 'venus'}
          size={pxToDp(40)}/>
        <Text style={styles.ageText}>{'年龄:'}{this.state.Age}</Text>
      </View>
    )
  }

  renderSignatureContainer() {
    return (
      <TouchableHighlight
        onPress={()=> {
          this._editSignature(this.state.PersonSignal)
        }}
        underlayColor={'rgba(141,226,145,0.5)'}>
        <View style={styles.signatureContainer}>
          <Text
            style={styles.signatureText}>{this.state.PersonSignal ? this.state.PersonSignal : '请点击右侧按钮编辑你的个性签名'}</Text>
          <Icon name={'edit'} size={pxToDp(40)} color={'#fff'}/>
        </View>
      </TouchableHighlight>
    )
  }

  renderBody() {
    if (this.state.loadUserInfo) {
      return (
        <View style={ComponentStyles.container}>
          <ScrollView>
            <View style={[styles.avatarArea, CommonStyles.background_primary]}>
              <Image
                style={styles.userAvatar}
                source={{uri: URL_DEV + this.state.PhotoUrl}}/>
              {this.renderGender()}
              {this.renderSignatureContainer()}
            </View>
            <TouchableHighlight
              onPress={()=> {
                this._editMyDetail(this.state)
              }}
              underlayColor={'#b8b8bf'}
              style={styles.touchableItem}>
              <View style={styles.itemRow}>
                <View style={styles.listItemLeft}>
                  <View style={styles.iconBox}>
                    <Icon
                      name={'list-alt'}
                      size={pxToDp(36)}
                      color={StyleConfig.color_primary}/>
                  </View>
                  <Text style={styles.itemText}>{'详细资料'}</Text>
                </View>
                <View style={styles.listItemIcon}>
                  <Icon
                    name={'angle-right'}
                    size={pxToDp(40)}
                    color={'#b4b4b4'}/>
                </View>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={()=> {
                this._goSettings()
              }}
              underlayColor={'#b8b8bf'}
              style={styles.touchableItem}>
              <View style={styles.itemRow}>
                <View style={styles.listItemLeft}>
                  <View style={styles.iconBox}>
                    <Icon
                      name={'gear'}
                      size={pxToDp(36)}
                      color={StyleConfig.color_primary}/>
                  </View>
                  <Text style={styles.itemText}>{'设置'}</Text>
                </View>
                <View style={styles.listItemIcon}>
                  <Icon
                    name={'angle-right'}
                    size={pxToDp(40)}
                    color={'#b4b4b4'}/>
                </View>
              </View>
            </TouchableHighlight>
          </ScrollView>
        </View>
      )
    } else {
      return null
    }
  }

  renderSpinner() {
    if (this.state.pending) {
      return (
        <Spinner animating={this.state.pending}/>
      )
    }
  }
}

export default connect((state)=> {
  return {
    ...state
  }
})(Mine)