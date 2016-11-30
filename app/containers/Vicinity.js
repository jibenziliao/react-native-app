/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 09:54
 * @description
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  InteractionManager
} from 'react-native'
import {getNavigator} from '../navigation/Route'
import BaseComponent from '../base/BaseComponent'
import MapView from 'react-native-maps'
import Spinner from '../components/Spinner'
import {calculateRegion} from '../utils/MapHelpers'
import MapCallout from '../components/MapCallout'
import {toastShort} from '../utils/ToastUtil'
import * as VicinityActions from '../actions/Vicinity'
import {connect} from 'react-redux'
import {URL_DEV} from '../constants/Constant'
import VicinityList from '../pages/VicinityList'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  map: {
    // For Android :/
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

let watchId;
let compareRegion = {
  ne_lat: 0,
  ne_long: 0,
  sw_lat: 0,
  sw_long: 0
};
let compareCenterRegion = {
  longitude: 0,
  longitudeDelta: 0,
  latitude: 0,
  latitudeDelta: 0
};
let searchTimes=0;
let pageNavigator;
let hasMove=false;

class Vicinity extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      pending: false,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      GPS: true,
      refresh: false,
      locations: []
    };
    pageNavigator = this.props.navigator;
    this.renderMapMarkers = this.renderMapMarkers.bind(this);
  }

  componentWillMount() {
    this.getPosition();
  }

  getPosition() {
    console.log('定位开始');
    this.setState({pending: true});
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
        console.log(initialPosition);
      },
      (error) => {
        console.log(JSON.stringify(error));
        if ('"No available location provider."' == JSON.stringify(error)) {
          toastShort('请打开GPS开关');
          this.setState({pending: false, GPS: false});
        }
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 5000}
    );
    watchId = navigator.geolocation.watchPosition((position) => {
      const lastPosition = {
        UserId: 0,
        PhotoUrl: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg',
        Nickname: 'You are here!',
        LastLocation: {
          Lat: position.coords.latitude,
          Lng: position.coords.longitude
        },
        DatingPurpose: ''
      };

      const initLocation = [{
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }];
      //根据坐标计算区域(latPadding=0.15时,zoomLevel是10)
      const region = calculateRegion(initLocation, {latPadding: 0.15, longPadding: 0.15});

      console.log('成功获取当前区域', region);
      console.log('成功获取当前位置', lastPosition);
      this.setState({locations: [lastPosition], region: region, pending: false, lastPosition: lastPosition});

      //防止进入地图时,使用默认区域搜索,这里将搜索开关设为1,搜索区域发生变化后,即可搜索
      searchTimes = 1;

      const {dispatch}=this.props;
      const params = {
        Lat: this.state.lastPosition.LastLocation.Lat,
        Lng: this.state.lastPosition.LastLocation.Lng
      };
      dispatch(VicinityActions.saveCoordinate(params));
      navigator.geolocation.clearWatch(watchId);
    });
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
    console.log('显示区域发生了变化', newRegion);
    hasMove = true;
  }

  onRegionChangeComplete(newRegion) {
    /* ***********************************************************
     * STEP 4
     * If you wish to fetch new locations when the user changes the
     * currently visible region, do something like this:
     *************************************************************/
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
    // Fetch new data...
    console.log('中心区域', newRegion);
    console.log('搜索区域', searchRegion);

    const {dispatch} =this.props;
    //state变化会引起render重绘,继而重复执行onRegionChange方法
    //dispatch(VicinityActions.searchNearby(searchRegion));

    console.log('搜索对比区域', compareRegion);
    console.log('中心对比区域', compareCenterRegion);

    if (searchRegion.ne_lat != compareRegion.ne_lat) {
      console.log('搜索区域发生变化');
      if (!this.props.pendingStatus) {
        compareRegion = searchRegion;
        compareCenterRegion = newRegion;
      }

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

      if (1 === searchTimes || hasMove) {
        console.log('开始搜索附近的人');

        hasMove = false;
        searchTimes += 1;
        this.setState({pending: true, region: newRegion});

        fetch(URL_DEV + '/contacts/nearby', this.fetchOptions(params))
          .then(response => response.json())
          .then(json => {
            if ('OK' !== json.Code) {
              toastShort(json.Message);
            } else {
              console.log('搜索结果', json);
              console.log('附近的人搜索结束');
              this.setState({locations: json.Result, pending: false, region: newRegion});
            }
          }).catch((err)=> {
          toastShort('网络发生错误,请重试');
        })
      }
    }
  }

  calloutPress(location) {
    /* ***********************************************************
     * STEP 5
     * Configure what will happen (if anything) when the user
     * presses your callout.
     *************************************************************/

    //Actions.userInfo({userInfo:location});
    const {dispatch}=this.props;
    //dispatch(VicinityActions.fetchUserInfo(location.UserId));
  }

  renderMapMarkers(location) {
    /* ***********************************************************
     * STEP 6
     * Customize the appearance and location of the map marker.
     * Customize the callout in ../Components/MapCallout.js
     *************************************************************/
    return (
      <MapView.Marker
        key={location.UserId}
        coordinate={{latitude: location.LastLocation.Lat, longitude: location.LastLocation.Lng}}>
        <MapCallout location={location} onPress={()=>{this.calloutPress(location)}}/>
      </MapView.Marker>
    )
  }

  renderMapViews(loading) {
    if (!loading) {
      return (
        <MapView
          provider={"google"}
          style={styles.map}
          region={this.state.region}
          onRegionChangeComplete={(newRegion)=> {
            this.onRegionChangeComplete(newRegion)
          }}
          onRegionChange={(newRegion)=>{
            this.onRegionChange(newRegion);
          }}
          showsCompass={true}
          showsUserLocation={true}
          followsUserLocation={false}
          showsMyLocationButton={true}
          toolbarEnabled={false}
          loadingEnabled={true}
          showsScale={true}
          pitchEnabled={true}
        >
          {this.state.locations.map((location) => this.renderMapMarkers(location))}
        </MapView>
      )
    }
  }

  renderSpinner(data) {
    if (data) {
      return (
        <Spinner animating={data}/>
      )
    }
  }

  refreshPage(){
    setTimeout(()=>{
      this.setState({pending:true,GPS:false});
      this.getPosition();
    },100);
  }

  renderWarningView(data){
    if(data){
      return(
        <View style={{margin:30}}>
          <Text style={{fontSize:28}} onPress={()=>{
            this.refreshPage()}
          }>
            打开手机GPS开关,并给本APP权限后,点此重试
          </Text>
        </View>
      )
    }
  }

  getNavigationBarProps() {
    return {
      title: '附近',
      hideLeftButton:true,
      hideRightButton: false,
      rightIcon: {
        name: 'ellipsis-v'
      },
    };
  }

  renderBody() {
    return (
      <View style={styles.container}>
        {this.renderWarningView(!this.state.GPS)}
        {this.renderMapViews(this.props.saveCoordinateStatus || !this.state.GPS)}
        {this.renderSpinner(this.state.pending || this.props.pendingStatus)}
      </View>
    )
  }

  onRightPressed() {
    pageNavigator.push({
      component: VicinityList,
      name: 'VicinityList'
    });
  }
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
    pendingStatus: state.Vicinity.pending,
    saveCoordinateStatus: state.Vicinity.asyncCoordinating
  }
};
export default connect(mapStateToProps)(Vicinity)