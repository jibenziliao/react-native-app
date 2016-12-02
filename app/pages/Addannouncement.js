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
  Alert
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
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
import * as DateUtil from '../utils/DateUtil'

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
    height: 150,
    backgroundColor: '#FFF',
    textAlign: 'left',
    textAlignVertical: 'top'
  },
  scrollViewHorizontal: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
    marginTop: 10
  },
  takePhotoBtn: {
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginRight: 10
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
  days: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingLeft: 10
  },
  pickerView: {
    marginRight: 10,
    paddingLeft: 10,
    borderRadius: 4,
    height: 40
  },
  picker: {
    width: 100,
    height: 40
  },
  tips: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff'
  },
  link: {
    textDecorationLine: 'underline',
    color: 'blue',
    marginTop: 10
  }
});

class Addannouncement extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      PostContent: '',
      imageArr: [],
      myLocation: this.props.route.params.myLocation,
      days: '1'
    };
  }

  componentDidMount() {

  }

  getNavigationBarProps() {
    return {
      title: '发布新公告',
      hideRightButton: false,
      rightTitle: '完成'
    };
  }

  //点击完成
  onRightPressed() {
    const {dispatch, navigator}=this.props;
    dispatch(HomeActions.postAnnouncement(this.state, navigator));

    /*navigator.push({
     component: Addannouncement,
     name: 'Addannouncement'
     })*/
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

  _renderPicker() {
    if (Platform.OS == 'ios') {
      return (
        <View style={{width: 80, height: 40, marginRight: 20, borderRadius: 4}}>
          {this._renderPickerIOS()}
        </View>
      )
    } else {
      return (
        <View
          style={styles.pickerView}>
          <Picker
            style={styles.picker}
            selectedValue={this.state.days}
            onValueChange={
              (days) => {
                this.setState({days});
              }}>
            <Picker.Item label="1天" value="1"/>
            <Picker.Item label="2天" value="2"/>
            <Picker.Item label="3天" value="3"/>
          </Picker>
        </View>
      )
    }
  }

  _renderPickerIOS() {
    return (
      <Menu
        onSelect={(days) => {
          this.setState({days});
        }}>
        <MenuTrigger>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 40,
            alignItems: 'center',
            paddingHorizontal: 10
          }}>
            <Text>{this.state.days}{'天'}</Text>
            <Icon name="angle-down" size={16} style={{marginRight: 10}}/>
          </View>
        </MenuTrigger>
        <MenuOptions
          optionsContainerStyle={{width: 80}}>
          <MenuOption value={'1'} text='1天'/>
          <MenuOption value={'2'} text="2天"/>
          <MenuOption value={'3'} text="3天"/>
        </MenuOptions>
      </Menu>
    )
  }

  renderBody() {
    return (
      <MenuContext style={styles.container}>
        <View style={styles.announcementArea}>
          <TextInput
            placeholder={'此时此地,想和大家说点什么?'}
            multiline={true}
            maxLength={300}
            style={styles.postContent}
            value={this.state.PostContent}
            underlineColorAndroid={'transparent'}
            onChangeText={(PostContent)=> {
              this.setState({PostContent})
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
        </View>
        <View style={styles.days}>
          <Text>{'在广场上持续:'}</Text>
          {this._renderPicker()}
        </View>
        <View style={styles.tips}>
          <Text>{'注:持续时间过期后,将不在广场上显示'}</Text>
          <Text
            onPress={()=> {
              console.log('123')
            }}
            style={styles.link}>{'查看求关注历程'}</Text>
        </View>
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
    ...state,
    pendingStatus: state.Photo.pending
  }
})(Addannouncement)
