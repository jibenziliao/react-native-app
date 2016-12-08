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
  TouchableOpacity
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import {componentStyles} from '../style'
import BaseComponent from '../base/BaseComponent'
import {URL_DEV, TIME_OUT} from '../constants/Constant'
import * as HomeActions from '../actions/Home'
import {Button as NBButton, Icon as NBIcon} from 'native-base'
import AnnouncementList from '../pages/AnnouncemenetList'
import EditUserInfo from '../pages/EditUserInfo'
import * as Storage from '../utils/Storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import EditPersonalSignature from '../pages/EditPersonalSignature'
import EditUserProfile from '../pages/EditUserProfile'
import EditFriendFilter from '../pages/EditFriendFilter'
import EditPhotos from '../pages/EditPhotos'

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

  //如果查看的用户详情时当前用户自己的详细资料,则导航栏显示编辑按钮
  onRightPressed() {
    const {dispatch}=this.props;
    dispatch(HomeActions.getCurrentUserProfile('', (json)=> {
      dispatch(HomeActions.getDatingFilter('', (res)=> {
        this._initDict((data, result, res)=> {
          this._goEditUserInfo(data, result, res)
        }, json.Result, res.Result);
      }, (error)=> {
      }));
    }, (error)=> {

    }));
  }

  _goEditUserInfo(data, result, res) {
    navigator.push({
      component: EditUserInfo,
      name: 'EditUserInfo',
      params: {
        DictMap: data,
        ...result,
        friendInfo: res,
        userPhotos: this._initOnlinePhotos(this.state.userPhotos)
      }
    });
  }

  //将从后台获取的相册重新包装,标明照片是从线上获取,而非本地拍摄。并标明头像
  _initOnlinePhotos(data) {
    let tmpArr = [];
    for (let i = 0; i < data.length; i++) {
      data[i].onLine = true;
      data[i].isAvatar = data[i].PhotoUrl == this.state.PrimaryPhotoFilename;
      tmpArr.push(data[i])
    }
    return tmpArr;
  }

  _initDict(callBack, result, res) {
    //每次初始化字典时,需要把之前的数据清空
    DictMap = {
      EducationLevelDict: [],
      IncomeLevelDict: [],
      JobTypeDict: [],
      MarriageStatusDict: [],
      DatingPurposeDict: [],
      PhotoPermissionDict: [],
      ReligionDict: []
    };
    //下面是选填项的字典
    for (let i = 0; i < DictMapArrKey.length; i++) {
      Storage.getItem(`${DictMapArrKey[i]}`).then((response)=> {
        if (response && response.length > 0) {
          for (let j = 0; j < response.length; j++) {
            if (DictMapArrKey[i] == 'DatingPurposeDict' || DictMapArrKey[i] == 'PhotoPermissionDict' || DictMapArrKey[i] == 'ReligionDict') {
              DictMap[DictMapArrKey[i]].push(response[j])
            } else {
              DictMap[DictMapArrKey[i]].push(response[j].Value)
            }
          }
          if (i === DictMapArrKey.length - 1) {
            callBack(DictMap, result, res);
          }
        } else {
          console.error('获取下拉选项字典出错');
        }
      })
    }

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
    return arr.map((item, index)=> {
      return (
        <Image
          key={index}
          style={styles.photos}
          source={{uri: URL_DEV + item.PhotoUrl}}/>
      )
    })
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
              console.log('你点击了对话')
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
        personalSignature: this.state.PersonSignal,
        callBack: (data)=> {
          this.setState({PersonSignal:data})
        }
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
