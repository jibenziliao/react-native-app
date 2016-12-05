/**
 * 查看用户详情
 * @author keyy/1501718947@qq.com 16/12/1 15:03
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Dimensions
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import {componentStyles} from '../style'
import BaseComponent from '../base/BaseComponent'
import {URL_DEV, TIME_OUT} from '../constants/Constant'
import * as HomeActions from '../actions/Home'
import {Button as NBButton,Icon as NBIcon} from 'native-base'
import AnnouncementList from '../pages/AnnouncemenetList'

const {width, height}=Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  scrollViewContainer: {
    flex: 1,
    paddingHorizontal:10,
    paddingTop:10
  },
  photoContainer: {
    flexDirection: 'row'
  },
  photos: {
    width: 100,
    height: 100,
    marginRight: 10
  },
  listItem: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: 'gray'
  },
  signature: {
    marginTop: 10
  },
  scrollViewBottom:{
    marginBottom:70
  },
  signatureText: {
    fontSize: 20,
    marginBottom: 10
  },
  announcementArea: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  userAvatar: {
    height: 50,
    width: 50,
    marginRight: 10
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  userInfoItem: {
    flexDirection: 'row',
    paddingVertical: 5
  },
  itemLeft:{
    width:100
  },
  itemRight:{
    flex:1
  },
  bottomBtnGroup:{
    flexDirection:'row',
    position:'absolute',
    bottom:0,
    left:0,
    width:width
  },
  bottomBtn:{
    flex:1,
    height:40,
    borderRadius:0
  },
  attention:{
    backgroundColor:'#FF9933'
  }
});

class UserInfo extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.route.params
    };
    console.log(this.props.route.params);
  }

  componentDidMount() {

  }

  getNavigationBarProps() {
    return {
      title: this.state.Nickname
    };
  }

  //前往指定用户的历史公告
  _goHistoryAnnouncementList(){
    const {dispatch,navigator}=this.props;
    let data={
      postId:this.state.UserId,
      pageIndex:1,
      pageSize:10,
      ...this.state.myLocation,
      postOrderTyp:3
    };
    dispatch(HomeActions.getAllAnnouncement(data,(json)=>{
      navigator.push({
        component:AnnouncementList,
        name:'AnnouncementList',
        params:{
          ...json.Result,
          Nickname:this.state.Nickname
        }
      });
    },(error)=>{}));
  }

  //关注/取消关注
  _attention(id){
    const {dispatch}=this.props;
    let params={
      attentionUserId:id
    };
    dispatch(HomeActions.attention(params,(json)=>{
      this.setState({AmIFollowedHim:!this.state.AmIFollowedHim});
    },(error)=>{}));
  }

  //渲染用户的相册
  _renderPhotos(arr) {
    return arr.map((item, index)=> {
      return (
        <Image
          key={index}
          style={styles.photos}
          source={{uri: URL_DEV + item.PhotoUrl}}/>
      )
    })
  }

  //渲染用户的个人信息
  _renderUserInfo(data) {
    return data.map((item, index)=> {
      return (
        <View
          key={index}
          style={styles.userInfoItem}>
          <Text style={styles.itemLeft}>{item.Key}{':'}</Text>
          <Text style={styles.itemRight}>{item.Value}</Text>
        </View>
      )
    });
  }

  renderBody() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollViewContainer}>
          <ScrollView
            horizontal={true}
            style={styles.photoContainer}>
            {this._renderPhotos(this.state.userPhotos)}
          </ScrollView>
          <View style={[styles.listItem, styles.signature]}>
            <Text style={styles.signatureText}>{'个性签名'}</Text>
            <Text>{this.state.PersonSignal?this.state.PersonSignal:'这家伙很懒,没有留下任何签名'}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.signatureText}>{'求关注消息'}</Text>
            <View style={styles.announcementArea}>
              <Image
                style={styles.userAvatar}
                source={{uri: URL_DEV + this.state.PrimaryPhotoFilename}}/>
              <Text
                onPress={()=> {
                  this._goHistoryAnnouncementList()
                }}
                style={styles.link}>{'点击查看用户历史公告列表>>'}</Text>
            </View>
          </View>
          <View style={[styles.listItem, styles.signature]}>
            <Text style={styles.signatureText}>{'个人信息'}</Text>
            {this._renderUserInfo(this.state.BasicInfo)}
          </View>
          <View style={[styles.listItem, styles.signature,styles.scrollViewBottom]}>
            <Text style={styles.signatureText}>{'交友条件'}</Text>
            {this._renderUserInfo(this.state.DataFilter)}
          </View>
        </ScrollView>
        <View style={styles.bottomBtnGroup}>
          <NBButton
            block
            style={[styles.bottomBtn]}
            onPress={()=>{
              console.log('你点击了对话')
            }}>
            <NBIcon name={'ios-chatbubbles-outline'}/>
            对话
          </NBButton>
          <NBButton
            block
            style={[styles.bottomBtn,styles.attention]}
            onPress={()=>{
              this._attention(this.state.UserId)
            }}>
            <NBIcon name={'ios-heart-outline'}/>
            {this.state.AmIFollowedHim?'取消关注':'关注'}
          </NBButton>
        </View>
      </View>
    )
  }
}
export default connect((state)=>{
  return{
    ...state
  }
})(UserInfo)
