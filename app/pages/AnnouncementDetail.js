/**
 * 公告详情
 * @author keyy/1501718947@qq.com 16/11/30 16:33
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  ListView,
  RefreshControl,
  Dimensions,
  InteractionManager,
  Alert,
  DeviceEventEmitter,
  Platform,
  Keyboard,
  Animated
} from 'react-native'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import * as HomeActions from '../actions/Home'
import Icon from 'react-native-vector-icons/FontAwesome'
import IonIcon from 'react-native-vector-icons/Ionicons'
import {Button as NBButton} from 'native-base'
import LoadMoreFooter from '../components/LoadMoreFooter'
import UserInfo from '../pages/UserInfo'
import {toastShort} from '../utils/ToastUtil'
import Addannouncement from '../pages/Addannouncement'
import {URL_DEV, TIME_OUT} from '../constants/Constant'
import ActionSheet from 'react-native-actionsheet'
import tmpGlobal from '../utils/TmpVairables'
import ModalBox from 'react-native-modalbox'
import PhotoScaleViewer from '../components/PhotoScaleViewer'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  listView: {
    flex: 1
  },
  card: {
    backgroundColor: '#FFF',
    flex: 1,
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 10,
    paddingVertical: 10
  },
  cardRow: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: 10
  },
  cardLeft: {
    flexDirection: 'row',
    flex: 1
  },
  cardRight: {
    flexDirection: 'row'
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
  commentName: {
    marginLeft: 10
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
    marginVertical: 20
  },
  postImage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: 10
  },
  moodText: {
    fontSize: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingHorizontal: 10
  },
  goreBtn: {
    color: '#5067FF'
  },
  cardBtn: {
    marginTop: 10,
    marginRight: 20
  },
  commentCard: {
    padding: 10,
    marginBottom: 5,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderColor: '#fff',
    flexDirection: 'row',
    marginHorizontal: 10
  },
  commentImg: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 6
  },
  commentArea: {
    flex: 1
  },
  commentContent: {
    marginVertical: 10
  },
  partyOptionsContainer: {
    paddingHorizontal: 10
  },
  partyOptionsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  partyLabel: {
    width: width / 3
  }
});

let lastCount;
let navigator;

const buttons = ['取消', '发布新公告', '删除'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 1;
const DICT = {
  days: [
    {Key: 1, Value: '1天'},
    {Key: 2, Value: '2天'},
    {Key: 3, Value: '3天'}],
  numberOfPeople: [
    {Key: 1, Value: '2-3人'},
    {Key: 2, Value: '4-5人'},
    {Key: 3, Value: '5人以上'}],
  cost: [
    {Key: 1, Value: '我请客'},
    {Key: 2, Value: 'AA'},
    {Key: 3, Value: '男AA女免费'}]
};

class AnnouncementDetail extends BaseComponent {

  constructor(props) {
    super(props);
    console.log(this.props.route.params);
    this.state = {
      comment: '',
      commentUser: '',
      forCommentId: null,
      refreshing: false,
      loadingMore: false,
      ...this.props.route.params,
      commentList: [],
      pageIndex: 1,
      pageSize: 10,
      viewMarginBottom: new Animated.Value(0),
      showCommentInput: false,
      imgLoading: true,
      avatarLoading: true,
      showIndex: 0,
      imgList: [],
      commentInputHeight: 0
    };
    lastCount = this.state.pageSize;
    navigator = this.props.navigator;
  }

  _renderRightIcon() {
    if (this.state.isSelf) {
      return {
        name: 'ellipsis-v',
        size: 24
      }
    } else {
      return null;
    }
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow.bind(this));
  }

  componentDidMount() {
    this._attentionListener = DeviceEventEmitter.addListener('hasAttention', ()=> {
      this._onRefresh()
    });
    InteractionManager.runAfterInteractions(()=> {
      this._getAnnouncementDetail();
    });

  }

  componentWillUnmount() {
    if (this.deleteTimer) {
      clearTimeout(this.deleteTimer);
    }
    //ios在销毁页面前发出广播,避免返回前一页面后,页面白屏,点击一下才显示的bug。
    if (Platform.OS === 'ios') {
      DeviceEventEmitter.emit('announcementHasRead', {message: '公告已阅读', data: this.state.PostType - 1});
    }
    this._attentionListener.remove();
    this.keyboardWillShowListener.remove();
  }

  //当键盘弹即将起来
  _keyboardWillShow(e) {
    Animated.timing(
      this.state.viewMarginBottom,
      {
        toValue: e.startCoordinates.height,
        duration: 100,
      }
    ).start();
  }

  getNavigationBarProps() {
    return {
      title: '公告详情',
      hideRightButton: false,
      rightTitle: this.state.isSelf ? null : (this.state.AmIFollowedHim ? '取消关注' : '关注TA'),
      rightIcon: this._renderRightIcon()
    };
  }

  onRightPressed() {
    this._closeCommentInput();
    if (this.state.isSelf) {
      //弹出下拉菜单
      this.ActionSheet.show();
    } else {
      //关注用户
      this._attention();
    }
  }

  //点击actionSheet
  _actionSheetPress(index) {
    const {dispatch, navigator}=this.props;
    let data = {
      PostId: this.state.Id
    };
    if (index === 2) {
      dispatch(HomeActions.deleteAnnouncement(data, (json)=> {
        DeviceEventEmitter.emit('announcementHasDelete', {message: '公告被删除', data: this.state.PostType - 1});
        toastShort('删除成功');
        this.deleteTimer = setTimeout(()=> {
          navigator.pop();
        }, 1000);
      }, (error)=> {
      }));
    } else if (index === 1) {
      navigator.push({
        component: Addannouncement,
        name: 'Addannouncement',
        params: {
          title: this.state.PostType === 1 ? '发布新聚会' : '发布新约会',
          postType: this.state.PostType
        }
      })
    }
  }

  //关注用户
  _attention() {
    const {dispatch}=this.props;
    let data = {
      attentionUserId: this.state.PosterInfo.UserId
    };
    dispatch(HomeActions.attention(data, (json)=> {
      DeviceEventEmitter.emit('hasAttention', '已关注/取消关注对方');
      //this.setState({AmIFollowedHim: !this.state.AmIFollowedHim});
    }, (error)=> {
    }))
  }

  //点击头像和名字,跳转个人信息详情页
  _goUserInfo(data) {
    this._closeCommentInput();
    const {dispatch}=this.props;
    let params = {
      UserId: data.UserId,
      ...tmpGlobal.currentLocation,
    };
    dispatch(HomeActions.getUserInfo(params, (json)=> {
      dispatch(HomeActions.getUserPhotos({UserId: data.UserId}, (result)=> {
        navigator.push({
          component: UserInfo,
          name: 'UserInfo',
          params: {
            Nickname: data.Nickname,
            UserId: data.UserId,
            myUserId: tmpGlobal.currentUser.UserId,
            ...json.Result,
            userPhotos: result.Result,
            myLocation: tmpGlobal.currentLocation,
            isSelf: this.state.isSelf
          }
        });
      }, (error)=> {
      }));
    }, (error)=> {
    }));
  }

  _renderGenderStyle(gender) {
    return {
      backgroundColor: gender ? '#1496ea' : 'pink',
      borderColor: gender ? '#1496ea' : 'pink',
    }
  }

  _showCommentInput(id, rowData) {
    if (rowData !== null) {
      this.setState({
        forCommentId: id,
        commentUser: rowData.CommentUserInfo.Nickname
      });
    }
    //保存当前要评论的广告id
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

  //点赞和取消赞isLike都传true
  _doLike(id, isLike) {
    this._closeCommentInput();
    const {dispatch}=this.props;
    if (isLike === null) {
      this.state.LikeCount += 1;
      this.state.AmILikeIt = true;
    } else {
      this.state.LikeCount -= 1;
      this.state.AmILikeIt = null;
    }

    const data = {
      postId: id,
      isLike: true
    };
    dispatch(HomeActions.like(data, (json)=> {
      this.setState({
        AmILikeIt: this.state.AmILikeIt,
        LikeCount: this.state.LikeCount
      });
    }, (error)=> {
    }));
  }

  //发送评论
  _sendComment() {
    //发送评论,并给当前广告评论数加一
    const {dispatch}=this.props;
    let data = {
      postId: this.state.Id,
      forCommentId: this.state.forCommentId,
      comment: this.state.comment
    };

    //关闭评论输入框,并情况评论框内容
    this._closeCommentInput();

    this.state.CommentCount += 1;

    let params = {
      postId: this.state.Id,
      pageIndex: 1,
      pageSize: 10,
      ...tmpGlobal.currentLocation
    };
    dispatch(HomeActions.comment(data, (json)=> {
      dispatch(HomeActions.getCommentList(params, (json)=> {
        DeviceEventEmitter.emit('announcementHasComment', {message: '公告被评论', data: this.state.PostType - 1});
        this.setState({
          CommentCount: this.state.CommentCount,
          commentList: json.Result//评论成功后,需要重新渲染页面,以显示最新的评论
        });
      }, (error)=> {
      }))
    }, (error)=> {
    }));
  }

  _toEnd() {
    if (lastCount < this.state.pageSize || this.state.commentList.length < this.state.pageSize) {
      return false;
    }

    InteractionManager.runAfterInteractions(() => {
      console.log("触发加载更多 toEnd() --> ");
      this._loadMoreData();
    });
  }

  _onRefresh() {
    const {dispatch}=this.props;
    this.setState({refreshing: true, pageIndex: 1});
    const data = {
      postId: this.state.Id,
      ...tmpGlobal.currentLocation
    };
    let params = {
      postId: this.state.Id,
      pageIndex: 1,
      pageSize: 10,
      ...tmpGlobal.currentLocation
    };
    dispatch(HomeActions.getAnnouncementDetailQuiet(data, (json)=> {
      dispatch(HomeActions.getCommentListQuiet(params, (result)=> {
        this.setState({
          comment: '',
          commentUser: '',
          forCommentId: null,
          refreshing: false,
          loadingMore: false,
          pageIndex: 1,
          pageSize: 10,
          ...json.Result,
          myUserId: tmpGlobal.currentUser.UserId,
          commentList: result.Result,
          isSelf: this.state.isSelf
        });
      }, (error)=> {
        this.setState({refreshing: false});
      }));
    }, (error)=> {
      this.setState({refreshing: false});
    }));
  }

  _getAnnouncementDetail() {
    const {dispatch}=this.props;
    let data = {
      postId: this.state.Id,
      ...tmpGlobal.currentLocation
    };
    let params = {
      postId: this.state.Id,
      pageIndex: 1,
      pageSize: 10,
      ...tmpGlobal.currentLocation
    };
    dispatch(HomeActions.getAnnouncementDetail(data, (json)=> {
      dispatch(HomeActions.getCommentList(params, (result)=> {
        this.setState({
          forCommentId: null,
          refreshing: false,
          loadingMore: false,
          pageIndex: 1,
          pageSize: 10,
          ...json.Result,
          commentList: result.Result,
          isSelf: this.state.isSelf
        });
        if (Platform.OS === 'android') {
          DeviceEventEmitter.emit('announcementHasRead', {message: '公告已阅读', data: this.state.PostType - 1});
        }
      }, (error)=> {
        this.setState({refreshing: false});
      }));
    }, (error)=> {
      this.setState({refreshing: false});
    }));
  }

  _loadMoreData() {
    console.log('加载更多');
    this.setState({loadingMore: true});
    const {dispatch} = this.props;
    this.state.pageIndex += 1;
    let params = {
      postId: this.state.Id,
      pageIndex: this.state.pageIndex,
      pageSize: 10,
      ...tmpGlobal.currentLocation
    };
    dispatch(HomeActions.getCommentList(params, (json)=> {
      lastCount = json.Result.length;
      this.state.commentList = this.state.commentList.concat(json.Result);
      this.setState({
        ...this.state.commentList,
        refreshing: false,
        loadingMore: false
      })
    }, (error)=> {

    }));
  }

  //弹出顶一下提示框
  _goreAlert() {
    Alert.alert('提示', '顶一下,在广场的时间可以加一天哦,取消则不加天数', [
      {text: '确定', onPress: () => this._gore()},
      {
        text: '取消', onPress: () => {
      }
      }
    ]);
  }

  //顶一下操作
  _gore() {
    const {dispatch}=this.props;
    let data = {
      PostId: this.state.Id
    };
    dispatch(HomeActions.gore(data, (json)=> {
      toastShort('置顶成功');
    }, (error)=> {
    }));
  }

  //判断此公告是否是当前用户所发,来决定是否显示"顶一下"按钮
  renderGore() {
    if (this.state.isSelf) {
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}
          onPress={()=> {
            this._goreAlert()
          }}>
          <Text style={styles.goreBtn}>{'顶一下'}</Text>
        </TouchableOpacity>
      )
    } else {
      return null;
    }
  }

  //处理距离
  _distance(data) {
    return (parseFloat(data) / 1000).toFixed(2);
  }

  //处理到期日期
  _expirationDate(data) {
    return data.split("T")[0];
  }

  //处理回复日期
  _createTime(data) {
    let tmpTime = data.split('T')[1];
    return data.split('T')[0] + ' ' + tmpTime.split('.')[0];
  }

  //渲染聚会人数
  renderNumberOfPeople(data) {
    let index = DICT.numberOfPeople.findIndex((item)=> {
      return item.Key === data;
    });
    return (
      <Text>{DICT.numberOfPeople[index].Value}</Text>
    );
  }

  //渲染聚会费用
  renderCostText(data) {
    let index = DICT.cost.findIndex((item)=> {
      return item.Key === data;
    });
    return (
      <Text>{DICT.cost[index].Value}</Text>
    );
  }

  //渲染公告中的图片
  renderPostImage(arr) {
    if (arr.length !== 0) {
      let imageWidth = 0;
      if (arr.length % 3 === 0) {
        imageWidth = (width - 60) / 3;
      } else if (arr.length === 2) {
        imageWidth = (width - 50) / 2;
      } else {
        imageWidth = (width - 60) / 3;
      }
      return arr.map((item, index)=> {
        return (
          <Image
            key={index}
            onLoadEnd={()=> {
              this.setState({imgLoading: false})
            }}
            style={{width: imageWidth, height: imageWidth, marginBottom: 10, marginRight: 10}}
            source={{uri: URL_DEV + '/' + item}}>
            {this.state.imgLoading ?
              <Image
                source={require('./img/imgLoading.gif')}
                style={{width: imageWidth, height: imageWidth, marginBottom: 10, marginRight: 10}}/> : null}
          </Image>
        )
      })
    } else {
      return null;
    }
  }

  renderRowData(rowData) {
    return (
      <View
        key={rowData.Id}
        style={styles.commentCard}>
        <View style={styles.cardLeft}>
          <TouchableOpacity
            onPress={()=> {
              this._goUserInfo(rowData.CommentUserInfo)
            }}>
            <Image
              onLoadEnd={()=> {
                this.setState({avatarLoading: false})
              }}
              source={{uri: URL_DEV + rowData.CommentUserInfo.PrimaryPhotoFilename}}
              style={styles.commentImg}>
              {this.state.avatarLoading ?
                <Image
                  source={require('./img/imgLoading.gif')}
                  style={styles.commentImg}/> : null}
            </Image>
          </TouchableOpacity>
          <View style={styles.commentArea}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  numberOfLines={1}
                  style={styles.nameText}>{rowData.CommentUserInfo.Nickname}</Text>
                <View
                  style={[styles.userInfoLabel, styles.commentName, this._renderGenderStyle(rowData.CommentUserInfo.Gender)]}>
                  <Icon
                    name={rowData.CommentUserInfo.Gender ? 'mars-stroke' : 'venus'}
                    size={12}
                    style={styles.userInfoIcon}/>
                  <Text style={styles.userInfoText}>{rowData.CommentUserInfo.Age}{'岁'}</Text>
                </View>
              </View>
            </View>
            <View>
              <TouchableOpacity
                onPress={()=> {
                  this._showCommentInput(rowData.Id, rowData);
                }}
                style={styles.commentContent}>
                <Text>{rowData.ForCommentUserNickname !== null ? `回复${rowData.ForCommentUserNickname}: ` : ''}{rowData.CommentContent}</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Text>{this._distance(rowData.CommentUserInfo.Distance)}{'km'}</Text>
              <Text>{this._createTime(rowData.CreateTime)}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  //渲染聚会选项(约会没有这个)
  renderPartyOptions(data) {
    if (data === 1) {
      return (
        <View style={styles.partyOptionsContainer}>
          <View style={styles.partyOptionsRow}>
            <Text style={styles.partyLabel}>{'聚会人数:'}</Text>
            {this.renderNumberOfPeople(this.state.PartyPeopleNumber)}
          </View>
          <View style={styles.partyOptionsRow}>
            <Text style={styles.partyLabel}>{'聚会费用:'}</Text>
            {this.renderCostText(this.state.PartyPayType)}
          </View>
        </View>
      )
    } else {
      return null;
    }
  }

  _renderHeader() {
    if (!this.state.PosterInfo) {
      return null
    }
    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={()=> {
            this._goUserInfo(this.state.PosterInfo);
          }}>
          <View style={styles.cardRow}>
            <Image
              source={{uri: URL_DEV + this.state.PosterInfo.PrimaryPhotoFilename}}
              style={styles.avatarImg}/>
            <View style={styles.userInfo}>
              <View style={styles.nameTextContainer}>
                <Text
                  numberOfLines={1}
                  style={styles.nameText}>{this.state.PosterInfo.Nickname}</Text>
                <Text style={styles.timeText}>{this.state.CreateTimeDescription}</Text>
              </View>
              <View style={styles.userInfoLabelContainer}>
                <View style={[styles.userInfoLabel, this._renderGenderStyle(this.state.PosterInfo.Gender)]}>
                  <Icon
                    name={this.state.PosterInfo.Gender ? 'mars-stroke' : 'venus'}
                    size={10}
                    style={styles.userInfoIcon}/>
                  <Text style={styles.userInfoText}>{this.state.PosterInfo.Age}{'岁'}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.moodView}>
          <Text style={styles.moodText}>{this.state.PostContent}</Text>
          <TouchableOpacity
            style={styles.postImage}
            onPress={()=> {
              this._openImgModal(this.state.PicList)
            }}>
            {this.renderPostImage(this.state.PicList)}
          </TouchableOpacity>
          {this.renderPartyOptions(this.state.PostType)}
        </View>
        <View style={styles.cardRow}>
          <Text>{this._distance(this.state.Distance)}{'km'}{'·'}</Text>
          <Text>{this.state.LikeCount}{'赞'}{'·'}</Text>
          <Text>{this.state.CommentCount}{'评论'}{'·'}</Text>
          <Text>{this.state.ViewCount}{'阅读'}</Text>
          {this.renderGore()}
        </View>
        <View style={styles.cardRow}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.cardBtn}
            onPress={()=> {
              this._doLike(this.state.Id, this.state.AmILikeIt)
            }}>
            <Icon name={this.state.AmILikeIt === null ? 'thumbs-o-up' : 'thumbs-up'} size={20} color={'#1496ea'}/>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.cardBtn}
            onPress={()=> {
              this._showCommentInput(this.state.Id, null)
            }}>
            <Icon name="comments-o" size={20}/>
          </TouchableOpacity>
          <View style={{flex: 1, marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Text>{'公告到期时间:'}{this._expirationDate(this.state.ExpirationDate)}</Text>
          </View>
        </View>
      </View>
    )
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

  _renderFooter() {
    if (this.state.loadingMore) {
      //这里会显示正在加载更多,但在屏幕下方,需要向上滑动显示(自动或手动),加载指示器,阻止了用户的滑动操作,后期可以让页面自动上滑,显示出这个组件。
      return <LoadMoreFooter />
    }

    if (lastCount < this.state.commentList.length) {
      return (<LoadMoreFooter isLoadAll={true}/>);
    }

    if (!lastCount) {
      return null;
    }
  }

  renderCommentList() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        onScroll={()=> {
          this._closeCommentInput()
        }}
        style={styles.listView}
        dataSource={ds.cloneWithRows(this.state.commentList)}
        renderRow={
          this.renderRowData.bind(this)
        }
        onEndReached={this._toEnd.bind(this)}
        renderFooter={
          this._renderFooter.bind(this)
        }
        renderHeader={
          this._renderHeader.bind(this)
        }
        enableEmptySections={true}
        onEndReachedThreshold={10}
        initialListSize={3}
        pageSize={3}/>
    )
  }

  _resetScrollTo() {
    Animated.timing(
      this.state.viewMarginBottom,
      {
        toValue: 0,
        duration: 100,
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
                height: 40,
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: 4,
                paddingHorizontal: 10
              }, {
                height: Math.max(40, this.state.commentInputHeight)
              }]}
              underlineColorAndroid={'transparent'}
              placeholder={'请输入回复'}
              maxLength={50}
              onBlur={()=> {
                this._resetScrollTo()
              }}
              onChange={(event)=> {
                this._handleInputHeight(event)
              }}
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

  renderBody() {
    return (
      <View
        ref={'root'}
        style={styles.container}>
        {this.renderCommentList()}
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
            })
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

}

export default connect((state)=> {
  return {
    ...state
  }
})(AnnouncementDetail)