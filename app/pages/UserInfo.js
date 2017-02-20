/**
 * 查看用户详情
 * @author keyy/1501718947@qq.com 16/12/1 15:03
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  DeviceEventEmitter,
  Platform,
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import {URL_DEV} from '../constants/Constant'
import * as HomeActions from '../actions/Home'
import {Button as NBButton, Icon as NBIcon} from 'native-base'
import AnnouncementList from '../pages/AnnouncemenetList'
import Icon from 'react-native-vector-icons/FontAwesome'
import IonIcon from 'react-native-vector-icons/Ionicons'
import EditPersonalSignature from '../pages/EditPersonalSignature'
import EditUserProfile from '../pages/EditUserProfile'
import EditFriendFilter from '../pages/EditFriendFilter'
import EditPhotos from '../pages/EditPhotos'
import MessageDetail from '../pages/MessageDetail'
import tmpGlobal from '../utils/TmpVairables'
import ModalBox from 'react-native-modalbox'
import PhotoScaleViewer from '../components/PhotoScaleViewer'
import {ComponentStyles,CommonStyles} from '../style'
import pxToDp from '../utils/PxToDp'

const {width, height}=Dimensions.get('window');

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    paddingHorizontal: pxToDp(20)
  },
  photoContainer: {
    flexDirection: 'row',
    marginTop: pxToDp(20)
  },
  photos: {
    width: pxToDp(210),
    height: pxToDp(210),
    marginRight: pxToDp(20)
  },
  userAvatar: {
    height: pxToDp(80),
    width: pxToDp(80),
    marginRight: pxToDp(20),
    borderRadius: pxToDp(8)
  },
  userInfoItem: {
    flexDirection: 'row',
    paddingVertical: pxToDp(10)
  },
  itemLeft: {
    width: pxToDp(200)
  },
  itemRight: {
    flex: 1
  },
  bottomBtnGroup: {
    flexDirection: 'row',
    width: width
  },
  bottomBtn: {
    flex: 1,
    height: pxToDp(80),
    borderRadius: 0
  },
  attention: {
    backgroundColor: '#FF9933'
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: pxToDp(8),
    padding: pxToDp(20),
    marginTop: pxToDp(20)
  },
  sectionTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#cec5c5',
    paddingBottom: pxToDp(20)
  },
  sectionTitleText: {
    fontSize: pxToDp(32)
  },
  sectionContent: {
    marginTop: pxToDp(20)
  },
  bottomSection: {
    marginBottom: pxToDp(20)
  },
  announcementCard: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  editIconBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  editText: {
    marginLeft: pxToDp(10)
  },
  textBtnContainer: {
    paddingVertical: pxToDp(10),
    paddingHorizontal: pxToDp(20)
  },
  textBtn: {
    color: '#4CD472'
  },
  closeBtn: {
    position: 'absolute',
    left: pxToDp(40),
    ...Platform.select({
      ios: {
        top: pxToDp(40)
      },
      android: {
        top: pxToDp(20)
      }
    }),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal:pxToDp(40)
  },
});

let navigator;

class UserInfo extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      ...this.props.route.params,
      showIndex: 0,
      imgList: [],
      imgLoading: true,
      avatarLoading: true,
      loading:true
    };
    navigator = this.props.navigator;
  }

  getNavigationBarProps() {
    return {
      title: this.state.Nickname
    };
  }

  componentWillMount(){
    InteractionManager.runAfterInteractions(()=> {
      this._getUserInfo();
    });
  }

  componentDidMount() {
    this.subscription = DeviceEventEmitter.addListener('photoChanged', ()=> {
      this._getUserInfo()
    });
    this.userProfileListener = DeviceEventEmitter.addListener('userInfoChanged', ()=> {
      this._getUserInfo()
    });
    this.friendFilterListener = DeviceEventEmitter.addListener('friendFilterChanged', ()=> {
      this._getUserInfo()
    });
    this.signatureListener = DeviceEventEmitter.addListener('signatureChanged', (data)=> {
      this._updateSignature(data)
    });
    this._attentionListener = DeviceEventEmitter.addListener('hasAttention', ()=> {
      this._getUserInfo()
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
    this.userProfileListener.remove();
    this.friendFilterListener.remove();
    this.signatureListener.remove();
    this._attentionListener.remove();
  }

  _getUserInfo() {
    const {dispatch}=this.props;
    let params = {
      UserId: this.state.UserId,
      ...tmpGlobal.currentLocation
    };
    dispatch(HomeActions.getUserInfo(params, (json)=> {
      dispatch(HomeActions.getUserPhotos({UserId: this.state.UserId}, (result)=> {
        this.setState({
          ...json.Result,
          userPhotos: result.Result.PhotoList,
          loading:false
        });
      }, (error)=> {
      }))
    }, (error)=> {
    }));
  }

  //刷新签名
  _updateSignature(data) {
    this.setState({
      PersonSignal: data.data
    })
  }

  //前往指定用户的历史公告
  _goHistoryAnnouncementList() {
    navigator.push({
      component: AnnouncementList,
      name: 'AnnouncementList',
      params: {
        targetUserId: this.state.UserId,
        Nickname: this.state.Nickname
      }
    });
  }

  //与TA聊天
  _chatWithUser() {
    navigator.push({
      component: MessageDetail,
      name: 'MessageDetail',
      params: {
        UserId: this.state.UserId,
        Nickname: this.state.Nickname,
        UserAvatar: this.state.PrimaryPhotoFilename
      }
    })
  }

  //关注/取消关注
  _attention(id) {
    const {dispatch}=this.props;
    let params = {
      attentionUserId: id
    };
    dispatch(HomeActions.attention(params, (json)=> {
      DeviceEventEmitter.emit('hasAttention', '已关注/取消关注对方');
      //this.setState({AmIFollowedHim: !this.state.AmIFollowedHim});
    }, (error)=> {
    }));
  }

  //渲染用户的相册
  _renderPhotos(arr) {
    if (arr.length > 0) {
      return arr.map((item, index)=> {
        return (
          <TouchableOpacity
            key={index}
            onPress={()=> {
              this._openImgModal(arr,index)
          }}>
          <Image
            onLoadEnd={()=> {
              this.setState({imgLoading: false})
            }}
            style={styles.photos}
            source={{uri: URL_DEV + item.PhotoUrl}}>
            {this.state.imgLoading ?
              <Image
                key={index}
                source={require('./img/imgLoading.gif')}
                style={styles.photos}/> : null}
          </Image>
          </TouchableOpacity>
        )
      })
    } else {
      return (<Text>{this.state.isSelf ? '您' : 'Ta'}{'还没有相册'}</Text>)
    }
  }

  //渲染用户的个人信息
  _renderUserInfo(data) {
    return data.map((item, index)=> {
      return (
        <View
          key={index}
          style={styles.userInfoItem}>
          <Text style={styles.itemLeft}>{item.Key}{':'}</Text>
          <Text style={styles.itemRight}>{item.Value}</Text>
        </View>
      )
    });
  }

  //渲染屏幕下方的操作按钮(如果查看的是自己的用户资料,则不需要对话和关注)
  _renderButtonGroup() {
    if (!this.state.isSelf) {
      return (
        <View style={styles.bottomBtnGroup}>
          <NBButton
            block
            style={[styles.bottomBtn]}
            onPress={()=> {
              this._chatWithUser()
            }}>
            <NBIcon name={'ios-chatbubbles-outline'}/>
            对话
          </NBButton>
          <NBButton
            block
            style={[styles.bottomBtn, styles.attention]}
            onPress={()=> {
              this._attention(this.state.UserId)
            }}>
            <NBIcon name={'ios-heart-outline'}/>
            {this.state.AmIFollowedHim ? '取消关注' : '关注'}
          </NBButton>
        </View>
      )
    } else {
      return null;
    }
  }

  _renderEditLink(linkFn) {
    if (this.state.isSelf) {
      return (
        <TouchableOpacity
          onPress={()=> {
            linkFn()
          }}
          style={styles.editIconBtn}>
          <Icon
            name={'edit'}
            size={pxToDp(40)}/>
          <Text style={styles.editText}>{'编辑'}</Text>
        </TouchableOpacity>
      )
    } else {
      return null;
    }
  }

  _editMyPhotos() {
    navigator.push({
      component: EditPhotos,
      name: 'EditPhotos'
    });
  }

  _editMySignature() {
    navigator.push({
      component: EditPersonalSignature,
      name: 'EditPersonalSignature',
      params: {
        personalSignature: this.state.PersonSignal
      },
    });
  }

  _editMyProfile() {
    navigator.push({
      component: EditUserProfile,
      name: 'EditUserProfile'
    });
  }

  _editMyDatingFilter() {
    navigator.push({
      component: EditFriendFilter,
      name: 'EditFriendFilter'
    })
  }

  _openImgModal(arr,index) {
    let tmpArr = [];
    for (let i = 0; i < arr.length; i++) {
      tmpArr.push(URL_DEV + arr[i].PhotoUrl);
    }
    this.setState({
      imgList: tmpArr,
      showIndex:index
    }, ()=> {
      this.refs.modalFullScreen.open();
    });
  }

  _closeImgModal() {
    this.refs.modalFullScreen.close();
  }

  renderBody() {
    if(this.state.loading){
      return null;
    }else{
    return (
      <View style={ComponentStyles.container}>
        <ScrollView style={styles.scrollViewContainer}>
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>{'个人相册'}</Text>
              {this._renderEditLink(()=> {
                this._editMyPhotos()
              })}
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={true}>
              <View style={styles.photoContainer}>
                {this._renderPhotos(this.state.userPhotos)}
              </View>
            </ScrollView>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>{'个性签名'}</Text>
              {this._renderEditLink(()=> {
                this._editMySignature()
              })}
            </View>
            <Text
              style={styles.sectionContent}>{this.state.PersonSignal ? this.state.PersonSignal : '这家伙很懒,没有留下任何签名'}</Text>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>{'历史聚会/约会消息'}</Text>
            </View>
            <View style={[styles.sectionContent, styles.announcementCard]}>
              <Image
                onLoadEnd={()=> {
                  this.setState({avatarLoading: false})
                }}
                style={styles.userAvatar}
                source={{uri: URL_DEV + this.state.PrimaryPhotoFilename}}>
                {this.state.avatarLoading ?
                  <Image
                    source={require('./img/imgLoading.gif')}
                    style={styles.userAvatar}/> : null}
              </Image>
              <TouchableOpacity
                onPress={()=> {
                  this._goHistoryAnnouncementList()
                }}
                style={styles.textBtnContainer}>
                <Text style={styles.textBtn}>{'查看历史聚会/约会消息'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>{'个人信息'}</Text>
              {this._renderEditLink(()=> {
                this._editMyProfile()
              })}
            </View>
            <View style={[styles.sectionContent]}>
              {this._renderUserInfo(this.state.BasicInfo)}
            </View>
          </View>
          <View style={[styles.section, styles.bottomSection]}>
            <View style={styles.sectionTitle}>
              <Text style={styles.sectionTitleText}>{'交友信息'}</Text>
              {this._renderEditLink(()=> {
                this._editMyDatingFilter()
              })}
            </View>
            <View style={[styles.sectionContent]}>
              {this._renderUserInfo(this.state.DataFilter)}
            </View>
          </View>
        </ScrollView>
        {this._renderButtonGroup()}
      </View>
    )}
  }

  renderModal() {
    return (
      <ModalBox
        style={{
          position: 'absolute',
          width: width,
          height: height,
          backgroundColor: 'rgba(40,40,40,0.8)',
        }}
        backButtonClose={true}
        position={"center"}
        ref={"modalFullScreen"}
        swipeToClose={true}
        onClosingState={this.onClosingState}>
        <PhotoScaleViewer
          index={this.state.showIndex}
          pressHandle={()=> {
            console.log('你点击了图片,此方法必须要有,否则不能切换下一张图片')
          }}
          imgList={this.state.imgList}/>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={()=> {
            this._closeImgModal()
          }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <IonIcon name={'ios-close-outline'} size={44} color={'#fff'} style={{
              fontWeight: '100'
            }}/>
          </View>
        </TouchableOpacity>
      </ModalBox>
    )
  }

}

export default connect((state)=> {
  return {
    ...state
  }
})(UserInfo)
