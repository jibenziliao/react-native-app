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
  Dimensions
} from 'react-native'
import {getNavigator} from '../navigation/Route'
import BaseComponent from '../base/BaseComponent'
import Button from 'react-native-button'
import {Button as NBButton} from 'native-base'
import {StyleConfig, CommonStyles, componentStyles} from '../style'
import RNPicker from 'react-native-picker'
import BackgroundTimer from 'react-native-background-timer'
import Icon from 'react-native-vector-icons/FontAwesome'
import {connect} from 'react-redux'
import * as HomeActions from '../actions/Home'
import Spinner from '../components/Spinner'
import LoadMoreFooter from '../components/LoadMoreFooter'
import Modal from 'react-native-modalbox'
import * as Storage from '../utils/Storage'
import AnnouncementDetail from '../pages/AnnouncementDetail'
import Addannouncement from '../pages/Addannouncement'
import UserInfo from '../pages/UserInfo'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
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
    padding: 10,
    backgroundColor: '#FFF',
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10
  },
  cardRow: {
    flexDirection: 'row',
    flex: 1
  },
  cardLeft: {
    flexDirection: 'row',
    flex: 1
  },
  cardRight: {
    flexDirection: 'row'
  },
  avatarImg: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 8
  },
  userInfo: {
    justifyContent: 'space-between',
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
    fontSize: 14,
    color: '#FFF'
  },
  moodView: {
    marginVertical: 20
  },
  moodText: {
    fontSize: 16
  },
  cardBtn: {
    marginTop: 10,
    marginRight: 20
  }
});

const listViewData = [
  {
    avatarUrl: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
    userId: 110,
    userName: '张三',
    age: 23,
    gender: 1,
    text: 'hello world',
    distance: '3.9',
    second: 19,
    comment: 8,
    read: 10
  },
  {
    avatarUrl: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
    userId: 111,
    userName: '李四',
    age: 23,
    gender: 1,
    text: 'hello world',
    distance: '3.9',
    second: 19,
    comment: 8,
    read: 10
  },
  {
    avatarUrl: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
    userId: 112,
    userName: '李四',
    age: 23,
    gender: 1,
    text: 'hello world',
    distance: '3.9',
    second: 19,
    comment: 8,
    read: 10
  },
  {
    avatarUrl: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
    userId: 113,
    userName: '李四',
    age: 23,
    gender: 1,
    text: 'hello world',
    distance: '3.9',
    second: 19,
    comment: 8,
    read: 10
  },
  {
    avatarUrl: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
    userId: 114,
    userName: '李四',
    age: 23,
    gender: 1,
    text: 'hello world',
    distance: '3.9',
    second: 19,
    comment: 8,
    read: 10
  },
  {
    avatarUrl: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
    userId: 115,
    userName: '李四',
    age: 23,
    gender: 1,
    text: 'hello world',
    distance: '3.9',
    second: 19,
    comment: 8,
    read: 10
  }
];

const {height, width} = Dimensions.get('window');

let navigator;
let currentLocation = {};
let commentId;
let lastCount;

