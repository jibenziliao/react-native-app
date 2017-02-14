/**
 * 交易记录
 * @author keyy/1501718947@qq.com 17/2/10 14:05
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  ListView,
  RefreshControl,
  InteractionManager,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import * as HomeActions from '../actions/Home'
import LoadMoreFooter from '../components/LoadMoreFooter'
import {dateFormat} from '../utils/DateUtil'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  listViewContainer: {
    flex: 1
  },
  listView: {
    borderBottomColor: '#E2E2E2',
    borderBottomWidth: 0.5,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff'
  },
  notes: {
    flex: 1,
    justifyContent: 'space-between'
  },
  balanceContainer: {
    width: width / 5,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  recordText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '200',
    flexWrap: 'nowrap',
    overflow: 'hidden'
  },
  recordTime: {
    fontSize: 14
  },
  tradeAmount: {
    fontSize: 14,
    marginBottom: 10
  },
  moneyLabel: {
    fontSize: 14,
    paddingBottom: 3
  },
  money: {
    fontSize: 24,
    fontWeight: '200',
    color: '#5067FF',
  },
  balance: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center'
  }
});

let lastCount;

class TranscationRecordList extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 1,
      pageSize: 20,
      refreshing: false,
      loadingMore: false,
    };
  }

  getNavigationBarProps() {
    return {
      title: '交易记录'
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=> {
      this._getTransRecord();
    });
  }

  _getTransRecord() {
    const {dispatch}=this.props;
    let data = {
      pageIndex: 1,
      pageSize: this.state.pageSize,
    };
    dispatch(HomeActions.getTransRecord(data, (json)=> {
      lastCount = json.Result.length;
      this.setState({
        refreshing: false,
        recordList: json.Result
      })
    }, (error)=> {
    }));
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
    dispatch(HomeActions.getTransRecord(data, (json)=> {
      lastCount = json.Result.length;
      this.state.recordList = this.state.recordList.concat(json.Result);
      this.setState({
        ...this.state.recordList,
        refreshing: false,
        loadingMore: false
      })
    }, (error)=> {

    }));
  }

  _onRefresh() {
    const {dispatch}=this.props;
    this.setState({refreshing: true, pageIndex: 1});
    let data = {
      pageIndex: 1,
      pageSize: this.state.pageSize,
    };
    dispatch(HomeActions.getTransRecordQuiet(data, (json)=> {
      lastCount = json.Result.length;
      this.setState({
        recordList: json.Result,
        refreshing: false
      })
    }, (error)=> {
      this.setState({refreshing: false});
    }));
  }

  renderRowData(rowData) {
    return (
      <TouchableOpacity
        key={rowData.Id}
        onPress={()=> {
          console.log('123');
        }}
        style={styles.listView}>
        <View style={styles.listItemContainer}>
          <View style={styles.notes}>
            <Text style={styles.recordText}>{rowData.Notes}</Text>
            <Text style={styles.recordTime}>{dateFormat(new Date(rowData.CreateDate))}</Text>
          </View>
          <View style={styles.balanceContainer}>
            <Text
              style={styles.tradeAmount}>{rowData.TradeAmount > 0 ? '+' + rowData.TradeAmount : rowData.TradeAmount}</Text>
            <View style={styles.balance}>
              <Text style={styles.moneyLabel}>{'剩余'}</Text>
              <Text style={styles.money}>{rowData.NewBalance}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
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
    if (recordList) {
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
      return null
    }
  }

  renderBody() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={styles.container}>
        {this.renderListView(ds, this.state.recordList)}
      </View>
    )
  }
}

export default connect((state)=> {
  return {
    ...state,
  }
})(TranscationRecordList)
