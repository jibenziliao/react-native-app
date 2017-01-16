/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 09:54
 * @description
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  InteractionManager,
  ListView,
  RefreshControl,
  Image,
  TouchableOpacity,
  Dimensions,
  DeviceEventEmitter,
  Platform,
  Keyboard,
  Animated,
  TouchableHighlight,
  Alert,
  StatusBar
} from 'react-native'
import BaseComponent from '../base/BaseComponent'
import {Button as NBButton} from 'native-base'
import IonIcon from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux'
import * as HomeActions from '../actions/Home'
import Spinner from '../components/Spinner'
import AnnouncementDetail from '../pages/AnnouncementDetail'
import Addannouncement from '../pages/Addannouncement'
import UserInfo from '../pages/UserInfo'
import {URL_DEV,LOCATION_TIME_OUT} from '../constants/Constant'
import tmpGlobal from '../utils/TmpVairables'
import {toastShort} from '../utils/ToastUtil'
import PhotoScaleViewer from '../components/PhotoScaleViewer'
import ModalBox from 'react-native-modalbox'
import SubTabView from '../components/SubTabView'
import ActionSheet from 'react-native-actionsheet'
import AnnouncementList from '../pages/AnnouncemenetList'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  commonContainer: {
    flex: 1
  },
  tipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginVertical: 10
  },
  touchableTips: {
    flex: 1,
    backgroundColor: '#e8d62f',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  tipsContent: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconBox: {
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listView: {
    flex: 1
  },
  contentTitle: {
    margin: 10
  },
  content: {
    flex: 1
  },
  card: {
    backgroundColor: '#FFF',
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 4
  },
  cardRow: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 10
  },
  avatarImg: {
    width: width / 9,
    height: width / 9,
    marginRight: 10,
    borderRadius: 8
  },
  userInfo: {
    justifyContent: 'space-between',
    flex: 1
  },
  userInfoLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  userInfoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'pink',
    borderWidth: 1,
    borderColor: 'pink',
    paddingHorizontal: 6
  },
  userInfoIcon: {
    marginRight: 4,
    color: '#FFF'
  },
  userInfoText: {
    fontSize: 10,
    color: '#FFF'
  },
  nameTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nameText: {
    overflow: 'hidden',
    flex: 1,
    flexWrap: 'nowrap'
  },
  timeText: {
    fontSize: 12,
    justifyContent: 'center'
  },
  moodView: {
    marginTop: 10
  },
  moodText: {
    fontSize: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    marginBottom: 10
  },
  postImage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    //paddingVertical: 5,
    justifyContent: 'flex-start',
    paddingLeft: 10
  },
  cardBtn: {
    marginTop: 10,
    marginRight: 20
  },
  moreImgLabel: {
    position: 'absolute',
    top: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    paddingHorizontal: 2
  },
  moreImgIcon: {},
  moreImgText: {
    fontSize: 10,
    marginLeft: 4
  },
  singleImgContainer: {
    marginBottom: 10,
    marginRight: 10
  },
  refreshScreen: {
    ...Platform.select({
      ios: {
        top: 64,
        height: height - 64 - 46.5
      },
      android: {
        top: 54,
        height: height - 54 - 50
      }
    }),
    position: 'absolute',
    left: 0,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  refreshBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderColor: 'gray',
    borderWidth: 1
  },
});

let pageNavigator;
let commentId;
let lastCount = null, appointmentCount = null;

