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
  Platform,
  DeviceEventEmitter,
  NativeAppEventEmitter
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
import EditFriendFilter from '../pages/EditFriendFilter'
import {ComponentStyles, CommonStyles} from '../style'
import pxToDp from '../utils/PxToDp'
import EmptyView from '../components/EmptyView'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
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
    padding: pxToDp(20)
  },
  tipsContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tipsText: {
    fontSize: pxToDp(24),
    textAlign: 'center',
    flex: 1,
    flexWrap: 'wrap'
  },
  viewContainer: {
    marginTop: pxToDp(20),
    paddingHorizontal: pxToDp(20)
  },
  card: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  userInfoContent: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: pxToDp(130),
    borderBottomColor: '#cecece'
  },
  userAvatar: {
    width: pxToDp(80),
    height: pxToDp(80),
    borderRadius: pxToDp(8),
    margin: pxToDp(25),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#cecece'
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  userInfoLabel: {
    paddingHorizontal: pxToDp(12),
    backgroundColor: 'pink',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: pxToDp(20),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'pink',
    marginLeft: pxToDp(20)
  },
  userInfoIcon: {
    marginRight: pxToDp(8),
    color: '#FFF',
    fontSize: pxToDp(20)
  },
  userInfoText: {
    fontSize: pxToDp(20),
    color: '#FFF'
  },
  userInfo: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: pxToDp(25),
    borderBottomColor: '#cecece',
    paddingRight: pxToDp(25),
  },
  itemRow: {
    flexDirection: 'row',
  },
  nameTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  nameText: {
    overflow: 'hidden',
    fontSize: pxToDp(30),
  },
  signatureText: {
    overflow: 'hidden',
    fontSize: pxToDp(26),
    color: '#666',
    textAlignVertical: 'bottom'
  }
});

let lastCount;
let pageNavigator;
let emitter;

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
      tipsText: '请在设置中打开高精确度定位,然后点此重试',
    };
    pageNavigator = this.props.navigator;
    emitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter;
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      if (tmpGlobal.currentLocation.Lat === 0 && tmpGlobal.currentLocation.Lng === 0) {
        this.setState({GPS: false}, () => {
          this._getMatchUserList();
        });
      } else {
        this._getMatchUserList();
      }
    });

    this.friendFilterListener = emitter.addListener('friendFilterChanged', () => {
      this._getMatchUserList();
    });
  }

  componentWillUnmount() {
    this.friendFilterListener.remove();
  }

  _getMatchUserList() {
    const {dispatch}=this.props;
    let data = {
      lat: tmpGlobal.currentLocation.Lat,
      lng: tmpGlobal.currentLocation.Lng,
      pageIndex: this.state.pageIndex,
      pageSize: this.state.pageSize
    };
    dispatch(HomeActions.getMatchUsers(data, (json) => {
      lastCount = json.Result.length;
      this.setState({userList: json.Result});
    }, (error) => {
    }));
  }

  getNavigationBarProps() {
    return {
      title: '匹配',
      hideRightButton: false,
      rightTitle: '编辑'
    };
  }

  onRightPressed() {
    pageNavigator.push({
      component: EditFriendFilter,
      name: 'EditFriendFilter'
    });
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
    dispatch(HomeActions.getMatchUsersQuiet(data, (json) => {
      lastCount = json.Result.length;
      this.setState({
        userList: json.Result,
        refreshing: false
      })
    }, (error) => {
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
    dispatch(HomeActions.getMatchUsers(data, (json) => {
      lastCount = json.Result.length;
      this.state.userList = this.state.userList.concat(json.Result);
      this.setState({
        ...this.state.userList,
        refreshing: false,
        loadingMore: false
      })
    }, (error) => {

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
          onPress={() => {
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

  _bottomItem(rowID, value) {
    return parseInt(rowID) === this.state.userList.length - 1 ? (value === 1 ? 0 : StyleSheet.hairlineWidth) : (value === 0 ? 0 : StyleSheet.hairlineWidth);
  }

  renderRowData(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight
        key={rowData.UserId}
        onPress={() => {
          this._goUserInfo(rowData)
        }}
        style={styles.card}>
        <View style={[styles.userInfoContent, {borderBottomWidth: this._bottomItem(rowID, 0)}]}>
          <Image
            style={styles.userAvatar}
            source={{uri: URL_DEV + rowData.PrimaryPhotoFilename}}/>
          <View style={[styles.userInfo, {borderBottomWidth: this._bottomItem(rowID, 1)}]}>
            <View style={styles.itemRow}>
              <View style={styles.nameTextContainer}>
                <Text
                  numberOfLines={1}
                  style={styles.nameText}>{rowData.Nickname}</Text>
              </View>
              <View style={styles.labelContainer}>
                <View style={[styles.userInfoLabel, this._renderGenderStyle(rowData.Gender)]}>
                  <Icon
                    name={rowData.Gender ? 'mars-stroke' : 'venus'}
                    size={pxToDp(22)}
                    style={styles.userInfoIcon}/>
                  <Text style={styles.userInfoText}>{rowData.Age}</Text>
                </View>
              </View>
            </View>
            <Text
              numberOfLines={1}
              style={styles.signatureText}>{rowData.PersonSignal ? rowData.PersonSignal : '这家伙很懒,什么也没留下'}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  renderListView(ds, userList) {
    if (userList.length > 0) {
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
      return <EmptyView/>
    }

  }

  renderBody() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={ComponentStyles.container}>
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

export default connect((state) => {
  return {
    ...state
  }
})(MatchUsers)
