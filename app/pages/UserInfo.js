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
  DeviceEventEmitter
} from 'react-native'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import {URL_DEV, TIME_OUT} from '../constants/Constant'
import * as HomeActions from '../actions/Home'
import {Button as NBButton, Icon as NBIcon} from 'native-base'
import AnnouncementList from '../pages/AnnouncemenetList'
import Icon from 'react-native-vector-icons/FontAwesome'
import EditPersonalSignature from '../pages/EditPersonalSignature'
import EditUserProfile from '../pages/EditUserProfile'
import EditFriendFilter from '../pages/EditFriendFilter'
import EditPhotos from '../pages/EditPhotos'
import MessageDetail from '../pages/MessageDetail'
import tmpGlobal from '../utils/TmpVairables'

const {width, height}=Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  scrollViewContainer: {
    flex: 1,
    paddingHorizontal: 10
  },
  photoContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  photos: {
    width: 100,
    height: 100,
    marginRight: 10
  },
  userAvatar: {
    height: width / 9,
    width: width / 9,
    marginRight: 10,
    borderRadius: 4
  },
  userInfoItem: {
    flexDirection: 'row',
    paddingVertical: 5
  },
  itemLeft: {
    width: 100
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
    height: 40,
    borderRadius: 0
  },
  attention: {
    backgroundColor: '#FF9933'
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 10,
    marginTop: 10
  },
  sectionTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#cec5c5',
    paddingBottom: 10
  },
  sectionTitleText: {
    fontSize: 16
  },
  sectionContent: {
    marginTop: 10
  },
  bottomSection: {
    marginBottom: 10
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
    marginLeft: 5
  },
  textBtnContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  textBtn: {
    color: '#5067FF'
  }
});

let DictMap = {
  EducationLevelDict: [],
  IncomeLevelDict: [],
  JobTypeDict: [],
  MarriageStatusDict: [],
  DatingPurposeDict: [],
  PhotoPermissionDict: [],
  ReligionDict: []
};

//保存字典索引
let DictMapArrKey = ['EducationLevelDict', 'IncomeLevelDict', 'JobTypeDict', 'MarriageStatusDict', 'DatingPurposeDict', 'PhotoPermissionDict', 'ReligionDict'];

let navigator;

class UserInfo extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.route.params
    };
    navigator=this.props.navigator;
    console.log(this.props.route.params);
  }

  getNavigationBarProps() {
    return {
      title: this.state.Nickname
    };
  }

  componentDidMount(){
    this.subscription = DeviceEventEmitter.addListener('photoChanged', ()=>{this._getUserInfo()});
    this.userProfileListener=DeviceEventEmitter.addListener('userInfoChanged', ()=>{this._getUserInfo()});
    this.friendFilterListener=DeviceEventEmitter.addListener('friendFilterChanged', ()=>{this._getUserInfo()});
    this.signatureListener = DeviceEventEmitter.addListener('signatureChanged', (data)=>{this._updateSignature(data)});

  }

  componentWillUnmount() {
    this.subscription.remove();
    this.userProfileListener.remove();
    this.friendFilterListener.remove();
    this.signatureListener.remove();
  }

  _getUserInfo(){
    const{dispatch}=this.props;
    let params = {
      UserId: this.state.UserId,
      ...tmpGlobal.currentLocation
    };
    dispatch(HomeActions.getUserInfo(params, (json)=> {
      dispatch(HomeActions.getUserPhotos({UserId: this.state.UserId}, (result)=> {
        this.setState({
          ...json.Result,
          userPhotos:result.Result,
        });
      }, (error)=> {
      }))
    }, (error)=> {
    }));
  }

  //刷新签名
  _updateSignature(data){
    this.setState({
      PersonSignal:data.data
    })
  }

  //前往指定用户的历史公告
  _goHistoryAnnouncementList() {
    const {dispatch, navigator}=this.props;
    let data = {
      targetUserId: this.state.UserId,
      pageIndex: 1,
      pageSize: 10,
      ...this.state.myLocation,
      postOrderTyp: 3
    };
    dispatch(HomeActions.getAllAnnouncement(data, (json)=> {
      navigator.push({
        component: AnnouncementList,
        name: 'AnnouncementList',
        params: {
          postList: json.Result,
          targetUserId: this.state.UserId,
          Nickname: this.state.Nickname,
          myLocation: this.state.myLocation,
          myUserId: this.state.myUserId
        }
      });
    }, (error)=> {
    }));
  }

  //与TA聊天
  _chatWithUser(){
    navigator.push({
      component: MessageDetail,
      name: 'MessageDetail',
      params: {
        UserId: this.state.UserId,
        Nickname: this.state.Nickname,
        UserAvatar: this.state.PrimaryPhotoFilename,
        myUserId: this.state.myUserId
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
      this.setState({AmIFollowedHim: !this.state.AmIFollowedHim});
    }, (error)=> {
    }));
  }

  //渲染用户的相册
  _renderPhotos(arr) {
    if(arr.length>0){
      return arr.map((item, index)=> {
        return (
          <Image
            key={index}
            style={styles.photos}
            source={{uri: URL_DEV + item.PhotoUrl}}/>
        )
      })
    }else{
      return (<Text>{this.state.isSelf?'您':'Ta'}{'还没有相册'}</Text>)
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
            size={20}/>
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
      name: 'EditPhotos',
      params: {
        UserId: this.state.UserId,
        PrimaryPhotoFilename:this.state.PrimaryPhotoFilename
      },
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

  renderBody() {
    return (
      <View style={styles.container}>
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
              showsHorizontalScrollIndicator={true}
              style={styles.photoContainer}>
              {this._renderPhotos(this.state.userPhotos)}
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
              <Text style={styles.sectionTitleText}>{'求关注消息'}</Text>
            </View>
            <View style={[styles.sectionContent, styles.announcementCard]}>
              <Image
                style={styles.userAvatar}
                source={{uri: URL_DEV + this.state.PrimaryPhotoFilename}}/>
              <TouchableOpacity
                onPress={()=> {
                  this._goHistoryAnnouncementList()
                }}
                style={styles.textBtnContainer}>
                <Text style={styles.textBtn}>{this.state.isSelf ? '点击查看我的历史求关注消息' : '点击查看用户历史求关注消息'}</Text>
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
    )
  }
}

export default connect((state)=> {
  return {
    ...state
  }
})(UserInfo)
