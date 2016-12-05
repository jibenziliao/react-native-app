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
  Image
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import {componentStyles} from '../style'
import BaseComponent from '../base/BaseComponent'
import {URL_DEV, TIME_OUT} from '../constants/Constant'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  scrollViewContainer: {
    flex: 1,
    padding: 10
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
  _renderUserInfo() {
    const userInfo = [
      {Key: 'Gender', Value: '男', Label: '性别'},
      {Key: 'Age', Value: '24岁', Label: '年龄'},
      {Key: 'BirthDay', Value: '1992-1-27', Label: '出生年月'},
      {Key: 'Height', Value: '177cm', Label: '身高'},
      {Key: 'Weight', Value: '69kg', Label: '体重'},
      {Key: 'JobType', Value: 'IT', Label: '职业'}
    ];
    return userInfo.map((item, index)=> {
      return (
        <View
          key={index}
          style={styles.userInfoItem}>
          <Text>{item.Label}{':'}</Text>
          <Text>{item.Value}</Text>
        </View>
      )
    });
  }

  //渲染交友条件
  _renderDatingPurpose() {
    const datingPrupose = [
      {Key: 'Height', Value: '155-165cm', Label: '身高'},
      {Key: 'Age', Value: '不限', Label: '年龄'},
      {Key: 'Weight', Value: '不限', Label: '体重'},
      {Key: 'EducationLevel', Value: '不限', Label: '学历'},
      {Key: 'DatingPurpose', Value: '男女朋友', Label: '目的'},
    ];
    return datingPrupose.map((item, index)=> {
      return (
        <View
          key={index}
          style={styles.userInfoItem}>
          <Text>{item.Label}{':'}</Text>
          <Text>{item.Value}</Text>
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
            <Text>{'这个个性签名的假数据'}</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.signatureText}>{'求关注消息'}</Text>
            <View style={styles.announcementArea}>
              <Image
                style={styles.userAvatar}
                source={{uri: URL_DEV + this.state.PhotoUrl}}/>
              <Text
                onPress={()=> {
                  console.log('123')
                }}
                style={styles.link}>{'点击查看用户历史公告列表>>'}</Text>
            </View>
          </View>
          <View style={[styles.listItem, styles.signature]}>
            <Text style={styles.signatureText}>{'个人信息'}</Text>
            {this._renderUserInfo()}
          </View>
          <View style={[styles.listItem, styles.signature]}>
            <Text style={styles.signatureText}>{'交友条件'}</Text>
            {this._renderDatingPurpose()}
          </View>
        </ScrollView>
      </View>
    )
  }

}
export default UserInfo
