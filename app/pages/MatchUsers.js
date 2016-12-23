/**
 *
 * @author keyy/1501718947@qq.com 16/12/21 16:36
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ListView,
  RefreshControl,
  InteractionManager
} from 'react-native'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import {URL_DEV, TIME_OUT, URL_WS_DEV} from '../constants/Constant'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as HomeActions from '../actions/Home'
import LoadMoreFooter from '../components/LoadMoreFooter'
import tmpGlobal from '../utils/TmpVairables'
import UserInfo from '../pages/UserInfo'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  listView: {
    flex: 1
  },
  content: {
    flex: 1
  },
  viewContainer: {
    marginTop: 10,
    paddingHorizontal: 10
  },
  card: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingVertical: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    paddingHorizontal: 10
  },
  userInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  userAvatar: {
    borderRadius: width / 12,
    width: width / 6,
    height: width / 6,
    marginRight: 10
  },
  userInfoLabel: {
    paddingHorizontal: 6,
    backgroundColor: 'pink',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'pink',
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
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userSignature: {
    marginTop: 10,
    flex: 1
  }
});

let lastCount;

let navigator;

class MatchUsers extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      pageSize: 10,
      pageIndex: 1,
      refreshing: false,
      loadingMore: false,
    };
    navigator = this.props.navigator;
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=> {
      this._getMatchUserList();
    })
  }

  _getMatchUserList() {
    const {dispatch}=this.props;
    let data = {
      lat: tmpGlobal.currentLocation.Lat,
      lng: tmpGlobal.currentLocation.Lng,
      pageIndex: this.state.pageIndex,
      pageSize: this.state.pageSize
    };
    dispatch(HomeActions.getMatchUsers(data, (json)=> {
      lastCount = json.Result.length;
      this.setState({userList: json.Result});
    }, (error)=> {
    }));
  }

  getNavigationBarProps() {
    return {
      title: '匹配'
    };
  }

  //点击头像和名字,跳转个人信息详情页
  _goUserInfo(data) {
    const {dispatch}=this.props;
    let params = {
      UserId: data.UserId,
      ...tmpGlobal.currentLocation
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
            isSelf: false
          }
        });
      }, (error)=> {
      }));
    }, (error)=> {
    }));
  }

  _toEnd() {
    //如果最后一次请求的数据数量少于每页需要渲染的数量,表明没有更多数据了(在没有更多数据的情况下,暂时不能继续上拉加载更多数据。在实际场景中,这里是可以一直上拉加载更多数据的,便于有即时新数据拉取)
    if (lastCount < this.state.pageSize || this.state.userList.length < this.state.pageSize) {
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
      pageSize: this.state.pageSize,
      pageIndex: 1,
      lat: tmpGlobal.currentLocation.Lat,
      lng: tmpGlobal.currentLocation.Lng
    };
    dispatch(HomeActions.getMatchUsers(data, (json)=> {
      lastCount = json.Result.length;
      this.setState({
        userList: json.Result,
        refreshing: false
      })
    }, (error)=> {
      this.setState({refreshing: false})
    }));
  }

  _loadMoreData() {
    console.log('加载更多');
    this.setState({loadingMore: true});
    const {dispatch} = this.props;
    this.state.pageIndex += 1;
    const data = {
      pageSize: this.state.pageSize,
      pageIndex: this.state.pageIndex,
      lat: tmpGlobal.currentLocation.Lat,
      lng: tmpGlobal.currentLocation.Lng
    };
    dispatch(HomeActions.getMatchUsers(data, (json)=> {
      lastCount = json.Result.length;
      this.state.userList = this.state.userList.concat(json.Result);
      this.setState({
        ...this.state.userList,
        refreshing: false,
        loadingMore: false
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

  _renderGenderStyle(gender) {
    return {
      backgroundColor: gender ? '#1496ea' : 'pink',
      borderColor: gender ? '#1496ea' : 'pink',
    }
  }

  renderRowData(rowData) {
    return (
      <View key={rowData.UserId}
            style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={()=> {
            this._goUserInfo(rowData)
          }}
          style={styles.userInfoContent}>
          <Image
            style={styles.userAvatar}
            source={{uri: URL_DEV + rowData.PrimaryPhotoFilename}}/>
          <View style={styles.userInfo}>
            <View style={styles.itemRow}>
              <Text>{rowData.Nickname}</Text>
              <View style={[styles.userInfoLabel, this._renderGenderStyle(rowData.Gender)]}>
                <Icon
                  name={rowData.Gender ? 'mars-stroke' : 'venus'}
                  size={12}
                  style={styles.userInfoIcon}/>
                <Text style={styles.userInfoIcon}>{rowData.Age}</Text>
              </View>
            </View>
            <View style={[styles.itemRow, styles.userSignature]}>
              <Text>{rowData.PersonSignal ? rowData.PersonSignal : '这家伙很懒,什么也没留下'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderListView(ds, userList) {
    if (userList) {
      return (
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          style={styles.listView}
          dataSource={ds.cloneWithRows(userList)}
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

  renderBody() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {this.renderListView(ds, this.state.userList)}
        </View>
      </View>
    )
  }
}

export default connect((state)=> {
  return {
    ...state
  }
})(MatchUsers)
