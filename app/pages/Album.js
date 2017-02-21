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
import {ComponentStyles,CommonStyles} from '../style'
import pxToDp from '../utils/PxToDp'
import CacheableImage from 'react-native-cacheable-image'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollView: {
    flex: 1
  },
  singleImgContainer: {
    marginTop: pxToDp(20),
    marginRight: pxToDp(20)
  },
  albumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    paddingLeft: pxToDp(20)
  },
  tipsArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tipsText: {
    fontSize: pxToDp(40),
    paddingHorizontal: pxToDp(20),
    textAlign: 'center'
  },
  closeBtn: {
    position: 'absolute',
    left: pxToDp(40),
    top: pxToDp(40),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal:pxToDp(40)
  },
});

let navigator;
let emitter;

class Album extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      imgLoading: false,
      imgList: [],
      showIndex:0
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

  _openImgModal(arr,index) {
    let tmpArr = [];
    for (let i = 0; i < arr.length; i++) {
      tmpArr.push(URL_DEV + arr[i].PhotoUrl);
    }
    this.setState({
      imgList: tmpArr,
      showIndex:index
    }, ()=> {
      this.refs.modalFullScreen.open();
    });
  }

  _closeImgModal() {
    this.refs.modalFullScreen.close();
  }

  renderAlbum(arr) {
    return arr.map((item, index)=> {
      return (
        <TouchableOpacity
          key={index}
          style={styles.singleImgContainer}
          onPress={()=> {
            this._openImgModal(arr,index)
          }}>
          <CacheableImage
            onLoadEnd={()=> {
              this.setState({imgLoading: false})
            }}
            activityIndicatorProps={{
              style: {width: (width - pxToDp(80)) / 3, height: (width - pxToDp(80)) / 3},
              size: 'large'
            }}
            style={{width: (width - pxToDp(80)) / 3, height: (width - pxToDp(80)) / 3}}
            source={{uri: URL_DEV + item.PhotoUrl}}>
            {this.state.imgLoading ?
              <Image
                source={require('./img/imgLoading.gif')}
                style={{width: (width - pxToDp(80)) / 3, height: (width - pxToDp(80)) / 3}}/> : null}
          </CacheableImage>
        </TouchableOpacity>
      )
    })
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
        <View style={ComponentStyles.container}>
          <ScrollView style={styles.scrollView}>
            <View style={styles.albumContainer}>
              {this.renderAlbum(this.state.photos)}
            </View>
          </ScrollView>
        </View>
      )
    } else {
      return (
        <View style={ComponentStyles.container}>
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
          style={styles.closeBtn}
          onPress={()=> {
            this._closeImgModal()
          }}>
            <IonIcon
              name={'ios-close-outline'}
              size={pxToDp(88)}
              color={'#fff'}
              style={{
                fontWeight: '100'
              }}/>
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
