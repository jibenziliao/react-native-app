/**
 * 约会列表
 * @author keyy/1501718947@qq.com 17/1/9 15:48
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  ListView,
  ScrollView,
  InteractionManager,
  RefreshControl,
  Image,
  TouchableOpacity,
  Dimensions,
  DeviceEventEmitter,
  Platform,
  Keyboard,
  Animated,
  TouchableHighlight
} from 'react-native'
import {URL_DEV, TIME_OUT} from '../constants/Constant'
import Icon from 'react-native-vector-icons/FontAwesome'
import LoadMoreFooter from '../components/LoadMoreFooter'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  listView: {
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
});

let canLoadMore = false;

class AppointmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgLoading: false,
      avatarLoading: false,
      ...this.props
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      ...nextProps
    })
  }

  //处理距离
  _distance(data) {
    if(data===null){
      return '--';
    }
    return (parseFloat(data) / 1000).toFixed(2);
  }

  _renderGenderStyle(gender) {
    return {
      backgroundColor: gender ? '#1496ea' : 'pink',
      borderColor: gender ? '#1496ea' : 'pink',
    }
  }

  _onRefresh() {
    this.props._onRefresh();
  }

  _closeCommentInput() {
    this.props._closeCommentInput();
  }

  _toEnd() {
    //如果最后一次请求的数据数量少于每页需要渲染的数量,表明没有更多数据了(在没有更多数据的情况下,暂时不能继续上拉加载更多数据。在实际场景中,这里是可以一直上拉加载更多数据的,便于有即时新数据拉取)
    if (!canLoadMore || (this.props.appointmentCount < this.state.appointmentPageSize || this.state.appointmentList.length < this.state.appointmentPageSize)) {
      return false;
    }
    InteractionManager.runAfterInteractions(() => {
      console.log("触发加载更多 toEnd() --> ");
      this.props._loadMoreData();
    });
  }

  _renderFooter() {
    if (this.props.appointmentLoadingMore) {
      //这里会显示正在加载更多,但在屏幕下方,需要向上滑动显示(自动或手动),加载指示器,阻止了用户的滑动操作,后期可以让页面自动上滑,显示出这个组件。
      return <LoadMoreFooter />
    }

    if (this.props.appointmentCount < this.state.appointmentPageSize) {
      return (<LoadMoreFooter isLoadAll={true}/>);
    }

    if (!this.props.appointmentCount) {
      return null;
    }
  }

  _goAnnouncementDetail(rowData) {
    this.props._goAnnouncementDetail(rowData);
  }

  _goUserInfo(data) {
    this.props._goUserInfo(data);
  }

  _renderMoreImgLabel(arr, index) {
    if (arr.length > 3 && index === 2) {
      return (
        <View style={styles.moreImgLabel}>
          <Icon name={'picture-o'} size={10} style={styles.moreImgIcon}/>
          <Text style={styles.moreImgText}>{arr.length}</Text>
        </View>
      )
    } else {
      return null
    }
  }

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
      let arrCopy = JSON.parse(JSON.stringify(arr));
      if (arr.length > 3) {
        arrCopy.splice(3, arr.length - 3);
      }
      return arrCopy.map((item, index)=> {
        return (
          <View key={index} style={styles.singleImgContainer}>
            <Image
              onLoadEnd={()=> {
                this.setState({imgLoading: false})
              }}
              style={{width: imageWidth, height: imageWidth}}
              source={{uri: URL_DEV + '/' + item}}>
              {this.state.imgLoading ?
                <Image
                  source={require('./img/imgLoading.gif')}
                  style={{width: imageWidth, height: imageWidth}}/> : null}
            </Image>
            {this._renderMoreImgLabel(arr, index)}
          </View>
        )
      })
    } else {
      return null;
    }
  }

  _showCommentInput(id) {
    this.props._showCommentInput(id);
  }

  _doLike(id, isLike) {
    this.props._doLike(id, isLike);
  }

  _openImgModal(arr) {
    this.props._openImgModal(arr);
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
            <Image
              onLoadEnd={()=> {
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
                    size={10}
                    style={styles.userInfoIcon}/>
                  <Text style={styles.userInfoText}>{rowData.PosterInfo.Age}{'岁'}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.moodView}
          onPress={()=> {
            this._goAnnouncementDetail(rowData)
          }}>
          <Text
            style={styles.moodText}
            numberOfLines={2}>
            {rowData.PostContent}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.postImage}
          onPress={()=> {
            this._openImgModal(rowData.PicList)
          }}>
          {this.renderPostImage(rowData.PicList)}
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

  render() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    if (this.props.appointmentList.length === 0) {
      return null;
    } else {

      return (
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.props.appointmentRefreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          onScroll={()=> {
            canLoadMore = true;
            this._closeCommentInput()
          }}
          style={styles.listView}
          dataSource={ds.cloneWithRows(this.props.appointmentList)}
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
          pageSize={this.props.appointmentPageSize}/>
      )
    }
  }
}

export default AppointmentList
