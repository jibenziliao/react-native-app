/**
 * 用户的全部动态列表
 * @author keyy/1501718947@qq.com 16/12/5 17:27
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  InteractionManager,
  ScrollView,
  RefreshControl,
  Image,
  ListView,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Platform,
  Keyboard,
  Animated,
  DeviceEventEmitter,
  NativeAppEventEmitter,
  BackAndroid
} from 'react-native'
import {connect} from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import IonIcon from 'react-native-vector-icons/Ionicons'
import {Button as NBButton} from 'native-base'
import BaseComponent from '../base/BaseComponent'
import Spinner from '../components/Spinner'
import LoadMoreFooter from '../components/LoadMoreFooter'
import AnnouncementDetail from '../pages/AnnouncementDetail'
import {URL_DEV} from '../constants/Constant'
import * as HomeActions from '../actions/Home'
import tmpGlobal from '../utils/TmpVairables'
import PhotoScaleViewer from '../components/PhotoScaleViewer'
import ModalBox from 'react-native-modalbox'
import MainContainer from '../containers/MainContainer'
import customTheme from '../themes/MyThemes'
import {ComponentStyles, CommonStyles} from '../style'
import pxToDp from '../utils/PxToDp'
import CacheableImage from 'react-native-cacheable-image'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  listView: {
    flex: 1
  },
  contentTitle: {
    margin: pxToDp(20)
  },
  content: {
    flex: 1
  },
  card: {
    backgroundColor: '#FFF',
    flex: 1,
    marginTop: pxToDp(20),
    marginHorizontal: pxToDp(20),
  },
  cardContainer: {
    paddingVertical: pxToDp(20)
  },
  cardRow: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: pxToDp(20)
  },
  cardLeft: {
    flexDirection: 'row',
    flex: 1
  },
  cardRight: {
    flexDirection: 'row'
  },
  avatarImg: {
    width: pxToDp(80),
    height: pxToDp(80),
    marginRight: pxToDp(20),
    borderRadius: pxToDp(16)
  },
  userInfo: {
    justifyContent: 'space-between',
    flex: 1
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
    fontSize: pxToDp(24),
    justifyContent: 'center'
  },
  userInfoLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  userInfoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: pxToDp(20),
    backgroundColor: 'pink',
    borderWidth: 1,
    borderColor: 'pink',
    paddingHorizontal: pxToDp(12)
  },
  userInfoIcon: {
    marginRight: pxToDp(8),
    color: '#FFF'
  },
  userInfoText: {
    fontSize: pxToDp(20),
    color: '#FFF'
  },
  moodView: {
    marginTop: pxToDp(20)
  },
  moodText: {
    fontSize: pxToDp(32),
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingHorizontal: pxToDp(20),
    marginBottom: pxToDp(20)
  },
  postImage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: pxToDp(20)
  },
  cardBtn: {
    marginTop: pxToDp(20),
    marginRight: pxToDp(40)
  },
  moreImgLabel: {
    position: 'absolute',
    top: pxToDp(8),
    right: pxToDp(8),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    paddingHorizontal: pxToDp(4)
  },
  moreImgIcon: {},
  moreImgText: {
    fontSize: pxToDp(20),
    marginLeft: pxToDp(8)
  },
  singleImgContainer: {
    marginBottom: pxToDp(20),
    marginRight: pxToDp(20)
  },
  closeBtn: {
    position: 'absolute',
    left: pxToDp(40),
    top: pxToDp(40),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: pxToDp(40)
  },
});

let navigator;
let commentId;
let lastCount;
let emitter;

class AnnouncementList extends BaseComponent {

  constructor(props) {
    super(props);
    navigator = this.props.navigator;
    emitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter;
    this.state = {
      refreshing: false,
      loadingMore: false,
      pageSize: 10,
      pageIndex: 1,
      comment: '',
      viewMarginBottom: new Animated.Value(0),
      showCommentInput: false,
      ...this.props.route.params,
      postList: [],
      imgLoading: false,
      avatarLoading: true,
      showIndex: 0,
      imgList: [],
      commentInputHeight: 0
    };
    //console.log(this.props.route.params);
    this.onBackAndroid = this.onBackAndroid.bind(this);
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow.bind(this));
  }

  componentDidMount() {
    this.hasReadListener = emitter.addListener('announcementHasRead', (data) => {
      InteractionManager.runAfterInteractions(() => {
        this._onRefresh();
      });
    });
    this.commentListener = emitter.addListener('announcementHasComment', (data) => {
      InteractionManager.runAfterInteractions(() => {
        this._onRefresh();
      });
    });
    this.hasDeleteListener = emitter.addListener('announcementHasDelete', (data) => {
      InteractionManager.runAfterInteractions(() => {
        this._onRefresh();
      });
    });
    InteractionManager.runAfterInteractions(() => {
      this._getAllAnnouncementList();
    });
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.hasDeleteListener.remove();
    this.hasReadListener.remove();
    this.commentListener.remove();
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
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

  //在历史列表页返回时,直接返回首页(路由栈中可能存在AnnouncementDetail路由,使用pop()会导致路由循环,在删除聚会/约会时,会返回到不存在的页面上)
  onLeftPressed() {
    this._goBack();
  }

  _goBack() {
    let routes = navigator.getCurrentRoutes();
    if (routes[routes.length - 2].name === 'UserInfo') {
      navigator.pop();
    } else {
      navigator.resetTo({
        component: MainContainer,
        name: 'MainContainer'
      });
    }
  }

  onBackAndroid() {
    this._goBack();
  }

  _getAllAnnouncementList() {
    const {dispatch}=this.props;
    let data = {
      targetUserId: this.state.targetUserId,
      pageIndex: 1,
      pageSize: this.state.pageSize,
      ...tmpGlobal.currentLocation,
      postOrderTyp: 3
    };
    dispatch(HomeActions.getAllAnnouncement(data, (json) => {
      lastCount = json.Result.length;
      this.setState({
        postList: json.Result,
        refreshing: false
      })
    }, (error) => {

    }));
  }

  _toEnd() {
    //如果最后一次请求的数据数量少于每页需要渲染的数量,表明没有更多数据了(在没有更多数据的情况下,暂时不能继续上拉加载更多数据。在实际场景中,这里是可以一直上拉加载更多数据的,便于有即时新数据拉取)
    if (lastCount < this.state.pageSize || this.state.postList.length < this.state.pageSize) {
      return false;
    }

    InteractionManager.runAfterInteractions(() => {
      console.log("触发加载更多 toEnd() --> ");
      this._loadMoreData();
    });
  }

  _loadMoreData() {
    console.log('加载更多');
    this.setState({loadingMore: true});
    const {dispatch} = this.props;
    this.state.pageIndex += 1;
    let data = {
      targetUserId: this.state.targetUserId,
      pageIndex: this.state.pageIndex,
      pageSize: this.state.pageSize,
      ...tmpGlobal.currentLocation,
      postOrderTyp: 3
    };
    dispatch(HomeActions.getAllAnnouncement(data, (json) => {
      lastCount = json.Result.length;
      this.state.postList = this.state.postList.concat(json.Result);
      this.setState({
        ...this.state.postList,
        refreshing: false,
        loadingMore: false
      })
    }, (error) => {

    }));
  }

  _onRefresh() {
    const {dispatch}=this.props;
    this.setState({refreshing: true, pageIndex: 1});
    let data = {
      targetUserId: this.state.targetUserId,
      pageIndex: 1,
      pageSize: this.state.pageSize,
      ...tmpGlobal.currentLocation,
      postOrderTyp: 3
    };
    dispatch(HomeActions.getAllAnnouncementQuiet(data, (json) => {
      lastCount = json.Result.length;
      this.setState({
        postList: json.Result,
        refreshing: false
      })
    }, (error) => {
      this.setState({refreshing: false});
    }));
  }

  _renderFooter() {
    if (this.state.loadingMore) {
      //这里会显示正在加载更多,但在屏幕下方,需要向上滑动显示(自动或手动),加载指示器,阻止了用户的滑动操作,后期可以让页面自动上滑,显示出这个组件。
      return <LoadMoreFooter />
    }

    if (lastCount < this.state.pageSize) {
      return (<LoadMoreFooter isLoadAll={true}/>);
    }

    if (!lastCount) {
      return null;
    }
  }

  //点赞/取消赞(不论是否已赞,点赞取消赞,isLike都传true,isLike可能的值null,true,false)
  _doLike(id, isLike) {
    this._closeCommentInput();
    const {dispatch}=this.props;
    let index = this.state.postList.findIndex((item) => {
      return item.Id === id;
    });
    if (isLike === null) {
      this.state.postList[index].LikeCount += 1;
      this.state.postList[index].AmILikeIt = true;
    } else {
      this.state.postList[index].LikeCount -= 1;
      this.state.postList[index].AmILikeIt = null;
    }

    const data = {
      postId: id,
      isLike: true
    };
    dispatch(HomeActions.like(data, (json) => {
      this.setState({
        postList: [
          ...this.state.postList
        ]
      });
    }, (error) => {
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

  _renderGenderStyle(gender) {
    return {
      backgroundColor: gender ? '#1496ea' : 'pink',
      borderColor: gender ? '#1496ea' : 'pink',
    }
  }

  //前往公告详情(先判断是否是本人发布的动态,然后获取公告详情和评论列表)
  _goAnnouncementDetail(rowData) {
    this._closeCommentInput();
    navigator.push({
      component: AnnouncementDetail,
      name: 'AnnouncementDetail',
      params: {
        Id: rowData.Id,
        isSelf: tmpGlobal.currentUser.UserId === rowData.CreaterId,
        PostType: rowData.PostType
      }
    });
  }

  _renderMoreImgLabel(arr, index) {
    if (arr.length > 3 && index === 2) {
      return (
        <View style={styles.moreImgLabel}>
          <Icon
            name={'picture-o'}
            size={pxToDp(20)}/>
          <Text style={styles.moreImgText}>{arr.length}</Text>
        </View>
      )
    } else {
      return null
    }
  }

  //渲染公告中的图片
  renderPostImage(arr) {
    if (arr.length !== 0) {
      let imageWidth = pxToDp(210);
      let arrCopy = JSON.parse(JSON.stringify(arr));
      if (arr.length > 3) {
        arrCopy.splice(3, arr.length - 3);
      }
      return arrCopy.map((item, index) => {
        return (
          <TouchableOpacity
            onPress={() => {
              this._openImgModal(arr)
            }}
            key={index} style={styles.singleImgContainer}>
            <CacheableImage
              onLoadEnd={() => {
                this.setState({imgLoading: false})
              }}
              style={{width: imageWidth, height: imageWidth}}
              source={{uri: URL_DEV + '/' + item}}>
              {this.state.imgLoading ?
                <Image
                  source={require('./img/imgLoading.gif')}
                  style={{width: imageWidth, height: imageWidth}}/> : null}
            </CacheableImage>
            {this._renderMoreImgLabel(arr, index)}
          </TouchableOpacity>
        )
      })
    } else {
      return null;
    }
  }

  renderRowData(rowData) {
    return (
      <TouchableHighlight
        onPress={() => {
          this._goAnnouncementDetail(rowData)
        }}
        key={rowData.PosterInfo.UserId}
        style={styles.card}>
        <View style={[CommonStyles.flex_1, CommonStyles.background_white, styles.cardContainer]}>
          <View style={styles.cardRow}>
            <Image
              onLoadEnd={() => {
                this.setState({avatarLoading: false})
              }}
              source={{uri: URL_DEV + rowData.PosterInfo.PrimaryPhotoFilename}}
              style={styles.avatarImg}>
              {this.state.avatarLoading ?
                <Image
                  source={require('./img/imgLoading.gif')}
                  style={styles.avatarImg}/> : null}
            </Image>
            <View style={styles.userInfo}>
              <View style={styles.nameTextContainer}>
                <Text
                  numberOfLines={1}
                  style={styles.nameText}>{rowData.PosterInfo.Nickname}</Text>
                <Text style={styles.timeText}>{rowData.CreateTimeDescription}</Text>

              </View>
              <View style={styles.userInfoLabelContainer}>
                <View style={[styles.userInfoLabel, this._renderGenderStyle(rowData.PosterInfo.Gender)]}>
                  <Icon
                    name={rowData.PosterInfo.Gender ? 'mars-stroke' : 'venus'}
                    size={pxToDp(20)}
                    style={styles.userInfoIcon}/>
                  <Text style={styles.userInfoText}>{rowData.PosterInfo.Age}{'岁'}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.moodView}>
            <Text
              style={styles.moodText}
              numberOfLines={3}>
              {rowData.PostContent}
            </Text>
            <View style={styles.postImage}>
              {this.renderPostImage(rowData.PicList)}
            </View>
          </View>
          <View style={styles.cardRow}>
            <Text>{rowData.Distance}{'·'}</Text>
            <Text>{rowData.LikeCount}{'赞'}{'·'}</Text>
            <Text>{rowData.CommentCount}{'评论'}{'·'}</Text>
            <Text>{rowData.ViewCount}{'阅读'}</Text>
          </View>
          <View style={styles.cardRow}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.cardBtn}
              onPress={() => {
                this._doLike(rowData.Id, rowData.AmILikeIt)
              }}>
              <Icon
                name={rowData.AmILikeIt === null ? 'thumbs-o-up' : 'thumbs-up'}
                size={pxToDp(40)}
                color={'#1496ea'}/>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.cardBtn}
              onPress={() => {
                this._showCommentInput(rowData.Id)
              }}>
              <Icon
                name="comments-o"
                size={pxToDp(40)}/>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  _openImgModal(arr) {
    let tmpArr = [];
    for (let i = 0; i < arr.length; i++) {
      tmpArr.push(URL_DEV + '/' + arr[i]);
    }
    this.setState({
      imgList: tmpArr
    }, () => {
      this.refs.modalFullScreen.open();
    });
  }

  _closeImgModal() {
    this.refs.modalFullScreen.close();
  }

  renderListView(ds, postList) {
    if (postList) {
      return (
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          onScroll={() => {
            this._closeCommentInput()
          }}
          style={styles.listView}
          dataSource={ds.cloneWithRows(postList)}
          renderRow={
            this.renderRowData.bind(this)
          }
          onEndReached={this._toEnd.bind(this)}
          renderFooter={
            this._renderFooter.bind(this)
          }
          keyboardDismissMode={'interactive'}
          keyboardShouldPersistTaps={true}
          enableEmptySections={true}
          onEndReachedThreshold={10}
          initialListSize={3}
          pageSize={this.state.pageSize}/>
      )
    } else {
      return null
    }
  }

  getNavigationBarProps() {
    return {
      title: this.state.Nickname
    };
  }

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

    let index = this.state.postList.findIndex((item) => {
      return item.Id === commentId;
    });
    this.state.postList[index].CommentCount += 1;

    dispatch(HomeActions.comment(data, (json) => {
      this.setState({
        postList: [
          ...this.state.postList
        ]
      });
    }, (error) => {
    }));
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
      commentInputHeight: Math.min(event.nativeEvent.contentSize.height, pxToDp(160))
    })
  }

  _renderCommentInputBar() {
    if (this.state.showCommentInput) {
      return (
        <Animated.View
          style={{
            flexDirection: 'row',
            padding: pxToDp(20),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F3F3F3',
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
              onBlur={() => {
                this._resetScrollTo()
              }}
              onChange={(event) => {
                this._handleInputHeight(event)
              }}
              onChangeText={(comment) => this.setState({comment})}
              value={this.state.comment}/>
          </View>
          <View>
            <NBButton
              theme={customTheme}
              primary
              small
              style={{
                width: pxToDp(200),
                height: pxToDp(80),
                marginLeft: pxToDp(20)
              }}
              onPress={() => {
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
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View
        ref={'root'}
        style={ComponentStyles.container}>
        <View style={styles.content}>
          {this.renderListView(ds, this.state.postList)}
        </View>
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
          pressHandle={() => {
            console.log('你点击了图片,此方法必须要有,否则不能切换下一张图片')
          }}
          imgList={this.state.imgList}/>
        <TouchableOpacity
          style={[styles.closeBtn]}
          onPress={() => {
            this._closeImgModal()
          }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <IonIcon
              name={'ios-close-outline'}
              size={pxToDp(88)}
              color={'#fff'}
              style={{
                fontWeight: '100'
              }}/>
          </View>
        </TouchableOpacity>
      </ModalBox>
    )
  }

  renderSpinner() {
    if (this.props.pendingStatus) {
      return (
        <Spinner animating={this.props.pendingStatus}/>
      )
    }
  }

}

export default connect((state) => {
  return {
    ...state
  }
})(AnnouncementList)
