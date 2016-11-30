/**
 * 公告详情
 * @author keyy/1501718947@qq.com 16/11/30 16:33
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  ListView,
  RefreshControl,
  Dimensions
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import {componentStyles} from '../style'
import BaseComponent from '../base/BaseComponent'
import * as HomeActions from '../actions/Home'
import Modal from 'react-native-modalbox'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Button as NBButton} from 'native-base'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  card: {
    padding: 10,
    backgroundColor: '#FFF',
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10
  },
  cardRow: {
    flexDirection: 'row',
    flex: 1
  },
  cardLeft: {
    flexDirection: 'row',
    flex: 1
  },
  cardRight: {
    flexDirection: 'row'
  },
  avatarImg: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 8
  },
  userInfo: {
    justifyContent: 'space-between',
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
    fontSize: 14,
    color: '#FFF'
  },
  moodView: {
    marginVertical: 20
  },
  moodText: {
    fontSize: 16
  },
  cardBtn: {
    marginTop: 10,
    marginRight: 20
  }
});

class AnnouncementDetail extends BaseComponent {
  constructor(props) {
    super(props);
    console.log(this.props.route.params);
    this.state = {
      comment: '',
      ...this.props.route.params
    }
  }

  componentDidMount() {

  }

  getNavigationBarProps() {
    return {
      title: '公告详情',
      hideRightButton: false,
      rightIcon: {
        name: 'ellipsis-v'
      },
    };
  }

  _renderGenderStyle(gender) {
    return {
      backgroundColor: gender ? '#1496ea' : 'pink',
      borderColor: gender ? '#1496ea' : 'pink',
    }
  }

  _showCommentInput() {
    //保存当前要评论的广告id
    this.refs.commentInputBox.open();
  }

  //点赞和取消赞isLike都传true
  _doLike(id, isLike) {
    const {dispatch}=this.props;
    if (isLike === null) {
      this.state.LikeCount += 1;
      this.state.AmILikeIt = true;
    } else {
      this.state.LikeCount -= 1;
      this.state.AmILikeIt = null;
    }

    const data = {
      postId: id,
      isLike: true
    };
    dispatch(HomeActions.like(data, (json)=> {
      this.setState({
        AmILikeIt: this.state.AmILikeIt,
        LikeCount: this.state.LikeCount
      });
    }, (error)=> {
    }));
  }

  //发送评论
  _sendComment() {
    //关闭评论输入框
    this.refs.commentInputBox.close();
    //发送评论,并给当前广告评论数加一
    const {dispatch}=this.props;
    let data = {
      postId: this.state.Id,
      forCommentId: null,
      comment: this.state.comment
    };
    this.state.CommentCount += 1;
    dispatch(HomeActions.comment(data, (json)=> {
      this.setState({
        CommentCount: this.state.CommentCount,
        comment: ''//评论成功后需要清空评论框内容
      });
    }, (error)=> {
    }));
  }

  renderBody() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={()=> {
              console.log('123')
            }}>
            <View style={styles.cardRow}>
              <View style={styles.cardLeft}>
                <Image source={{uri: 'http://oatl31bw3.bkt.clouddn.com/735510dbjw8eoo1nn6h22j20m80m8t9t.jpg'}}
                       style={styles.avatarImg}/>
                <View style={styles.userInfo}>
                  <Text>{this.state.PosterInfo.Nickname}</Text>
                  <View style={{flex: 1}}>
                    <View style={[styles.userInfoLabel, this._renderGenderStyle(this.state.PosterInfo.Gender)]}>
                      <Icon
                        name={this.state.PosterInfo.Gender ? 'mars-stroke' : 'venus'}
                        size={12}
                        style={styles.userInfoIcon}/>
                      <Text style={styles.userInfoText}>{this.state.PosterInfo.Age}{'岁'}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.cardRight}>
                <Text>{this.state.CreateTimeDescription}</Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={[styles.cardRow, styles.moodView]}>
            <Text style={styles.moodText}>{this.state.PostContent}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text>{this.state.Distance}{'km'}{'·'}</Text>
            <Text>{this.state.LikeCount}{'赞'}{'·'}</Text>
            <Text>{this.state.CommentCount}{'评论'}{'·'}</Text>
            <Text>{this.state.ViewCount}{'阅读'}</Text>
          </View>
          <View style={styles.cardRow}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.cardBtn}
              onPress={()=> {
                this._doLike(this.state.Id, this.state.AmILikeIt)
              }}>
              <Icon name={this.state.AmILikeIt === null ? 'thumbs-o-up' : 'thumbs-up'} size={20} color={'#1496ea'}/>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.cardBtn}
              onPress={()=> {
                this._showCommentInput()
              }}>
              <Icon name="comments-o" size={20}/>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          style={{
            backgroundColor: '#E2E2E2',
            height: 60,
            justifyContent: 'center'
          }}
          backdropOpacity={0.5}
          backdropColor={'transparent'}
          swipeToClose={false}
          position={"bottom"}
          backdropPressToClose={true}
          ref={"commentInputBox"}>
          <View style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TextInput
              multiline={false}
              style={{
                height: 40,
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: 4
              }}
              underlineColorAndroid={'transparent'}
              placeholder={'请输入回复'}
              maxLength={50}
              onChangeText={(comment)=>this.setState({comment})}
              value={this.state.comment}/>
            <View>
              <NBButton
                primary
                style={{
                  width: 100,
                  height: 40,
                  marginLeft: 10
                }}
                onPress={()=> {
                  this._sendComment()
                }}>
                发送
              </NBButton>
            </View>
          </View>
        </Modal>
      </ScrollView>
    )
  }

}
export default connect((state)=> {
  return {
    ...state
  }
})(AnnouncementDetail)