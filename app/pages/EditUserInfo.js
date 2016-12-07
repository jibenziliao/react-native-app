/**
 * 编辑我的详细资料
 * @author keyy/1501718947@qq.com 16/12/5 16:02
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
  TouchableHighlight,
  Dimensions,
  BackAndroid,
  Alert
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import ImagePicker from 'react-native-image-picker'
import Spinner from '../components/Spinner'
import {Button as NBButton} from 'native-base'
import RNPicker from 'react-native-picker'
import Icon from 'react-native-vector-icons/FontAwesome'
import EditFriendFilter from '../pages/EditFriendFilter'
import CheckBox from '../components/CheckBox'
import * as UserProfileActions from '../actions/UserProfile'
import {toastShort} from '../utils/ToastUtil'
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'
import * as PhotoAction from '../actions/Photo'
import {URL_DEV, TIME_OUT} from '../constants/Constant'
import PhotoViewer from '../components/PhotoViewer'

const {width, height}=Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  scrollViewContainer: {
    flex: 1
  },
  photosContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingLeft: 10
  },
  userInfo: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 10
  },
  itemTitle: {
    paddingVertical: 10
  },
  listItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d4cfcf',
    alignItems: 'center'
  },
  topItem: {
    borderTopWidth: 1,
    borderTopColor: '#d4cfcf'
  },
  bottomItem: {
    borderBottomWidth: 0
  },
  itemRow: {
    flexDirection: 'row'
  },
  itemEnter: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemIcon: {
    marginRight: 10
  },
  fullInput: {
    flex: 1
  },
  input: {
    height: 40,
    paddingLeft: 10,
    textAlignVertical: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputLabel: {
    width: 100
  },
  rightLabel: {
    width: 80,
    paddingLeft: 10,
    textAlignVertical: 'center'
  },
  emotionStatusIOS: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  emotionStatusIOSView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  emotionStatusIOSText: {
    textAlignVertical: 'center'
  },
  pickerItem: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  pickerTextView: {
    flex: 1
  },
  pickerText: {
    textAlignVertical: 'center'
  },
  checkBoxView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 10
  },
  checkBoxItem: {
    width: (width - 30) / 2,
    height: 40
  },
  checkBoxLabel: {
    marginLeft: 10,
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'nowrap'
  },
  datingPurposeTitle: {
    borderBottomWidth: 1,
    borderBottomColor: '#d4cfcf'
  },
  takePhotoBtn: {
    height: (width - 40) / 3,
    width: (width - 40) / 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginRight: 10,
    marginBottom: 10
  },
  imageStar: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  imageBorder: {
    borderWidth: 0
  }
});

let DatingPurposeSelectCopy = [];
let navigator;

class EditUserInfo extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.route.params,
      ageRangeText: `${this.props.route.params.friendInfo.AgeMin}-${this.props.route.params.friendInfo.AgeMax}岁`,
      heightRangeText: `${this.props.route.params.friendInfo.HeightMin}-${this.props.route.params.friendInfo.HeightMax}cm`,
      hasChanged: false
    };
    navigator = this.props.navigator;
    this.onBackAndroid = this.onBackAndroid.bind(this);
    console.log(this.props.route.params);
  }

  componentDidMount() {
    this._initDatingPurpose();
    if (Platform.OS === 'android') {
      BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
    }
  }

  onBackAndroid() {
    this._backAlert();
  }

  _backAlert() {
    if (this.state.hasChanged) {
      Alert.alert('提示', '您修改的资料未保存,确定要离开吗?', [
        {
          text: '确定', onPress: () => {
          navigator.pop()
        }
        },
        {
          text: '取消', onPress: () => {
        }
        }
      ]);
    } else {
      navigator.pop();
    }
  }

  onLeftPressed() {
    this._backAlert();
  }

  //初始化交友目的的选中情况
  _initDatingPurpose() {
    let tmpArr = this.state.DatingPurposeName.split(',');
    for (let i = 0; i < this.state.DictMap.DatingPurposeDict.length; i++) {
      for (let j = 0; j < tmpArr.length; j++) {
        if (this.state.DictMap.DatingPurposeDict[i].Value == tmpArr[j]) {
          this.state.DictMap.DatingPurposeDict[i].Checked = true;
          this.setState({
            DictMap: {
              ...this.state.DictMap,
              DatingPurposeDict: this.state.DictMap.DatingPurposeDict
            }
          })
        }
      }
    }
  }

  getNavigationBarProps() {
    return {
      title: '编辑资料',
      hideRightButton: false,
      rightTitle: '完成'
    };
  }

  //点击完成(保存编辑后的个人资料)
  onRightPressed() {
    const {dispatch, navigator}=this.props;
    dispatch(UserProfileActions.editProfile(this.state, DatingPurposeSelectCopy, (json)=> {
      toastShort('保存成功!');
      this.saveTimer = setTimeout(()=> {
        navigator.pop();
      }, 1000)
    }, (error)=> {
    }))
  }

  //前往编辑个人信息中的交友信息
  _editFriendFilter() {
    const {navigator}=this.props;
    navigator.push({
      component: EditFriendFilter,
      name: 'EditFriendFilter',
      params: {
        ...this.state.friendInfo,
        callBack: (data)=> {
          this.setState({friendInfo: data})
        }
      }
    })
  }

  _createHeightData() {
    let data = [];
    for (let i = 100; i < 251; i++) {
      data.push(i + '')
    }
    return data;
  }

  _createWeightData() {
    let data = [];
    for (let i = 20; i < 501; i++) {
      data.push(i + '')
    }
    return data;
  }

  _createMapData() {
    return ['0m(精确定位)', '200m', '500m', '1000m', '隐身'];
  }

  //通用选择弹窗显示文本方法
  renderSinglePicker(text, value, _createData) {
    return (
      <TouchableHighlight
        onPress={()=> {
          this._showPicker(_createData, text, value)
        }}
        style={styles.emotionStatusIOS}
        activeOpacity={0.5}
        underlayColor="rgba(247,245,245,0.7)">
        <View style={styles.emotionStatusIOSView}>
          <Text style={styles.emotionStatusIOSText}>
            {this.state[`${text}`]}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  _updateState(text, value, pickedValue) {
    this.setState({hasChanged: true});
    switch (text) {
      case 'MarriageStatusName':
        this.setState({MarriageStatusName: pickedValue});
        break;
      case 'EducationLevelName':
        this.setState({EducationLevelName: pickedValue});
        break;
      case 'Height':
        this.setState({heightText: pickedValue});
        break;
      case 'Weight':
        this.setState({weightText: pickedValue});
        break;
      case 'JobTypeName':
        this.setState({JobTypeName: pickedValue});
        break;
      case 'IncomeLevelName':
        this.setState({IncomeLevelName: pickedValue});
        break;
      case 'mapPrecisionText':
        if (pickedValue == '隐身') {
          this.setState({
            MapPrecision: null,
            mapPrecisionText: pickedValue
          });
        } else {
          this.setState({
            MapPrecision: parseInt(pickedValue.split('m')[0]),
            mapPrecisionText: pickedValue
          });
        }
        break;
      default:
        console.error('设置数据出错!');
        break;
    }
  }

  _showPicker(_createData, text, value) {
    RNPicker.init({
      pickerData: _createData,
      selectedValue: [this.state[`${text}`]],
      onPickerConfirm: pickedValue => {
        this._updateState(text, value, pickedValue[0]);
        RNPicker.hide();
      },
      onPickerCancel: pickedValue => {
        RNPicker.hide();
      },
      onPickerSelect: pickedValue => {
        this._updateState(text, value, pickedValue[0]);
      }
    });
    RNPicker.show();
  }

  renderDatingPurpose() {
    let arr = this.state.DictMap.DatingPurposeDict;
    return (
      <View style={styles.checkBoxView}>
        {arr.map((item, index)=> {
          //勾选/取消勾选会引起重绘,这里需要再次判断DatingPurposeSelectCopy中是否有已勾选的项,如果有则跳过,没有则添加
          //TODO: 代码冗余,待封装,待优化
          if (item.Checked) {
            let index = 0;
            for (let m = 0; m < DatingPurposeSelectCopy.length; m++) {
              if (DatingPurposeSelectCopy[m].Value == item.Value) {
                index += 1;
              }
            }
            if (index === 0) {
              DatingPurposeSelectCopy.push(item);
            }
          }
          return (
            <CheckBox
              key={index}
              label={item.Value}
              labelStyle={styles.checkBoxLabel}
              checked={item.Checked}
              style={styles.checkBoxItem}
              onChange={(checked)=> {
                item.Checked = checked;
                this.setState({hasChanged: true});
                if (checked) {
                  let index = 0;
                  for (let m = 0; m < DatingPurposeSelectCopy.length; m++) {
                    if (DatingPurposeSelectCopy[m].Value == item.Value) {
                      index += 1;
                    }
                  }
                  if (index === 0) {
                    DatingPurposeSelectCopy.push(item);
                  }
                } else {
                  let index = 0;
                  for (let i = 0; i < DatingPurposeSelectCopy.length; i++) {
                    if (DatingPurposeSelectCopy[i].Key == item.Key) {
                      index = i;
                      break;
                    }
                  }
                  DatingPurposeSelectCopy.splice(index, 1);
                }
              }}/>
          )
        })}
      </View>
    )
  }

  _initImagePicker() {
    const options = {
      title: '',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '从相册中选择',
      cancelButtonTitle: '取消',
      mediaType: 'photo',
      maxHeight: 800,
      maxWidth: 800,
      quality: 0.7
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else {
        let source;

        // You can display the image using either data...
        //source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // or a reference to the platform specific asset location
        if (Platform.OS === 'ios') {
          source = {PhotoUrl: response.uri.replace('file://', ''), onLine: false};
        } else {
          source = {PhotoUrl: response.uri, onLine: false};
        }

        this.state.userPhotos.push({
          Id: (new Date()).getTime().toString(),
          ...source,
          Permission: 'Everybody'
        });
        this.setState({userPhotos: this.state.userPhotos});
      }
    });
  }

  _renderPhotoArea() {
    return (
      <View style={styles.photosContainer}>
        {/*<TouchableOpacity
         onPress={()=> {
         this._initImagePicker()
         }}
         style={[styles.takePhotoBtn,{height:(width - 40) / 3+70}]}>
         <Icon name={'picture-o'} size={30}/>
         <Text>{'添加照片'}</Text>
         </TouchableOpacity>*/}
        {this._renderPhotos(this.state.userPhotos)}
      </View>
    )
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

  //拍摄新照片后,重绘页面
  _userPhotosChanges(data){
    
  }

  //删除照片(本地)
  _deletePhotoOffline(data) {
    let index = this.state.userPhotos.findIndex((item)=> {
      return item.Id == data.Id;
    });
    this.state.userPhotos.splice(index, 1);
    this.setState({
      userPhotos: [
        ...this.state.userPhotos
      ]
    });
  }

  //删除照片(在线)
  _deletePhotoOnline(data) {
    console.log(data);
  }

  renderBody() {
    return (
      <MenuContext style={styles.container}>
        <ScrollView style={styles.scrollViewContainer}>
          {/*{this._renderPhotoArea()}*/}
          {this._renderPhotos(this.state.userPhotos)}
          <View style={styles.userInfo}>
            <Text style={styles.itemTitle}>{'基本资料'}</Text>
            <View style={[styles.listItem, styles.topItem]}>
              <Text style={styles.inputLabel}>{'昵称'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Nickname}
                onChangeText={(Nickname)=>this.setState({Nickname: Nickname, hasChanged: true})}
                maxLength={15}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'身高'}</Text>
              {this.renderSinglePicker('Height', 'Height', this._createHeightData())}
              <Text style={styles.rightLabel}>{'cm'}</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'体重'}</Text>
              {this.renderSinglePicker('Weight', 'Weight', this._createWeightData())}
              <Text style={styles.rightLabel}>{'kg'}</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'职业'}</Text>
              {this.renderSinglePicker('JobTypeName', 'JobTypeName', this.state.DictMap.JobTypeDict)}
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'收入'}</Text>
              {this.renderSinglePicker('IncomeLevelName', 'IncomeLevelName', this.state.DictMap.IncomeLevelDict)}
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'所在地'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Location}
                onChangeText={(Location)=>this.setState({Location: Location, hasChanged: true})}
                maxLength={50}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'情感状态'}</Text>
              {this.renderSinglePicker('MarriageStatusName', 'MarriageStatusName', this.state.DictMap.MarriageStatusDict)}
            </View>
            <View style={[styles.listItem, styles.bottomItem]}>
              <Text style={styles.inputLabel}>{'家乡'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Hometown}
                onChangeText={(Hometown)=>this.setState({Hometown: Hometown, hasChanged: true})}
                maxLength={50}/>
            </View>
          </View>
          <TouchableOpacity
            onPress={()=> {
              this._editFriendFilter()
            }}
            style={[styles.userInfo, styles.itemRow, styles.itemEnter]}>
            <Text style={styles.itemTitle}>{'交友信息'}</Text>
            <Icon
              style={styles.itemIcon}
              name={'angle-right'}
              size={20}/>
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={styles.itemTitle}>{'其他'}</Text>
            <View style={[styles.listItem, styles.topItem]}>
              <Text style={styles.inputLabel}>{'学历'}</Text>
              {this.renderSinglePicker('EducationLevelName', 'EducationLevelName', this.state.DictMap.EducationLevelDict)}
            </View>
            <View style={[styles.listItem]}>
              <Text style={styles.inputLabel}>{'地图精度'}</Text>
              {this.renderSinglePicker('mapPrecisionText', 'MapPrecision', this._createMapData())}
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'信仰'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Religion}
                onChangeText={(Religion)=>this.setState({Religion})}
                maxLength={15}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'联系方式'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.MobileNo}
                onChangeText={(MobileNo)=>this.setState({MobileNo})}
                maxLength={15}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'兴趣爱好'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Hobby}
                onChangeText={(Hobby)=>this.setState({Hobby})}
                maxLength={15}/>
            </View>
            <View style={[styles.listItem, styles.bottomItem]}>
              <Text style={styles.inputLabel}>{'自我评价'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.SelfEvaluation}
                onChangeText={(SelfEvaluation)=>this.setState({SelfEvaluation})}
                maxLength={50}/>
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.itemTitle, styles.datingPurposeTitle]}>{'交友目的'}</Text>
            {this.renderDatingPurpose()}
          </View>
        </ScrollView>
      </MenuContext>
    )
  }

}
export default connect((state)=> {
  return {
    ...state
  }
})(EditUserInfo)
