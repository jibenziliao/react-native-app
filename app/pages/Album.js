/**
 *
 * @author keyy/1501718947@qq.com 17/2/8 14:48
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  InteractionManager,
  DeviceEventEmitter,
  NativeAppEventEmitter
} from 'react-native'
import BaseComponent from '../base/BaseComponent'
import {connect} from 'react-redux'
import * as HomeActions from '../actions/Home'
import {URL_DEV} from '../constants/Constant'
import ModalBox from 'react-native-modalbox'
import PhotoScaleViewer from '../components/PhotoScaleViewer'
import IonIcon from 'react-native-vector-icons/Ionicons'
import EditPhotos from '../pages/EditPhotos'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  scrollView: {
    flex: 1
  },
  singleImgContainer: {
    marginBottom: 10,
    marginRight: 10
  },
  albumContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'flex-start',
    justifyContent:'flex-start'
  },
  tipsArea: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tipsText: {
    fontSize: 20,
    paddingHorizontal: 20,
    textAlign: 'center'
  },
});

let navigator;
let emitter;

class Album extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      imgLoading: true,
      imgList: []
    };
    navigator = this.props.navigator;
    emitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter;
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=> {
      this._initPhotos();
    });
    this._photoListener = emitter.addListener('photoChanged', ()=> {
      this._initPhotos();
    });
  }

  componentWillUnmount() {
    this._photoListener.remove();
  }

  getNavigationBarProps() {
    return {
      title: '相册',
      hideRightButton: false,
      rightTitle: '编辑'
    };
  }

  onRightPressed() {
    navigator.push({
      component: EditPhotos,
      name: 'EditPhotos'
    });
  }

  _initPhotos() {
    const {dispatch}=this.props;
    dispatch(HomeActions.getUserPhotos({UserId: this.props.route.params.UserId}, (json)=> {
      this.setState({
        photos: json.Result.PhotoList
      });
    }, (error)=> {
    }));
  }

  _openImgModal(arr) {
    let tmpArr = [];
    for (let i = 0; i < arr.length; i++) {
      tmpArr.push(URL_DEV + arr[i].PhotoUrl);
    }
    this.setState({
      imgList: tmpArr
    }, ()=> {
      this.refs.modalFullScreen.open();
    });
  }

  _closeImgModal() {
    this.refs.modalFullScreen.close();
  }

  renderAlbum(arr) {
    let arrCopy = JSON.parse(JSON.stringify(arr));
    if (arr.length > 3) {
      arrCopy.splice(3, arr.length - 3);
    }
    return (
      <View style={styles.albumContainer}>
        {arrCopy.map((item, index)=> {
          return (
            <TouchableOpacity
              key={index}
              style={styles.singleImgContainer}
              onPress={()=> {
                this._openImgModal(arr)
              }}>
              <Image
                onLoadEnd={()=> {
                  this.setState({imgLoading: false})
                }}
                style={{width: (width - 40) / 3, height: (width - 40) / 3}}
                source={{uri: URL_DEV + item.PhotoUrl}}>
                {this.state.imgLoading ?
                  <Image
                    source={require('./img/imgLoading.gif')}
                    style={{width: (width - 40) / 3, height: (width - 40) / 3}}/> : null}
              </Image>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  renderEmptyAlbum() {
    return (
      <View style={styles.tipsArea}>
        <Text style={styles.tipsText}>{'你还没有照片'}</Text>
        <Text style={styles.tipsText}>{'点击右上角编辑按钮上传照片'}</Text>
      </View>
    )
  }

  renderBody() {
    if (this.state.photos.length > 0) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.scrollView}>
            {this.renderAlbum(this.state.photos)}
          </ScrollView>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          {this.renderEmptyAlbum()}
        </View>
      )
    }
  }

  renderModal() {
    return (
      <ModalBox
        style={{
          position: 'absolute',
          width: width,
          ...Platform.select({
            ios: {
              height: height
            },
            android: {
              height: height
            }
          }),
          backgroundColor: 'rgba(40,40,40,0.8)',
        }}
        backButtonClose={true}
        position={"center"}
        ref={"modalFullScreen"}
        swipeToClose={true}
        onClosingState={this.onClosingState}>
        <PhotoScaleViewer
          index={this.state.showIndex}
          pressHandle={()=> {
            console.log('你点击了图片,此方法必须要有,否则不能切换下一张图片')
          }}
          imgList={this.state.imgList}/>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 20,
            ...Platform.select({
              ios: {
                top: 15
              },
              android: {
                top: 10
              }
            }),
          }}
          onPress={()=> {
            this._closeImgModal()
          }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <IonIcon name={'ios-close-outline'} size={44} color={'#fff'} style={{
              fontWeight: '100'
            }}/>
          </View>
        </TouchableOpacity>
      </ModalBox>
    )
  }

}

export default connect((state)=> {
  return {
    ...state
  }
})(Album)
