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
import * as PhotoActions from '../actions/Photo'
import Spinner from '../components/Spinner'

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
      loading: true,
      uploaded: true,
      localPhotos:[]
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
          userPhotos: json.Result
        });
        this.setState({
          DictMap: DictMap,
          ...result,
          userPhotos: this._initOnlinePhotos(json.Result),
          loading: false
        });
      });
    }, (error)=> {
    }));
  }

  //将从后台获取的相册重新包装,标明照片是从线上获取,而非本地拍摄。并标明头像
  _initOnlinePhotos(data) {
    let tmpArr = [];
    for (let i = 0; i < data.length; i++) {
      data[i].onLine = true;
      data[i].isAvatar = data[i].PhotoUrl == this.props.route.params.PrimaryPhotoFilename;
      tmpArr.push(data[i])
    }
    return tmpArr;
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
      hideRightButton:false,
      rightTitle: '保存'
    };
  }

  onRightPressed() {
    const {dispatch}=this.props;

  }

  _userPhotosChanges(data) {
    console.log(data);
    this.state.userPhotos.push(data);
    this.setState({
      uploaded:false,
      ...this.state.userPhotos
    })
  }

  _deletePhotoOnline(data) {
    const{dispatch}=this.props;
    dispatch(PhotoActions.deletePhoto(data),(json)=>{
      this._initPhotos()
    },(error)=>{})
  }

  _deletePhotoOffline(data) {
    console.log(data);
  }

  _uploadPhotos(){
    const{dispatch}=this.props;
    let tmpArr=[];
    for(let i=0;i<this.state.userPhotos.length;i++){
      if(!this.state.userPhotos[i].onLine){
        tmpArr.push(this.state.userPhotos[i]);
      }
    }
    dispatch(PhotoActions.uploadPhoto(tmpArr,()=>{
      console.log('照片上传成功的回调');
      this._initPhotos();
    },(error)=>{}));
  }

  _renderPhotos(arr) {
    return (
      <PhotoViewer
        imageArr={arr}
        imageArrChanges={(data)=> {
          this._userPhotosChanges(data)
        }}
        upload={()=>{this._uploadPhotos()}}
        permissionOptions={this.state.DictMap.PhotoPermissionDict}
        deletePhotoOnline={(data)=> {
          this._deletePhotoOnline(data)
        }}
        deletePhotoOffline={(data)=> {
          this._deletePhotoOffline(data)
        }}
        changePermission={(data)=>{
          this._changePermission(data)
        }}
      />
    )
  }

  _changePermission(data){
    const{dispatch}=this.props;
    console.log(data);
    dispatch(PhotoActions.setPhotoPermission(data),(json)=>{
      this._initPhotos()
    },(error)=>{})
  }

  renderBody() {
    if (this.state.loading) {
      return null
    } else {
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

  renderSpinner() {
    if (this.props.pendingStatus) {
      return (
        <Spinner animating={this.props.pendingStatus}/>
      )
    }
  }

}

export default connect((state)=> {
  return {
    pendingStatus:state.Photo.pending
  }
})(EditPhotos)
