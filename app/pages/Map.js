/**
 * 交友模块中的地图
 * @author keyy/1501718947@qq.com 16/12/21 15:06
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Platform,
  InteractionManager,
  Dimensions,
  TouchableHighlight
} from 'react-native'
import BaseComponent from '../base/BaseComponent'
import MapView from 'react-native-maps'
import Spinner from '../components/Spinner'
import {calculateRegion} from '../utils/MapHelpers'
import MapCallout from '../components/MapCallout'
import {toastShort} from '../utils/ToastUtil'
import * as VicinityActions from '../actions/Vicinity'
import {connect} from 'react-redux'
import {URL_DEV,LOCATION_TIME_OUT} from '../constants/Constant'
import UserInfo from '../pages/UserInfo'
import * as HomeActions from '../actions/Home'
import tmpGlobal from '../utils/TmpVairables'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gpsTips: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 12,
        left: 60,
        right: 60,
        height: 38,
      },
      android: {
        top: 12,
        left: 60,
        right: 60,
        height: 38,
      }
    }),
    backgroundColor: 'rgba(255,255,0,0.7)'
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
  },
  map: {
    position: 'absolute',
    width: width,
    ...Platform.select({
      ios: {
        height: height - 64
      },
      android: {
        height: height - 54
      }
    })
  },
});

let compareRegion = {
  ne_lat: 0,
  ne_long: 0,
  sw_lat: 0,
  sw_long: 0
};
let pageNavigator;

class Map extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      pending: false,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      GPS: true,
      tipsText: '请在设置中打开高精确度定位,以便查看附近的人',
      refresh: false,
      locations: []
    };
    pageNavigator = this.props.navigator;
    this.renderMapMarkers = this.renderMapMarkers.bind(this);
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getPosition();
    });
  }

  getPosition() {
    console.log('定位开始');
    this.setState({pending: true});
    navigator.geolocation.getCurrentPosition(
      (position) => {
        //console.log(position);
        this._positionSuccessHandler(position);
      },
      (error) => {
        console.log(error);
        this._positionErrorHandler(error);
      },
      {enableHighAccuracy: false, timeout: LOCATION_TIME_OUT, maximumAge: 5000}
    );
  }

  _positionSuccessHandler(position) {
    tmpGlobal.currentLocation = {
      Lat: position.coords.latitude,
      Lng: position.coords.longitude
    };
    this._initRegion(position.coords.latitude, position.coords.longitude);
    this._savePosition(position.coords.latitude, position.coords.longitude);
    this.setState({
      pending: false,
      GPS: true
    });
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
        return osType === 'ios' ? '定位失败,点此重试或者手动查看附近的人' : '定位失败,点此重试或者手动查看附近的人';
      case 3:
        return osType === 'ios' ? '你可以手动查看附近的人或者点此重新定位' : '你可以手动查看附近的人或者点此重新定位';
      case 4://特殊处理的iOS错误码,表明虽然开启的定位服务,但是没有给本APP权限
        return '请前往设置->隐私->定位服务->开启->觅友 Meet U->始终,然后点此获取位置信息';
      default:
        return '定位失败,点此重试或者手动查看附近的人';
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

  _initRegion(lat, lng) {
    let region = calculateRegion([{latitude: lat, longitude: lng}], {latPadding: 0.02, longPadding: 0.02});
    const lastPosition = {
      UserId: 0,
      PhotoUrl: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
      Nickname: 'You are here!',
      LastLocation: {
        Lat: lat,
        Lng: lng
      },
      DatingPurpose: ''
    };
    //console.log('成功获取当前区域', region);
    //console.log('成功获取当前位置', lastPosition);
    this.setState({
      locations: [lastPosition],
      region: region,
      pending: false,
    }, ()=> {
      this.onRegionChangeComplete(region);
    });
  }

  _savePosition(lat, lng) {
    const {dispatch}=this.props;
    dispatch(VicinityActions.saveCoordinate({Lat: lat, Lng: lng}));
  }

  fetchOptions(data) {
    return {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  }

  onRegionChange(newRegion) {
    //console.log('显示区域发生了变化', newRegion);
    this.setState({
      region: newRegion
    });
  }

  onRegionChangeComplete(newRegion) {
    let ne_long = newRegion.longitude + newRegion.longitudeDelta / 2;
    let sw_long = newRegion.longitude - newRegion.longitudeDelta / 2;
    let ne_lat = newRegion.latitude + newRegion.latitudeDelta / 2;
    let sw_lat = newRegion.latitude - newRegion.latitudeDelta / 2;

    const searchRegion = {
      ne_lat: ne_lat,
      ne_long: ne_long,
      sw_lat: sw_lat,
      sw_long: sw_long
    };
    //console.log('中心区域', newRegion);
    //console.log('搜索区域', searchRegion);

    //console.log('搜索对比区域', compareRegion);

    if (searchRegion.ne_lat != compareRegion.ne_lat) {
      //console.log('搜索区域发生变化');
      compareRegion = searchRegion;
      this.setState({region: newRegion}, ()=> {
        this._searchNearBy(searchRegion)
      });
    }
  }

  _searchNearBy(searchRegion) {
    //console.log('开始搜索附近的人');
    //参数处理
    const params = {
      TopRight: {
        Lat: searchRegion.ne_lat < 90 ? searchRegion.ne_lat : 89,
        Lng: searchRegion.ne_long < 180 ? searchRegion.ne_long : 179
      },
      BottomLeft: {
        Lat: searchRegion.sw_lat > -90 ? searchRegion.sw_lat : -89,
        Lng: searchRegion.sw_long > -180 ? searchRegion.sw_long : -179
      }
    };
    fetch(URL_DEV + '/contacts/nearby', this.fetchOptions(params))
      .then(response => response.json())
      .then(json => {
        if ('OK' !== json.Code) {
          toastShort(json.Message);
        } else {
          //console.log('附近的人搜索结束',json.Result);
          this.setState({locations: json.Result});
        }
      }).catch((err)=> {
      //console.log(err);
      toastShort('网络发生错误,请重试');
    })
  }

  calloutPress(data) {
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

  renderMapMarkers(location) {
    return (
      <MapView.Marker
        key={location.UserId}
        coordinate={{latitude: location.LastLocation.Lat, longitude: location.LastLocation.Lng}}>
        <MapCallout location={location} onPress={()=> {
          this.calloutPress(location)
        }}/>
      </MapView.Marker>
    )
  }

  renderMapViews() {
    return (
      <MapView
        provider={"google"}
        style={styles.map}
        region={this.state.region}
        onRegionChangeComplete={(newRegion)=> {
          this.onRegionChangeComplete(newRegion)
        }}
        onRegionChange={(newRegion)=> {
          this.onRegionChange(newRegion);
        }}
        showsCompass={true}
        showsUserLocation={true}
        followsUserLocation={false}
        showsMyLocationButton={true}
        toolbarEnabled={false}
        loadingEnabled={false}
        showsScale={true}
        pitchEnabled={false}
      >
        {this.state.locations.map((location) => this.renderMapMarkers(location))}
      </MapView>
    )
  }

  renderSpinner() {
    if (this.state.pending) {
      return (
        <Spinner animating={this.state.pending}/>
      )
    }
  }

  refreshPage() {
    this.setState({
      pending: true,
      GPS: false,
      tipsText: '正在获取您的位置信息'
    });
    this.getPosition();
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
    }
  }

  getNavigationBarProps() {
    return {
      title: '寻TA'
    };
  }

  renderBody() {
    return (
      <View style={styles.container}>
        {this.renderMapViews()}
        {this.renderWarningView(!this.state.GPS)}
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    ...state
  }
};

export default connect(mapStateToProps)(Map)
