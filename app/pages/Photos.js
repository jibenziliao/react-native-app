/**
 *
 * @author keyy/1501718947@qq.com 16/11/19 14:41
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableHighlight,
  Animated,
  Picker,
  Image,
  Platform,
  PickerIOS,
  ActionSheetIOS,
  Dimensions
} from 'react-native'
import BaseComponent from '../base/BaseComponent'
import MainContainer from '../containers/MainContainer'
import Icon from 'react-native-vector-icons/FontAwesome'
import Modal from 'react-native-modalbox'
import {Button as NBButton} from 'native-base'
import {StyleConfig, CommonStyles} from '../style'
import ImagePicker from 'react-native-image-picker'
import ImageViewer from '../components/ImageViewer'
import Spinner from '../components/Spinner'
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';


const {width, height}=Dimensions.get('window');

const styles=StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 10
  },
  tips: {
    textAlign: 'center',
    marginHorizontal: 10,
    marginVertical: 30,
    fontSize: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    paddingHorizontal: 10,
    paddingVertical: 30
  },
});

class Photos extends BaseComponent {
  constructor(props) {
    super(props);
    this.state={
      imageArr:[]
    };
  }

  //去首页
  goHome(){
    const {navigator} =this.props;
    navigator.push({
      component: MainContainer,
      name: 'MainContainer'
    });
  }

  getNavigationBarProps() {
    return {
      title: '照片'
    };
  }

  initImagePicker() {
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

        let tmpPhotoArr = [];
        //if (this.props.photoArr && this.props.photoArr.data) {
        //  console.log(this.props.photoArr.data);
        //  for (let i = 0; i < this.props.photoArr.data.length; i++) {
        //    tmpPhotoArr.push(this.props.photoArr.data[i]);
        //  }
        //}


        this.state.imageArr.push(source);
        this.setState({imageArr:this.state.imageArr});
        console.log(source);
        console.log(this.state.imageArr);
        //如果从交友要求页返回过来,再次拍照会清空之前已拍照内容
        tmpPhotoArr.push({
          id: (new Date()).getTime().toString(),
          ...source,
          Permission: 'Everybody'
        });
      }
    });
  }

  renderImage(data) {
    if (data.length>0) {
      return (
        <ImageViewer
          dataSource={data}
          deletePhoto={(data)=> {
            this.deletePhoto(data)
          }}
          setAvatar={(data)=> {
            this.setAvatar(data)
          }}
          setPermission={()=> {
            this.setPermission()
          }}
        />
      )
    } else {
      return (
        <View>
          <Text style={styles.tips}>
            点击拍照按钮,拍摄照片,或者点击下一步跳过此步骤(您仍可以在个人信息中上传您的照片)
          </Text>
        </View>
      )
    }
  }

  setAvatar(data) {
    console.log('setAvatar');
  }

  setPermission() {
    console.log('setPermission');
  }

  deletePhoto(data) {
    console.log('deletePhoto');
  }

  renderBody() {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          keyboardDismissMode={'none'}
          keyboardShouldPersistTaps={true}>
          {this.renderImage(this.state.imageArr)}
          <NBButton
            block
            style={{marginVertical: 30}}
            onPress={()=> {
              this.initImagePicker()
            }}>
            拍照
          </NBButton>
          <NBButton
            block
            style={{marginBottom: 30}}
            onPress={()=> {
              this.goHome()
            }}>
            去首页(Test)
          </NBButton>
        </ScrollView>
      </View>
    )
  }
}

export default Photos