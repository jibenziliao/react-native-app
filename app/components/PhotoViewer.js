/**
 *
 * @author keyy/1501718947@qq.com 16/12/7 15:26
 * @description
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  ListView,
  TouchableOpacity,
  Image,
  Picker,
  Platform,
  Dimensions,
  Alert
} from 'react-native'
import {Button as NBButton} from 'native-base'
import Icon from 'react-native-vector-icons/FontAwesome'
import ImagePicker from 'react-native-image-picker'
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu'
import {URL_DEV, TIME_OUT} from '../constants/Constant'

const {width, height}=Dimensions.get('window');

const styles = StyleSheet.create({
  imageContainer: {
    width: (width - 40) / 3,
    height: (width - 40) / 3 + 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginBottom: 10
  },
  photosContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingLeft: 10
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
  image: {
    width: (width - 40) / 3,
    height: (width - 40) / 3,
  },
  deleteImgBtn: {
    height: 30,
    marginVertical: 5
  }
});

class PhotoViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageArr: this.props.imageArr,
      permissionOptions: this.props.permissionOptions,
      uploaded: true
    }
  }

  _renderSelectedValue(data) {
    let result = '';
    for (let i = 0; i < this.state.permissionOptions.length; i++) {
      if (this.state.permissionOptions[i].Key == data.PermissionKey) {
        result = this.state.permissionOptions[i].Value;
        break;
      }
    }
    return result;
  }

  _renderImageStarStatus() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.imageArr[nextProps.imageArr.length - 1].onLine) {
      this.setState({uploaded: true});
    }
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

        /*this.state.imageArr.push({
         Id: (new Date()).getTime().toString(),
         ...source,
         isAvatar: false,
         Permission: 'Everybody',
         PermissionKey: 'Everybody'
         });*/
        this.props.imageArrChanges({
          Id: (new Date()).getTime().toString(),
          ...source,
          isAvatar: false,
          Permission: 'Everybody',
          PermissionKey: 'Everybody'
        });
        this.setState({
          uploaded: false
        });
      }
    });
  }

  _deletePhoto(data) {
    if (!data.onLine) {
      this.props.deletePhotoOffline(data);
    } else {
      this.props.deletePhotoOnline(data);
    }
  }

  _deletePhotoAlert(data) {
    Alert.alert('提示', '您确定要删除这张照片吗?', [
      {
        text: '确定', onPress: () => {
        this._deletePhoto(data)
      }
      },
      {
        text: '取消', onPress: () => {
      }
      }
    ]);
  }

  _changePermissionAlert(data, value) {
    if (!this.state.uploaded) {
      Alert.alert('提示', '您有照片未上传,点击确定上传照片!', [
        {
          text: '确定', onPress: () => {
          this.props.upload(data)
        }
        },
        {
          text: '取消', onPress: () => {
        }
        }
      ]);
    } else {
      data.PermissionKey = value;
      this.props.changePermission(data)
    }

  }

  _renderPermissionOptions(data) {
    return (
      <Menu
        style={{flex: 1}}
        onSelect={(value) => {
          this._changePermissionAlert(data, value);
        }}>
        <MenuTrigger>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F0F0F0',
            height: 30,
            borderRadius: 4,
            width: (width - 40) / 3,
            paddingHorizontal: 5
          }}>
            <Text>{this._renderSelectedValue(data)}</Text>
            <Icon name="angle-down" size={16}/>
          </View>
        </MenuTrigger>
        <MenuOptions
          optionsContainerStyle={{flex: 1}}>
          {this.state.permissionOptions.map((item, index)=> {
            return (
              <MenuOption
                key={index}
                value={item.Key}
                text={item.Value}/>
            )
          })}
        </MenuOptions>
      </Menu>
    )
  }

  render() {
    return (
      <View style={styles.photosContainer}>
        <TouchableOpacity
          onPress={()=> {
            this._initImagePicker()
          }}
          style={[styles.takePhotoBtn, {height: (width - 40) / 3 + 70}]}>
          <Icon name={'picture-o'} size={30}/>
          <Text>{'添加照片'}</Text>
        </TouchableOpacity>
        {this.state.imageArr.map((item, index)=> {
          return (
            <View
              key={index}
              style={styles.imageContainer}>
              <Image
                source={{uri: item.onLine ? URL_DEV + item.PhotoUrl : item.PhotoUrl}}
                style={styles.image}/>
              <TouchableOpacity
                onPress={()=> {
                  this._renderImageStarStatus()
                }}
                style={styles.imageStar}>
                <Icon
                  name={item.isAvatar ? 'star' : 'star-o'}
                  size={32}
                  color={'blue'}/>
              </TouchableOpacity>
              <NBButton
                block
                bordered
                style={styles.deleteImgBtn}
                onPress={()=> {
                  this._deletePhotoAlert(item)
                }}>
                删除
              </NBButton>
              {this._renderPermissionOptions(item)}
            </View>
          )
        })}
      </View>
    )
  }
}

export default PhotoViewer