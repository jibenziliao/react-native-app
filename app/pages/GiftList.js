/**
 * 礼物中心
 * @author keyy/1501718947@qq.com 17/2/27 10:28
 * @description
 */
import React,{Component} from 'react'
import {
  StyleSheet,
  View,
  Platform,
  ScrollView,
  TouchableHighlight,
  InteractionManager,
  Dimensions,
  Image,
  Text,
  ListView,
  RefreshControl,
} from 'react-native'
import {connect} from 'react-redux'
import tmpGlobal from '../utils/TmpVairables'
import * as HomeActions from '../actions/Home'
import {ComponentStyles, CommonStyles,StyleConfig} from '../style'
import BaseComponent from '../base/BaseComponent'
import pxToDp from '../utils/PxToDp'
import EmptyView from '../components/EmptyView'
import LoadMoreFooter from '../components/LoadMoreFooter'
import {dateFormat,strToDateTime} from '../utils/DateUtil'
import {URL_DEV, URL_ADMIN_IMG_DEV} from '../constants/Constant'


const {width, height}=Dimensions.get('window');

const styles = StyleSheet.create({
  listViewContainer: {
    flex: 1
  },
  listView: {
    borderBottomColor: '#F3F3F3',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: pxToDp(20),
    backgroundColor: '#fff',
    flex:1
  },
  img:{
    width:pxToDp(180),
    height:pxToDp(180)
  },
  notes: {
    flex: 1,
    justifyContent: 'space-between'
  },
  recordText: {
    fontSize: pxToDp(36),
    marginBottom: pxToDp(20),
    fontWeight: '200',
    flexWrap: 'nowrap',
    overflow: 'hidden'
  },
  recordTime: {
    fontSize: pxToDp(28)
  },
});

let lastCount;

class GiftList extends BaseComponent{

  constructor(props){
    super(props);
    this.state={
      pageIndex: 1,
      pageSize: 20,
      refreshing: false,
      loadingMore: false,
      recordList:[]
    };
  }

  getNavigationBarProps() {
    return {
      title: '我的礼物记录'
    };
  }

  componentDidMount(){
    InteractionManager.runAfterInteractions(() => {
      this._getMyGiftList();
    })
  }

  _toEnd() {
    //如果最后一次请求的数据数量少于每页需要渲染的数量,表明没有更多数据了(在没有更多数据的情况下,暂时不能继续上拉加载更多数据。在实际场景中,这里是可以一直上拉加载更多数据的,便于有即时新数据拉取)
    if (lastCount < this.state.pageSize || this.state.recordList.length < this.state.pageSize) {
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
      pageIndex: this.state.pageIndex,
      pageSize: this.state.pageSize
    };
    dispatch(HomeActions.getMyGifts(data, (json) => {
      lastCount = json.Result.length;
      this.state.recordList = this.state.recordList.concat(json.Result);
      this.setState({
        ...this.state.recordList,
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
      pageIndex: 1,
      pageSize: this.state.pageSize,
    };
    dispatch(HomeActions.getMyGifts(data, (json) => {
      lastCount = json.Result.length;
      this.setState({
        recordList: json.Result,
        refreshing: false
      })
    }, (error) => {
      this.setState({refreshing: false});
    }));
  }

  _dateHandler(data){
    return data.split('T')[0] + ' ' + data.split('T')[1];
  }

  renderRowData(rowData) {
    return (
      <View
        key={rowData.Id}
        style={styles.listView}>
        <View style={styles.listItemContainer}>
          <View style={styles.notes}>
            <Text style={styles.recordText}>{`${rowData.UserId}送给我一个${rowData.Gift.Name}`}</Text>
            <Text style={styles.recordTime}>{dateFormat(new Date(strToDateTime(this._dateHandler(rowData.Gift.CreateDate))))}</Text>
          </View>
            <Image
              source={{uri:URL_ADMIN_IMG_DEV+rowData.Gift.GiftImg}}
              style={styles.img}/>
        </View>
      </View>
    )
  }

  _getMyGiftList(){
    const{dispatch}=this.props;
    let data = {
      pageIndex: 1,
      pageSize: this.state.pageSize,
    };
    dispatch(HomeActions.getMyGifts(data,(json)=>{
      lastCount = json.Result.length;
      this.setState({
        refreshing: false,
        recordList: json.Result
      })
    },(error)=>{

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

  renderListView(ds, recordList) {
    if (recordList.length>0) {
      return (
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          style={styles.listViewContainer}
          dataSource={ds.cloneWithRows(recordList)}
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
      return <EmptyView/>
    }
  }

  renderBody(){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={ComponentStyles.container}>
        {this.renderListView(ds, this.state.recordList)}
      </View>
    )
  }
}

export default connect((state) => {
  return {
    ...state
  }
})(GiftList)