class Home extends BaseComponent {
  constructor(props) {
    super(props);
    navigator = this.props.navigator;
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      dataSource: ds.cloneWithRows(listViewData),
      refreshing: false,
      loadingMore: false,
      pageSize: 3,
      pageIndex: 1,
      postList: [],
      comment: '',
      commentModalOpen: false
    };
  }

  componentWillMount() {
    const {dispatch}=this.props;
    let data = {
      pageSize: this.state.pageSize,
      pageIndex: this.state.pageIndex
    };
    Storage.getItem('currentLocation').then((response)=> {
      if (response != null) {
        data = {
          ...data,
          ...response
        };
        currentLocation = {
          ...response
        };
        dispatch(HomeActions.getPostList(data, (json)=> {
          lastCount = json.Result.length;
          this.setState({
            postList: json.Result
          })
        }, (error)=> {

        }));
      }
    }, (error)=> {
      console.log('读取缓存出错!', error);
    });
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
    const data = {
      pageSize: this.state.pageSize,
      pageIndex: this.state.pageIndex,
      ...currentLocation
    };
    dispatch(HomeActions.getPostList(data, (json)=> {
      lastCount = json.Result.length;
      this.state.postList = this.state.postList.concat(json.Result);
      this.setState({
        ...this.state.postList,
        refreshing: false,
        loadingMore: false
      })
    }, (error)=> {

    }));
  }

  _onRefresh() {
    const {dispatch}=this.props;
    this.setState({refreshing: true, pageIndex: 1});
    const data = {
      pageSize: this.state.pageSize,
      pageIndex: 1,
      ...currentLocation
    };
    dispatch(HomeActions.getPostList(data, (json)=> {
      lastCount = json.Result.length;
      this.setState({
        postList: json.Result,
        refreshing: false
      })
    }, (error)=> {

    }));
  }

  _renderFooter() {
    if (this.state.loadingMore) {
      //这里会显示正在加载更多,但在屏幕下方,需要向上滑动显示(自动或手动),加载指示器,阻止了用户的滑动操作,后期可以让页面自动上滑,显示出这个组件。
      return <LoadMoreFooter />
    }

    if (lastCount < this.state.postList.length) {
      return (<LoadMoreFooter isLoadAll={true}/>);
    }

    if (!lastCount) {
      return null;
    }
  }

  componentWillUnmount() {
    //BackgroundTimer.clearTimeout(this.timer);
  }

  getNavigationBarProps() {
    return {
      title: '广场',
      hideLeftButton: true,
      hideRightButton: false,
      rightIcon: {
        name: 'plus'
      },
    };
  }

  //跳转发布公告页面
  onRightPressed() {
    console.log('这是继承后的方法');
    const{dispatch}=this.props;
    dispatch(HomeActions.newPost('',(json)=>{
      console.log(json);
      if(json.Code=='OK' && json.Result.DoIHaveANotExpiredPost){
        //这里获取当前用户发布的最新的一条没有过期的动态
      }
    },(error)=>{}));

    /*navigator.push({
      component: Addannouncement,
      name: 'Addannouncement',
      params:{
        myLocation:currentLocation
      }
    })*/
  }

  //点击头像和名字,跳转个人信息详情页
  _goUserInfo(id){
    const {dispatch}=this.props;
    dispatch(HomeActions.getUserInfo({UserId:id},(json)=>{
      navigator.push({
        component: UserInfo,
        name: 'UserInfo',
        params: {
          ...json.Result,
          myLocation: currentLocation
        }
      });
    },(error)=>{}));
  }

  //点赞/取消赞(不论是否已赞,点赞取消赞,isLike都传true,isLike可能的值null,true,false)
  _doLike(id, isLike) {
    const {dispatch}=this.props;
    let index = this.state.postList.findIndex((item)=> {
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
    dispatch(HomeActions.like(data, (json)=> {
      this.setState({
        postList: [
          ...this.state.postList
        ]
      });
    }, (error)=> {
    }));
  }

  _showCommentInput(id) {
    //保存当前要评论的广告id
    commentId = id;
    this.refs.commentInputBox.open();
  }

  _renderGenderStyle(gender) {
    return {
      backgroundColor: gender ? '#1496ea' : 'pink',
      borderColor: gender ? '#1496ea' : 'pink',
    }
  }

  //前往公告详情(需要先获取公告详情和评论列表)
  _goAnnouncementDetail(rowData) {
    const {dispatch}=this.props;
    const data = {
      postId: rowData.Id,
      ...currentLocation
    };
    let params = {
      postId: rowData.Id,
      pageIndex: 1,
      pageSize: 10,
      Lat:rowData.Lat,
      Lng:rowData.Lng
    };
    dispatch(HomeActions.getAnnouncementDetail(data, (json)=> {
      dispatch(HomeActions.getCommentList(params, (result)=> {
        navigator.push({
          component: AnnouncementDetail,
          name: 'AnnouncementDetail',
          params: {
            pageIndex: 1,
            pageSize: 10,
            ...json.Result,
            myLocation: {...currentLocation},
            commentList: result.Result
          }
        })
      }, (error)=> {
      }));
    }, (error)=> {
    }));
  }

  renderRowData(rowData) {
    return (
      <View key={rowData.PosterInfo.UserId}
            style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={()=> {
            this._goUserInfo(rowData.PosterInfo.UserId)
          }}>
          <View style={styles.cardRow}>
            <View style={styles.cardLeft}>
              <Image source={{uri: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg'}}
                     style={styles.avatarImg}/>
              <View style={styles.userInfo}>
                <Text>{rowData.PosterInfo.Nickname}</Text>
                <View style={{flex: 1}}>
                  <View style={[styles.userInfoLabel, this._renderGenderStyle(rowData.PosterInfo.Gender)]}>
                    <Icon
                      name={rowData.PosterInfo.Gender ? 'mars-stroke' : 'venus'}
                      size={12}
                      style={styles.userInfoIcon}/>
                    <Text style={styles.userInfoText}>{rowData.PosterInfo.Age}{'岁'}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.cardRight}>
              <Text>{rowData.CreateTimeDescription}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cardRow, styles.moodView]}
          onPress={()=> {
            this._goAnnouncementDetail(rowData)
          }}>
          <Text style={styles.moodText}>{rowData.PostContent}</Text>
        </TouchableOpacity>
        <View style={styles.cardRow}>
          <Text>{rowData.Distance}{'km'}{'·'}</Text>
          <Text>{rowData.LikeCount}{'赞'}{'·'}</Text>
          <Text>{rowData.CommentCount}{'评论'}{'·'}</Text>
          <Text>{rowData.ViewCount}{'阅读'}</Text>
        </View>
        <View style={styles.cardRow}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.cardBtn}
            onPress={()=> {
              this._doLike(rowData.Id, rowData.AmILikeIt)
            }}>
            <Icon name={rowData.AmILikeIt === null ? 'thumbs-o-up' : 'thumbs-up'} size={20} color={'#1496ea'}/>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.cardBtn}
            onPress={()=> {
              this._showCommentInput(rowData.Id)
            }}>
            <Icon name="comments-o" size={20}/>
          </TouchableOpacity>
        </View>
      </View>
    )
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
          style={styles.listView}
          dataSource={ds.cloneWithRows(postList)}
          renderRow={
            this.renderRowData.bind(this)
          }
          onEndReached={this._toEnd.bind(this)}
          renderFooter={
            this._renderFooter.bind(this)
          }
          enableEmptySections={true}
          onEndReachedThreshold={10}
          initialListSize={3}
          pageSize={3}/>
      )
    } else {
      return null
    }

  }

  //发送评论
  _sendComment() {
    //关闭评论输入框
    this.refs.commentInputBox.close();
    //发送评论,并给当前广告评论数加一
    const {dispatch}=this.props;
    let data = {
      postId: commentId,
      forCommentId: null,
      comment: this.state.comment
    };

    let index = this.state.postList.findIndex((item)=> {
      return item.Id === commentId;
    });
    this.state.postList[index].CommentCount += 1;

    dispatch(HomeActions.comment(data, (json)=> {
      this.setState({
        postList: [
          ...this.state.postList
        ]
      });
    }, (error)=> {
    }));
    //清空评论输入框内容
    this.setState({comment: ''});
  }

  renderBody() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {this.renderListView(ds, this.state.postList)}
        </View>
        <Modal
          style={{
            backgroundColor: '#E2E2E2',
            height: 60,
            justifyContent: 'center'
          }}
          backdropOpacity={0.5}
          backdropColor={'transparent'}
          swipeToClose={false}
          position={"bottom"}
          backdropPressToClose={true}
          ref={"commentInputBox"}>
          <View style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TextInput
              multiline={false}
              style={{
                height: 40,
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: 4
              }}
              underlineColorAndroid={'transparent'}
              placeholder={'请输入回复'}
              maxLength={50}
              onChangeText={(comment)=>this.setState({comment})}
              value={this.state.comment}/>
            <View>
              <NBButton
                primary
                style={{
                  width: 100,
                  height: 40,
                  marginLeft: 10
                }}
                onPress={()=> {
                  this._sendComment()
                }}>
                发送
              </NBButton>
            </View>
          </View>
        </Modal>
      </View>
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

export default connect((state)=> {
  return {
    ...state,
    result: state.InitialApp.res,
    pendingStatus: state.InitialApp.pending
  }
})(Home)