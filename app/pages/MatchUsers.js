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
  TouchableHighlight,
  Dimensions,
  ListView,
  RefreshControl,
  InteractionManager,
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import {URL_DEV, LOCATION_TIME_OUT} from '../constants/Constant'
import Icon from 'react-native-vector-icons/FontAwesome'
import * as HomeActions from '../actions/Home'
import LoadMoreFooter from '../components/LoadMoreFooter'
import tmpGlobal from '../utils/TmpVairables'
import UserInfo from '../pages/UserInfo'
import * as VicinityActions from '../actions/Vicinity'
import Spinner from '../components/Spinner'

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
  gpsTips: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,0,0.7)',
    padding: 10
  },
  tipsContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tipsText: {
    fontSize: 12,
    textAlign: 'center',
    flex: 1,
    flexWrap:'wrap'
  },
  viewContainer: {
    marginTop: 10,
    paddingHorizontal: 10
  },
  card: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingVertical: 10,
    borderBottomColor: '#cec5c5',
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
    color: '#FFF',
    fontSize: 10
  },
  userInfoText: {
    fontSize: 14,
    color: '#FFF'
  },
  userInfo: {
    flex: 1
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  nameText: {
    flexWrap: 'nowrap',
    overflow: 'hidden',
    flex: 1
  },
  userSignature: {
    marginTop: 10,
    flex: 1
  },
  signatureContent: {
    flex: 1
  }
});

let lastCount;

let pageNavigator;

class MatchUsers extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      pageSize: 10,
      pageIndex: 1,
      refreshing: false,
      loadingMore: false,
      pending: false,
      GPS: true,
      tipsText: '请在设置中打开高精确度定位,以便查看匹配到的人',
    };
    pageNavigator = this.props.navigator;
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=> {
      if (tmpGlobal.currentLocation.Lat === 0 && tmpGlobal.currentLocation.Lng === 0) {
        this.setState({GPS: false},()=>{
          this._getMatchUserList();
        });
      }else{
        this._getMatchUserList();
      }
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
    pageNavigator.push({
      component: UserInfo,
      name: 'UserInfo',
      params: {
        Nickname: data.Nickname,
        UserId: data.UserId,
        isSelf: false
      }
    });
  }

  getPosition() {
    console.log('定位开始');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this._positionSuccessHandler(position);
      },
      (error) => {
        console.log(error);
        this._positionErrorHandler(error);
      },
      {enableHighAccuracy: false, timeout: LOCATION_TIME_OUT, maximumAge: 5000}
    );
  }

  refreshPage() {
    this.setState({
      pending: true,
      GPS: false,
      tipsText: '正在获取您的位置信息'
    });
    this.getPosition();
  }

  _positionSuccessHandler(position) {
    tmpGlobal.currentLocation = {
      Lat: position.coords.latitude,
      Lng: position.coords.longitude
    };
    this.setState({
      pending: false,
      GPS: true
    });
    this._onRefresh();
    this._savePosition(position.coords.latitude, position.coords.longitude);
  }

  _savePosition(lat, lng) {
    const {dispatch}=this.props;
    dispatch(VicinityActions.saveCoordinate({Lat: lat, Lng: lng}));
  }

  _positionErrorHandler(error) {
    let index = this._errorCodeHandler(error, Platform.OS);
    this.setState({
      pending: false,
      GPS: false,
      tipsText: this._tipsTextHandler(index, Platform.OS)
    });
  }

  _tipsTextHandler(index, osType) {
    switch (index) {
      case 1:
        return osType === 'ios' ? '请前往设置->隐私->觅友 Meet U->允许访问位置信息改为始终,然后点此获取位置信息' : '请在设置中开启位置服务,并选择高精确度,然后点此获取位置信息';
      case 2:
        return osType === 'ios' ? '定位失败,点此重试' : '定位失败,点此重试';
      case 3:
        return osType === 'ios' ? '定位失败,点此重试' : '定位失败,点此重试';
      case 4://特殊处理的iOS错误码,表明虽然开启的定位服务,但是没有给本APP权限
        return '请前往设置->隐私->定位服务->开启->觅友 Meet U->始终,然后点此获取位置信息';
      default:
        return '定位失败,点此重试';
    }
  }

  _errorCodeHandler(error, osType) {
    if (osType === 'android' && '"No available location provider."' === JSON.stringify(error)) {
      return 1;
    } else if (osType === 'ios' && error.code === 2 && error.message === 'Location services disabled.') {
      return 4;
    }
    return error.code;
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
    dispatch(HomeActions.getMatchUsersQuiet(data, (json)=> {
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

  renderWarningView(data) {
    if (data) {
      return (
        <TouchableHighlight
          onPress={()=> {
            this.refreshPage()
          }}
          underlayColor={'rgba(214,214,14,0.7)'}
          style={styles.gpsTips}>
          <View style={styles.tipsContent}>
            <Text style={styles.tipsText}>
              {this.state.tipsText}
            </Text>
          </View>
        </TouchableHighlight>
      )
    } else {
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
              <Text
                numberOfLines={1}
                style={styles.nameText}>{rowData.Nickname}</Text>
              <View style={[styles.userInfoLabel, this._renderGenderStyle(rowData.Gender)]}>
                <Icon
                  name={rowData.Gender ? 'mars-stroke' : 'venus'}
                  size={10}
                  style={styles.userInfoIcon}/>
                <Text style={styles.userInfoIcon}>{rowData.Age}</Text>
              </View>
            </View>
            <View style={[styles.itemRow, styles.userSignature]}>
              <Text
                numberOfLines={2}
                style={styles.signatureContent}>{rowData.PersonSignal ? rowData.PersonSignal : '这家伙很懒,什么也没留下'}</Text>
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
          renderFooter={this._renderFooter.bind(this)}
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
        {this.renderWarningView(!this.state.GPS)}
        <View style={styles.content}>
          {this.renderListView(ds, this.state.userList)}
        </View>
      </View>
    )
  }

  renderSpinner() {
    if (this.state.pending) {
      return (
        <Spinner animating={this.state.pending}/>
      )
    }
  }
}

export default connect((state)=> {
  return {
    ...state
  }
})(MatchUsers)
