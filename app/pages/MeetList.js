/**
 * 聚会列表
 * @author keyy/1501718947@qq.com 17/1/6 16:52
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
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import {URL_DEV, TIME_OUT} from '../constants/Constant'
import Icon from 'react-native-vector-icons/FontAwesome'

const {height, width} = Dimensions.get('window');


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
    }
  });

class MeetList extends Component {
  constructor(props) {
    super(props);
    this.state={
      refreshing:this.props.refreshing
    };
    console.log(this.props);
  }

  //处理距离
  _distance(data) {
    return (parseFloat(data) / 1000).toFixed(2);
  }

  _renderGenderStyle(gender) {
    return {
      backgroundColor: gender ? '#1496ea' : 'pink',
      borderColor: gender ? '#1496ea' : 'pink',
    }
  }

  _onRefresh(){
    this.props._onRefresh();
  }

  _closeCommentInput(){
    this.props._closeCommentInput();
  }

  _toEnd(){
    this.props._toEnd();
  }

  _renderFooter(){
    this.props._renderFooter();
  }

  _goAnnouncementDetail(rowData){
    this.props._goAnnouncementDetail(rowData);
  }

  _goUserInfo(data){
    this.props._goUserInfo(data);
  }

  renderPostImage(arr){
    this.props.renderPostImage(arr);
  }

  _showCommentInput(id){
    this.props._showCommentInput(id);
  }

  _doLike(id,isLike){
    this.props._doLike(id,isLike);
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
    return (
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        onScroll={()=> {
          this._closeCommentInput()
        }}
        style={styles.listView}
        dataSource={ds.cloneWithRows(this.props.data)}
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
        pageSize={this.props.pageSize}/>
    )
  }
}

export default MeetList