const buttons = ['取消', '发聚会', '发约会'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 3;

class Home extends BaseComponent {

  constructor(props) {
    super(props);
    pageNavigator = this.props.navigator;
    this.state = {
      gpsStatus: this.props.gpsStatus,
      closeTips: false,
      tabIndex: 0,
      refreshing: false,
      appointmentRefreshing: false,
      loadingMore: false,
      appointmentLoadingMore: false,
      pageSize: 10,
      pageIndex: 1,
      appointmentPageSize: 10,
      appointmentPageIndex: 1,
      postList: [],//聚会列表
      appointmentList: [],//约会列表
      comment: '',
      appointmentComment: '',
      viewMarginBottom: new Animated.Value(0),
      showCommentInput: false,
      imgLoading: true,
      appointmentImgLoading: true,
      showIndex: 0,
      appointmentShowIndex: 0,
      imgList: [],
      appointmentImgList: [],
      commentInputHeight: 0,
      appointmentCommentInputHeight: 0,
    };

    this._commonRefresh = this._commonRefresh.bind(this);
    this._handleInputHeight = this._handleInputHeight.bind(this);
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=> {
      this._getAnnouncementList();
    });
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  _getAnnouncementList() {
    const {dispatch}=this.props;
    let data = {
      pageSize: this.state.pageSize,
      pageIndex: this.state.pageIndex,
      ...tmpGlobal.currentLocation,
      postType: 1
    };
    dispatch(HomeActions.getPostList(data, (json)=> {
      lastCount = json.Result.length;
      let params = {
        pageSize: this.state.appointmentPageSize,
        pageIndex: this.state.appointmentPageIndex,
        ...tmpGlobal.currentLocation,
        postType: 2
      };
      //获取约会列表
      dispatch(HomeActions.getPostList(params, (json2)=> {
        appointmentCount = json2.Result.length;
        this.setState({
          postList: json.Result,
          appointmentList: json2.Result,
          needRefresh: false
        });
      }, (error2)=> {
        this.setState({
          needRefresh: true
        }, ()=> {
          this._commonRefresh = ()=> {
            this._getAnnouncementList();
          }
        });
      }));
    }, (error)=> {
      this.setState({
        needRefresh: true
      }, ()=> {
        this._commonRefresh = ()=> {
          this._getAnnouncementList();
        }
      });
    }));
  }

  _loadMoreData() {
    console.log('加载更多');
    const {dispatch} = this.props;
    if (this.state.tabIndex === 0) {
      this.setState({loadingMore: true});
      this.state.pageIndex += 1;
    } else {
      this.setState({appointmentLoadingMore: true});
      this.state.appointmentPageIndex += 1;
    }
    const data = {
      pageSize: this.state.tabIndex === 0 ? this.state.pageSize : this.state.appointmentPageSize,
      pageIndex: this.state.tabIndex === 0 ? this.state.pageIndex : this.state.appointmentPageIndex,
      ...tmpGlobal.currentLocation,
      postType: this.state.tabIndex + 1
    };

    dispatch(HomeActions.getPostList(data, (json)=> {
      if (this.state.tabIndex === 0) {
        lastCount = json.Result.length;
        this.state.postList = this.state.postList.concat(json.Result);
        this.setState({
          ...this.state.postList,
          refreshing: false,
          loadingMore: false,
        })
      } else {
        appointmentCount = json.Result.length;
        this.state.appointmentList = this.state.appointmentList.concat(json.Result);
        this.setState({
          ...this.state.appointmentList,
          appointmentRefreshing: false,
          appointmentLoadingMore: false,
        })
      }
    }, (error)=> {

    }));
  }

  _onRefresh() {
    const {dispatch}=this.props;
    if (this.state.tabIndex === 0) {
      this.setState({
        refreshing: true,
        pageIndex: 1
      });
    } else {
      this.setState({
        appointmentRefreshing: true,
        appointmentPageIndex: 1
      });
    }

    const data = {
      pageSize: this.state.tabIndex === 0 ? this.state.pageSize : this.state.appointmentPageSize,
      pageIndex: 1,
      ...tmpGlobal.currentLocation,
      postType: this.state.tabIndex + 1
    };
    dispatch(HomeActions.getPostListQuiet(data, (json)=> {
      if (this.state.tabIndex === 0) {
        lastCount = json.Result.length;
        this.setState({
          postList: json.Result,
          refreshing: false,
          needRefresh: false,
        });
      } else {
        appointmentCount = json.Result.length;
        this.setState({
          appointmentList: json.Result,
          appointmentRefreshing: false,
          needRefresh: false,
        });
      }
    }, (error)=> {
      this.setState({
        needRefresh: true
      }, ()=> {
        this._commonRefresh = ()=> {
          this._getAnnouncementList();
        }
      });
      if (this.state.tabIndex === 0) {
        this.setState({
          refreshing: false
        });
      } else {
        this.setState({
          appointmentRefreshing: false
        });
      }
    }));
  }

  componentDidMount() {
    this.hasReadListener = DeviceEventEmitter.addListener('announcementHasRead', (data)=> {
      this._changeSubTab(data.data);
    });
    this.hasDeleteListener = DeviceEventEmitter.addListener('announcementHasDelete', (data)=> {
      this._changeSubTab(data.data);
    });
    this.publishListener = DeviceEventEmitter.addListener('announcementHasPublish', (data)=> {
      this._changeSubTab(data.data);
    });
    this.commentListener = DeviceEventEmitter.addListener('announcementHasComment', (data)=> {
      this._changeSubTab(data.data);
    });
  }

  _changeSubTab(index) {
    this.setState({tabIndex: index}, ()=> {
      this._onRefresh();
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      ...nextProps
    })
  }

  componentWillUnmount() {
    this.hasReadListener.remove();
    this.hasDeleteListener.remove();
    this.publishListener.remove();
    this.commentListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  //因为在MainContainer中在ScrollableTabView外层包裹了一个View,所以这里的keyboardWillShow、keyboardWillHide失效,只能用keyboardDidShow及keyboardDidHide监听键盘事件
  //https://github.com/skv-headless/react-native-scrollable-tab-view/issues/500
  //ScrollableTabView并不强制要求作为根节点使用。(如果作为根节点使用,在安卓设备上,弹出键盘时,底部tabBar会跟随上滑)
  _keyboardDidShow(e) {
    Animated.timing(
      this.state.viewMarginBottom,
      {
        toValue: e.endCoordinates.height - (Platform.OS === 'ios' ? 45.5 : 50),
        duration: 10,
      }
    ).start();
  }

  _keyboardDidHide() {
    this._resetScrollTo();
  }

  getNavigationBarProps() {
    return {
      title: '广场',
      hideRightButton: false,
      rightIcon: {
        name: 'plus'
      },
      leftIcon: {
        name: 'bars',
        size: 26
      }
    };
  }

  onLeftPressed() {
    this.props.menuChange(true);
  }

  onRightPressed() {
    this._closeCommentInput();
    this.ActionSheet.show();
  }

  //点击actionSheet
  _actionSheetPress(index) {
    if (index === 2) {
      this._canPost(2);
    } else if (index === 1) {
      this._canPost(1);
    }
  }

  //检查是否有未过期的聚会/约会
  _canPost(int) {
    const {dispatch, pageNavigator}=this.props;
    let data = {
      postType: int
    };
    dispatch(HomeActions.newPost(data, (json)=> {
      if (json.Result.CanPost) {
        pageNavigator.push({
          component: Addannouncement,
          name: 'Addannouncement',
          params: {
            title: int === 1 ? '发布新聚会' : '发布新约会',
            postType: int
          }
        });
      } else {
        this._newPostAlert(int);
      }
    }, (error)=> {
    }));
  }

  //前往我的历史公告列表(包含聚会和约会)
  _goAnnouncementList() {
    pageNavigator.push({
      component: AnnouncementList,
      name: 'AnnouncementList',
      params: {
        targetUserId: tmpGlobal.currentUser.UserId,
        Nickname: tmpGlobal.currentUser.Nickname
      }
    });
  }

  _newPostAlert(int) {
    Alert.alert('提示', '可发布的未过期的动态数量已达上限', [
      {
        text: `查看历史${int === 1 ? '聚会' : '约会'}`, onPress: () => {
        this._goAnnouncementList();
      }
      },
      {
        text: '关闭', onPress: () => {
      }
      }
    ]);
  }

  //点击头像和名字,跳转个人信息详情页
  _goUserInfo(data) {
    this._closeCommentInput();
    pageNavigator.push({
      component: UserInfo,
      name: 'UserInfo',
      params: {
        Nickname: data.Nickname,
        UserId: data.UserId,
        isSelf: tmpGlobal.currentUser.UserId === data.UserId,
      }
    });
  }

  //点赞/取消赞(不论是否已赞,点赞取消赞,isLike都传true,isLike可能的值null,true,false)
  _doLike(id, isLike) {
    this._closeCommentInput();
    const {dispatch}=this.props;
    let index = this.state.postList.findIndex((item)=> {
      return item.Id === id;
    });

    let appointmentIndex = this.state.appointmentList.findIndex((item)=> {
      return item.Id === id;
    });
    if (this.state.tabIndex === 0) {
      if (isLike === null) {
        this.state.postList[index].LikeCount += 1;
        this.state.postList[index].AmILikeIt = true;
      } else {
        this.state.postList[index].LikeCount -= 1;
        this.state.postList[index].AmILikeIt = null;
      }
    } else {
      if (isLike === null) {
        this.state.appointmentList[appointmentIndex].LikeCount += 1;
        this.state.appointmentList[appointmentIndex].AmILikeIt = true;
      } else {
        this.state.appointmentList[appointmentIndex].LikeCount -= 1;
        this.state.appointmentList[appointmentIndex].AmILikeIt = null;
      }
    }

    const data = {
      postId: id,
      isLike: true
    };
    dispatch(HomeActions.like(data, (json)=> {
      if (this.state.tabIndex === 0) {
        this.setState({
          postList: [
            ...this.state.postList
          ]
        });
      } else {
        this.setState({
          appointmentList: [
            ...this.state.appointmentList
          ]
        });
      }

    }, (error)=> {
    }));
  }

  _showCommentInput(id) {
    //保存当前要评论的广告id
    commentId = id;
    this.setState({
      showCommentInput: true
    });
  }

  _closeCommentInput() {
    this.setState({
      showCommentInput: false,
      comment: '',
      commentInputHeight: 0
    });
  }

  //前往公告详情(先判断是否是本人发布的动态,然后获取公告详情和评论列表)
  _goAnnouncementDetail(rowData) {
    this._closeCommentInput();
    pageNavigator.push({
      component: AnnouncementDetail,
      name: 'AnnouncementDetail',
      params: {
        Id: rowData.Id,
        isSelf: tmpGlobal.currentUser.UserId === rowData.CreaterId,
        PostType: this.state.tabIndex + 1
      }
    });
  }

  _openImgModal(arr) {
    let tmpArr = [];
    for (let i = 0; i < arr.length; i++) {
      tmpArr.push(URL_DEV + '/' + arr[i]);
    }
    this.setState({
      imgList: tmpArr
    }, ()=> {
      this.refs.modalFullScreen.open();
    });
  }

  _closeImgModal() {
    this.refs.modalFullScreen.close();
  }

  _commonRefresh = ()=> {
    //调用时,重新绑定事件
  };

  //发送评论
  _sendComment() {
    //发送评论,并给当前广告评论数加一
    const {dispatch}=this.props;
    let data = {
      postId: commentId,
      forCommentId: null,
      comment: this.state.comment
    };

    //关闭评论输入框,并情况评论框内容
    this._closeCommentInput();

    if (this.state.tabIndex === 0) {
      let index = this.state.postList.findIndex((item)=> {
        return item.Id === commentId;
      });
      this.state.postList[index].CommentCount += 1;
    } else {
      let index = this.state.appointmentList.findIndex((item)=> {
        return item.Id === commentId;
      });
      this.state.appointmentList[index].CommentCount += 1;
    }

    dispatch(HomeActions.comment(data, (json)=> {
      toastShort('评论成功');
      if (this.state.tabIndex === 0) {
        this.setState({
          postList: [
            ...this.state.postList
          ]
        });
      } else {
        this.setState({
          appointmentList: [
            ...this.state.appointmentList
          ]
        });
      }
    }, (error)=> {
    }));
  }

  _resetScrollTo() {
    Animated.timing(
      this.state.viewMarginBottom,
      {
        toValue: 0,
        duration: 10,
      }
    ).start();
  }

  //多行评论输入框增加最大高度限制
  _handleInputHeight(event) {
    this.setState({
      comment: event.nativeEvent.text,
      commentInputHeight: Math.min(event.nativeEvent.contentSize.height, 80)
    })
  }

  _renderCommentInputBar() {
    if (this.state.showCommentInput) {
      return (
        <Animated.View
          style={{
            flexDirection: 'row',
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#E2E2E2',
            marginBottom: this.state.viewMarginBottom
          }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
          }}>
            <TextInput
              ref={'comment'}
              multiline={true}
              style={[{
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: 4,
                paddingHorizontal: 10,
                flexWrap: 'wrap',
                height: 40
              }, {
                height: Math.max(40, this.state.commentInputHeight)
              }]}
              underlineColorAndroid={'transparent'}
              placeholder={'请输入回复'}
              maxLength={50}
              onChange={this._handleInputHeight}
              value={this.state.comment}/>
          </View>
          <View>
            <NBButton
              primary
              style={{
                width: 100,
                marginLeft: 10
              }}
              onPress={()=> {
                this._sendComment()
              }}>
              发送
            </NBButton>
          </View>
        </Animated.View>
      )
    } else {
      return null
    }
  }

  _handleChangeTab(index) {
    this._closeCommentInput();
    this.setState({
      tabIndex: index
    })
  }

  _renderLocationTips() {
    if (this.state.gpsStatus || this.state.closeTips) {
      return null;
    } else {
      return (
        <View style={styles.tipsContainer}>
          <TouchableHighlight
            onPress={()=> {
              this.setState({closeTips: true});
            }}
            underlayColor={'#faebd7'}
            style={styles.touchableTips}>
            <View style={styles.tipsContent}>
              <Text numberOfLines={1}>{"打开定位功能,可查看更准确距离信息"}</Text>
              <View style={styles.iconBox}>
                <IonIcon name={'ios-close-outline'} size={24}/>
              </View>
            </View>
          </TouchableHighlight>
        </View>
      )
    }
  }

  renderBody() {
    return (
      <View
        ref={'root'}
        style={[styles.container]}>
        <SubTabView
          locationTips={this._renderLocationTips.bind(this)}
          index={this.state.tabIndex}
          tabIndex={this._handleChangeTab.bind(this)}
          _goUserInfo={this._goUserInfo.bind(this)}
          _goAnnouncementDetail={this._goAnnouncementDetail.bind(this)}
          refreshing={this.state.refreshing}
          appointmentRefreshing={this.state.appointmentRefreshing}
          pageSize={this.state.pageSize}
          pageIndex={this.state.pageIndex}
          appointmentPageSize={this.state.appointmentPageSize}
          appointmentPageIndex={this.state.appointmentPageIndex}
          postList={this.state.postList}
          appointmentList={this.state.appointmentList}
          _loadMoreData={this._loadMoreData.bind(this)}
          lastCount={lastCount}
          appointmentCount={appointmentCount}
          _doLike={this._doLike.bind(this)}
          _showCommentInput={this._showCommentInput.bind(this)}
          _closeCommentInput={this._closeCommentInput.bind(this)}
          _onRefresh={this._onRefresh.bind(this)}
          _openImgModal={this._openImgModal.bind(this)}/>
        <ActionSheet
          ref={(o) => this.ActionSheet = o}
          title="请选择你的操作"
          options={buttons}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this._actionSheetPress.bind(this)}
        />
        {this._renderCommentInputBar()}
      </View>
    )
  }

  renderModal() {
    return (
      <ModalBox
        style={{
          position: 'absolute',
          width: width,
          ...Platform.select({
            ios: {
              height: height - 46
            },
            android: {
              height: height - 50
            }
          }),
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
          style={{
            position: 'absolute',
            left: 20,
            ...Platform.select({
              ios: {
                top: 15
              },
              android: {
                top: 10
              }
            }),
          }}
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

  renderRefreshBtn() {
    if (this.state.needRefresh) {
      return (
        <View style={styles.refreshScreen}>
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={()=> {
                this._commonRefresh();
              }}
              style={styles.refreshBtn}>
              <Text>{'点击重试'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return null;
    }
  }

  renderSpinner() {
    if (this.props.pendingStatus) {
      return (
        <Spinner animating={this.props.pendingStatus}/>
      )
    }
  }
}

export default connect((state)=> {
  return {
    ...state,
    result: state.InitialApp.res,
    pendingStatus: state.InitialApp.pending
  }
})(Home)