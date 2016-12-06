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
import BaseComponent from '../base/BaseComponent'
import {Button as NBButton} from 'native-base'
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
import {URL_DEV, TIME_OUT} from '../constants/Constant'

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
    fontSize: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  postImage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingVertical: 5,
    justifyContent: 'space-between'
  },
  cardBtn: {
    marginTop: 10,
    marginRight: 20
  }
});

const {height, width} = Dimensions.get('window');

let navigator;
let currentLocation = {};
let commentId;
let lastCount;
let currentUser;

class Home extends BaseComponent {
  constructor(props) {
    super(props);
    navigator = this.props.navigator;
    this.state = {
      refreshing: false,
      loadingMore: false,
      pageSize: 10,
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
      if (response !== null) {
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
          });
          this._getCurrentUserProfile();
        }, (error)=> {

        }));
      }
    }, (error)=> {
      console.log('读取缓存出错!', error);
    });
  }

  //处理距离
  _distance(data) {
    data = data + '';
    if (data.indexOf('.') > -1 && data.length - 3 > data.indexOf(".")) {
      return data.substr(0, data.indexOf(".") + 3);
    } else {
      return data
    }
  }

  //获取当前登录的用户信息
  _getCurrentUserProfile() {
    const {dispatch}=this.props;
    dispatch(HomeActions.getCurrentUserProfile('', (json)=> {
      currentUser = json.Result;
      Storage.setItem('userInfo', currentUser);
    }, (error)=> {

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

    if (lastCount < this.state.pageSize) {
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

  //获取用户是否存在未过期的动态
  onRightPressed() {
    const {dispatch}=this.props;
    dispatch(HomeActions.newPost('', (json)=> {
      this._publicAnnouncement(json, dispatch);
    }, (error)=> {
    }));
  }

  //跳转发布公告(查看公告)页面
  _publicAnnouncement(json, dispatch) {
    if (json.Code == 'OK' && json.Result.DoIHaveANotExpiredPost) {
      let params = {
        postId: json.Result.PostInfo.Id,
        pageIndex: 1,
        pageSize: 10,
        ...currentLocation
      };
      //这里获取当前用户发布的最新的一条没有过期的动态
      dispatch(HomeActions.getCommentList(params, (result)=> {
        navigator.push({
          component: AnnouncementDetail,
          name: 'AnnouncementDetail',
          params: {
            ...json.Result.PostInfo,
            myLocation: currentLocation,
            commentList: result.Result,
            pageIndex: 1,
            pageSize: 10,
            isSelf: true,
            callBack: ()=> {
              this._onRefresh()
            }
          }
        })
      }, (error)=> {
      }))
    } else {
      navigator.push({
        component: Addannouncement,
        name: 'Addannouncement',
        params: {
          myLocation: currentLocation,
          callBack: ()=> {
            this._onRefresh()
          }
        }
      })
    }
  }

  //点击头像和名字,跳转个人信息详情页
  _goUserInfo(data) {
    const {dispatch}=this.props;
    let params = {
      UserId: data.UserId,
      ...currentLocation
    };
    dispatch(HomeActions.getUserInfo(params, (json)=> {
      dispatch(HomeActions.getUserPhotos({UserId: data.UserId}, (result)=> {
        navigator.push({
          component: UserInfo,
          name: 'UserInfo',
          params: {
            Nickname: data.Nickname,
            UserId:data.UserId,
            myUserId:currentUser.UserId,
            ...json.Result,
            userPhotos: result.Result,
            myLocation: currentLocation
          }
        });
      }, (error)=> {
      }));
    }, (error)=> {
    }));
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

  //前往公告详情(先判断是否是本人发布的动态,然后获取公告详情和评论列表)
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
      Lat: rowData.Lat,
      Lng: rowData.Lng
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
            myLocation: currentLocation,
            commentList: result.Result,
            myUserId:currentUser.UserId,
            isSelf: currentUser.UserId === rowData.CreaterId,
            callBack: ()=> {
              this._onRefresh()
            }
          }
        })
      }, (error)=> {
      }));
    }, (error)=> {
    }));
  }

  //渲染公告中的图片
  renderPostImage(arr) {
    if (arr.length !== 0) {
      return arr.map((item, index)=> {
        return (
          <Image
            key={index}
            style={{width: 80, height: 80, marginBottom: 5, marginRight: 5}}
            source={{uri: URL_DEV + '/' + item}}/>
        )
      })
    } else {
      return null;
    }
  }

  renderRowData(rowData) {
    return (
      <View key={rowData.PosterInfo.UserId}
            style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={()=> {
            this._goUserInfo(rowData.PosterInfo)
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
          style={styles.moodView}
          onPress={()=> {
            this._goAnnouncementDetail(rowData)
          }}>
          <Text style={styles.moodText}>{rowData.PostContent}</Text>
          <View style={styles.postImage}>
            {this.renderPostImage(rowData.PicList)}
          </View>
        </TouchableOpacity>
        <View style={styles.cardRow}>
          <Text>{this._distance(rowData.Distance)}{'km'}{'·'}</Text>
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
          pageSize={this.state.pageSize}/>
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