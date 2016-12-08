/**
 *
 * @author keyy/1501718947@qq.com 16/12/8 09:20
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackAndroid,
  Dimensions,
  Platform,
  InteractionManager
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import {componentStyles} from '../style'
import BaseComponent from '../base/BaseComponent'
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Button as NBButton} from 'native-base'
import * as HomeActions from '../actions/Home'
import * as Storage from '../utils/Storage'
import PhotoViewer from '../components/PhotoViewer'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  scrollViewContainer: {
    flex: 1
  },
});

let DictMap = {
  EducationLevelDict: [],
  IncomeLevelDict: [],
  JobTypeDict: [],
  MarriageStatusDict: [],
  DatingPurposeDict: [],
  PhotoPermissionDict: [],
  ReligionDict: []
};

//保存字典索引
let DictMapArrKey = ['EducationLevelDict', 'IncomeLevelDict', 'JobTypeDict', 'MarriageStatusDict', 'DatingPurposeDict', 'PhotoPermissionDict', 'ReligionDict'];

class EditPhotos extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.route.params,
      loading:true
    };
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=> {
      this._initPhotos();
    });
  }

  _initPhotos() {
    const {dispatch}=this.props;
    dispatch(HomeActions.getUserPhotos({UserId: this.props.route.params.UserId}, (json)=> {
      this._initDict((DictMap, result)=> {
        console.log({
          DictMap: DictMap,
          ...result,
          userPhotos:json.Result
        });
        this.setState({
          DictMap: DictMap,
          ...result,
          userPhotos:json.Result,
          loading:false
        });
      });
    }, ()=> {
    }));
  }

  _initDict(callBack, result) {
    //每次初始化字典时,需要把之前的数据清空
    DictMap = {
      EducationLevelDict: [],
      IncomeLevelDict: [],
      JobTypeDict: [],
      MarriageStatusDict: [],
      DatingPurposeDict: [],
      PhotoPermissionDict: [],
      ReligionDict: []
    };
    //下面是选填项的字典
    for (let i = 0; i < DictMapArrKey.length; i++) {
      Storage.getItem(`${DictMapArrKey[i]}`).then((response)=> {
        if (response && response.length > 0) {
          for (let j = 0; j < response.length; j++) {
            if (DictMapArrKey[i] == 'DatingPurposeDict' || DictMapArrKey[i] == 'PhotoPermissionDict') {
              DictMap[DictMapArrKey[i]].push(response[j])
            } else {
              DictMap[DictMapArrKey[i]].push(response[j].Value)
            }
          }
          if (i === DictMapArrKey.length - 1) {
            callBack(DictMap, result);
          }
        } else {
          console.error('获取下拉选项字典出错');
        }
      })
    }

  }

  getNavigationBarProps() {
    return {
      title: '编辑相册',
      rightTitle:'保存'
    };
  }

  onRightPressed(){
    const{dispatch}=this.props;

  }

  _userPhotosChanges(data){
    console.log(data);
  }

  _deletePhotoOnline(data){
    console.log(data);
  }

  _deletePhotoOffline(data){
    console.log(data);
  }

  _renderPhotos(arr) {
    return (
      <PhotoViewer
        imageArr={arr}
        imageArrChanges={(data)=>{this._userPhotosChanges(data)}}
        permissionOptions={this.state.DictMap.PhotoPermissionDict}
        deletePhotoOnline={(data)=> {
          this._deletePhotoOnline(data)
        }}
        deletePhotoOffline={(data)=> {
          this._deletePhotoOffline(data)
        }}
      />
    )
  }

  renderBody() {
    if(this.state.loading){
      return null
    }else{
    return (
      <MenuContext style={styles.container}>
        <ScrollView
          style={styles.scrollViewContainer}>
          {this._renderPhotos(this.state.userPhotos)}
        </ScrollView>
      </MenuContext>
    )
    }
  }
}

export default connect((state)=> {
  return {
    ...state
  }
})(EditPhotos)
