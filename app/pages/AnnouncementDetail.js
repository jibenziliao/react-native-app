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
  Alert
} from 'react-native'
import {connect} from 'react-redux'
import {componentStyles} from '../style'
import BaseComponent from '../base/BaseComponent'
import * as HomeActions from '../actions/Home'
import Modal from 'react-native-modalbox'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Button as NBButton} from 'native-base'
import LoadMoreFooter from '../components/LoadMoreFooter'
import UserInfo from '../pages/UserInfo'
import {toastShort} from '../utils/ToastUtil'
import Addannouncement from '../pages/Addannouncement'
import {URL_DEV, TIME_OUT} from '../constants/Constant'
import ActionSheet from 'react-native-actionsheet'

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
    marginBottom:5,
    marginHorizontal: 10,
    paddingVertical:10
  },
  cardRow: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal:10
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
  commentName: {
    marginLeft: 10
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
  postImage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingVertical: 5,
    justifyContent: 'flex-start',
    paddingLeft:10
  },
  moodText: {
    fontSize: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    paddingHorizontal:10
  },
  cardBtn: {
    marginTop: 10,
    marginRight: 20
  },
  commentCard: {
    padding: 10,
    marginBottom:5,
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
  }
});

let lastCount;
let navigator;

const buttons = ['取消', '发布新公告', '删除'];
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 1;

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
      ...this.props.route.params
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

  componentWillUnmount() {
    clearTimeout(this.deleteTimer);
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
        toastShort('删除成功');
        this.deleteTimer = setTimeout(()=> {
          navigator.pop();
          this.state.callBack();
        }, 1000);
      }, (error)=> {
      }));
    } else if (index === 1) {
      navigator.push({
        component: Addannouncement,
        name: 'Addannouncement',
        params: {
          myLocation: this.state.myLocation,
          myUserId:this.state.CreaterId,
          callBack: this.state.callBack,
          Nickname:this.state.PosterInfo.Nickname
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
      this.setState({AmIFollowedHim: !this.state.AmIFollowedHim});
    }, (error)=> {
    }))
  }

  //点击头像和名字,跳转个人信息详情页
  _goUserInfo(data) {
    const {dispatch}=this.props;
    let params = {
      UserId: data.UserId,
      ...this.state.myLocation
    };
    dispatch(HomeActions.getUserInfo(params, (json)=> {
      dispatch(HomeActions.getUserPhotos({UserId: data.UserId}, (result)=> {
        navigator.push({
          component: UserInfo,
          name: 'UserInfo',
          params: {
            Nickname: data.Nickname,
            UserId: data.UserId,
            myUserId: this.state.myUserId,
            ...json.Result,
            userPhotos: result.Result,
            myLocation: this.state.myLocation,
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
    this.refs.commentInputBox.open();
  }

  //点赞和取消赞isLike都传true
  _doLike(id, isLike) {
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
    //关闭评论输入框
    this.refs.commentInputBox.close();
    //发送评论,并给当前广告评论数加一
    const {dispatch}=this.props;
    let data = {
      postId: this.state.Id,
      forCommentId: this.state.forCommentId,
      comment: this.state.comment
    };
    this.state.CommentCount += 1;

    let params = {
      postId: this.state.Id,
      pageIndex: 1,
      pageSize: 10,
      ...this.state.myLocation
    };
    dispatch(HomeActions.comment(data, (json)=> {
      dispatch(HomeActions.getCommentList(params, (json)=> {
        this.setState({
          CommentCount: this.state.CommentCount,
          comment: '',//评论成功后需要清空评论框内容
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
      ...this.state.myLocation
    };
    let params = {
      postId: this.state.Id,
      pageIndex: 1,
      pageSize: 10,
      Lat: this.state.Lat,
      Lng: this.state.Lng
    };
    dispatch(HomeActions.getAnnouncementDetail(data, (json)=> {
      dispatch(HomeActions.getCommentList(params, (result)=> {
        this.setState({
          comment: '',
          commentUser: '',
          forCommentId: null,
          refreshing: false,
          loadingMore: false,
          pageIndex: 1,
          pageSize: 10,
          callBack: this.state.callBack,
          ...json.Result,
          myLocation: this.state.myLocation,
          myUserId: this.state.myUserId,
          commentList: result.Result,
          isSelf: this.state.isSelf
        });
      }, (error)=> {
      }));
    }, (error)=> {
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
      ...this.state.myLocation
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
          <Text>{'顶一下'}</Text>
        </TouchableOpacity>
      )
    } else {
      return null;
    }
  }

  //处理距离
  _distance(data) {
    return (parseFloat(data)/1000).toFixed(2);
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

  //渲染公告中的图片
  renderPostImage(arr) {
    if (arr.length !== 0) {
      let imageWidth = 0;
      if (arr.length % 3 === 0) {
        imageWidth = (width - 60) / 3;
      } else if (arr.length % 2 === 0) {
        imageWidth = (width - 50) / 2;
      } else if (arr.length === 1) {
        imageWidth = width - 40;
      } else {
        imageWidth = (width - 60) / 3;
      }
      return arr.map((item, index)=> {
        return (
          <Image
            key={index}
            style={{width: imageWidth, height: imageWidth, marginBottom: 10,marginRight:10}}
            source={{uri: URL_DEV + '/' + item}}/>
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
          onPress={()=>{
            this._goUserInfo(rowData.CommentUserInfo)
          }}>
            <Image source={{uri: URL_DEV+rowData.CommentUserInfo.PrimaryPhotoFilename}}
                   style={styles.commentImg}/>
          </TouchableOpacity>
          <View style={styles.commentArea}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text>{rowData.CommentUserInfo.Nickname}</Text>
                <View
                  style={[styles.userInfoLabel, styles.commentName, this._renderGenderStyle(rowData.CommentUserInfo.Gender)]}>
                  <Icon
                    name={rowData.CommentUserInfo.Gender ? 'mars-stroke' : 'venus'}
                    size={12}
                    style={styles.userInfoIcon}/>
                  <Text style={styles.userInfoText}>{rowData.CommentUserInfo.Age}{'岁'}</Text>
                </View>
              </View>
              <Text>{this._createTime(rowData.CreateTime)}</Text>
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
            <View>
              <Text>{this._distance(rowData.CommentUserInfo.Distance)}{'km'}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  _renderHeader() {
    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={()=> {
            this._goUserInfo(this.state.PosterInfo);
          }}>
          <View style={styles.cardRow}>
            <View style={styles.cardLeft}>
              <Image source={{uri: URL_DEV+this.state.PosterInfo.PrimaryPhotoFilename}}
                     style={styles.avatarImg}/>
              <View style={styles.userInfo}>
                <Text>{this.state.PosterInfo.Nickname}</Text>
                <View style={[styles.userInfoLabel, this._renderGenderStyle(this.state.PosterInfo.Gender)]}>
                  <Icon
                    name={this.state.PosterInfo.Gender ? 'mars-stroke' : 'venus'}
                    size={12}
                    style={styles.userInfoIcon}/>
                  <Text style={styles.userInfoText}>{this.state.PosterInfo.Age}{'岁'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.cardRight}>
              <Text>{this.state.CreateTimeDescription}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.moodView}>
          <Text style={styles.moodText}>{this.state.PostContent}</Text>
          <View style={styles.postImage}>
            {this.renderPostImage(this.state.PicList)}
          </View>
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

  renderBody() {
    return (
      <View style={styles.container}>
        {this.renderCommentList()}
        <ActionSheet
          ref={(o) => this.ActionSheet = o}
          title="请选择你的操作"
          options={buttons}
          cancelButtonIndex={CANCEL_INDEX}
          destructiveButtonIndex={DESTRUCTIVE_INDEX}
          onPress={this._actionSheetPress.bind(this)}
        />
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
              placeholder={`输入评论/回复${this.state.commentUser}:`}
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

}
export default connect((state)=> {
  return {
    ...state
  }
})(AnnouncementDetail)