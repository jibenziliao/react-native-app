/**
 * 添加公告页面
 * @author keyy/1501718947@qq.com 16/11/30 18:21
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  InteractionManager,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  PickerIOS,
  ActionSheetIOS,
  Picker,
  Alert,
  Keyboard
} from 'react-native'
import {connect} from 'react-redux'
import {componentStyles} from '../style'
import BaseComponent from '../base/BaseComponent'
import Icon from 'react-native-vector-icons/FontAwesome'
import ImagePicker from 'react-native-image-picker'
import Spinner from '../components/Spinner'
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'
import * as HomeActions from '../actions/Home'
import AnnouncementList from '../pages/AnnouncemenetList'
import tmpGlobal from '../utils/TmpVairables'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  announcementArea: {
    margin: 10
  },
  postContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    height: width / 3,
    backgroundColor: '#FFF',
    textAlign: 'left',
    textAlignVertical: 'top',
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  scrollViewHorizontal: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: 10,
    paddingVertical: 10
  },
  takePhotoBtn: {
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginHorizontal: 10
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 4
  },
  deleteImgBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectLabel: {
    width: width / 3
  },
  days: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    marginTop: 10
  },
  pickerView: {
    marginRight: 10,
    paddingLeft: 10,
    borderRadius: 4,
    height: 40
  },
  picker: {
    width: 160,
    height: 40
  },
  tips: {
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 10
  },
  link: {
    textDecorationLine: 'underline',
    color: 'blue',
    marginTop: 10
  }
});

let navigator;
const dict = {
  days: [
    {Key: 1, Value: '1天'},
    {Key: 2, Value: '2天'},
    {Key: 3, Value: '3天'}],
  numberOfPeople: [
    {Key: 1, Value: '2-3人'},
    {Key: 2, Value: '4-5人'},
    {Key: 3, Value: '5人以上'}],
  cost: [
    {Key: 1, Value: '我请客'},
    {Key: 2, Value: 'AA'},
    {Key: 3, Value: '男AA女免费'}]
};

class Addannouncement extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      PostContent: '',
      imageArr: [],
      days: 1,
      PartyPeopleNumber: 1,
      PartyPayType: 1,
      ...this.props.route.params
    };

    navigator = this.props.navigator;
  }

  getNavigationBarProps() {
    return {
      title: this.state.title,
      hideRightButton: false,
      rightTitle: '完成'
    };
  }

  //点击完成
  onRightPressed() {
    Keyboard.dismiss();
    const {dispatch, navigator}=this.props;
    this.state.PostContent = this.state.PostContent.trim();
    dispatch(HomeActions.postAnnouncement(this.state, navigator));
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
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          source = {uri: response.uri, isStatic: true};
        }
        this.state.imageArr.push({
          id: (new Date()).getTime().toString(),
          ...source
        });
        this.setState({imageArr: this.state.imageArr});
        console.log(this.state.imageArr);
      }
    });
  }

  _deletePhoto(id) {
    Alert.alert('提示', '确定要删除这张照片吗?', [
      {
        text: '确定',
        onPress: () => {
          let index = this.state.imageArr.findIndex((item)=> {
            return item.id == id;
          });
          this.state.imageArr.splice(index, 1);
          this.setState({
            imageArr: [...this.state.imageArr]
          });
        }
      },
      {
        text: '取消',
        onPress: () => {
        }
      }
    ]);
  }

  //前往我的历史公告列表
  _goAnnouncementList() {
    navigator.push({
      component: AnnouncementList,
      name: 'AnnouncementList',
      params: {
        targetUserId: tmpGlobal.currentUser.UserId,
        Nickname: tmpGlobal.currentUser.Nickname
      }
    });
  }

  //渲染拍好的照片
  _renderImg(data) {
    return data.map((item, index)=> {
      return (
        <View
          key={index}
          style={{width: 80, height: 80, marginRight: 10}}>
          <Image
            source={{uri: item.uri}}
            style={styles.image}/>
          <TouchableOpacity
            onPress={()=> {
              this._deletePhoto(item.id)
            }}
            style={styles.deleteImgBtn}>
            <Icon name={"times"} size={20}/>
          </TouchableOpacity>
        </View>
      )
    });
  }

  _renderPicker(arr, str, callBack) {
    if (Platform.OS == 'ios') {
      return (
        <View style={{width: 80, height: 40, marginRight: 20, borderRadius: 4}}>
          {this._renderPickerIOS(arr, str, callBack)}
        </View>
      )
    } else {
      return (
        <View
          style={styles.pickerView}>
          <Picker
            style={styles.picker}
            selectedValue={str}
            onValueChange={(str)=> {
              callBack(str)
            }}>
            {this.renderPickerItem(arr)}
          </Picker>
        </View>
      )
    }
  }

  renderPickerItem(arr) {
    return arr.map((item, index)=> {
      return <Picker.Item
        key={index}
        label={item.Value}
        value={item.Key}/>
    })
  }

  renderPickerIOSLabel(arr, str) {
    let index = arr.findIndex((item)=> {
      return item.Key === str;
    });
    return arr[index].Value;
  }

  _renderPickerIOS(arr, str, callBack) {
    return (
      <Menu
        onSelect={(str)=> {
          callBack(str)
        }}>
        <MenuTrigger>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 40,
            alignItems: 'center',
            paddingHorizontal: 10
          }}>
            <Text>{this.renderPickerIOSLabel(arr, str)}</Text>
            <Icon name="angle-down" size={16} style={{marginRight: 10}}/>
          </View>
        </MenuTrigger>
        <MenuOptions
          optionsContainerStyle={{width: 80}}>
          {this.renderMenuOption(arr)}
        </MenuOptions>
      </Menu>
    )
  }

  renderMenuOption(arr) {
    return arr.map((item, index)=> {
      return <MenuOption
        key={index}
        value={item.Key}
        text={item.Value}/>
    })
  }

  _daysHandle(days) {
    this.setState({days: days});
  }

  _costHandle(PartyPayType) {
    this.setState({PartyPayType: PartyPayType});
  }

  _numberHandle(number) {
    this.setState({PartyPeopleNumber: number});
  }

  //渲染聚会人数/费用等信息
  renderOptions() {
    if (this.state.postType === 1) {
      return (
        <View>
          <View style={styles.days}>
            <Text style={styles.selectLabel}>{'聚会人数:'}</Text>
            {this._renderPicker(dict.numberOfPeople, this.state.PartyPeopleNumber, this._numberHandle.bind(this))}
          </View>
          <View style={styles.days}>
            <Text style={styles.selectLabel}>{'费用:'}</Text>
            {this._renderPicker(dict.cost, this.state.PartyPayType, this._costHandle.bind(this))}
          </View>
        </View>
      )
    } else {
      return null;
    }
  }

  renderBody() {
    return (
      <MenuContext style={styles.container}>
        <ScrollView
          style={styles.announcementArea}
          keyboardDismissMode={'interactive'}>
          <TextInput
            placeholder={'此时此地,想和大家说点什么?'}
            multiline={true}
            maxLength={500}
            style={styles.postContent}
            value={this.state.PostContent}
            underlineColorAndroid={'transparent'}
            onChangeText={(PostContent)=> {
              this.setState({PostContent: PostContent})
            }}
          />
          <View style={{flexDirection: 'row'}}>
            <ScrollView
              horizontal={true}
              style={styles.scrollViewHorizontal}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={()=> {
                  this._initImagePicker()
                }}
                style={styles.takePhotoBtn}>
                <Icon name={'picture-o'} size={30}/>
                <Text>{'图片'}</Text>
              </TouchableOpacity>
              {this._renderImg(this.state.imageArr)}
            </ScrollView>
          </View>
          {this.renderOptions()}
          <View style={styles.days}>
            <Text style={styles.selectLabel}>{'在广场上持续:'}</Text>
            {this._renderPicker(dict.days, this.state.days, this._daysHandle.bind(this))}
          </View>
          <View style={styles.tips}>
            <Text>{'注:持续时间过期后,将不在广场上显示'}</Text>
            <Text
              onPress={()=> {
                this._goAnnouncementList()
              }}
              style={styles.link}>{'查看求关注历程'}</Text>
          </View>
        </ScrollView>
      </MenuContext>
    )
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
    pendingStatus: state.Photo.pending
  }
})(Addannouncement)
