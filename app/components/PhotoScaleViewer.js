/**
 *
 * @author keyy/1501718947@qq.com 16/12/27 15:07
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Platform
} from 'react-native'
import PhotoView from 'react-native-photo-view'
import Swiper from 'react-native-swiper'

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photo: {
    width: width,
    height: height,
    flex: 1
  },
});

const renderPagination = (index, total, context) => {
  return (
    <View style={{
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          top: 25,
        },
        android: {
          top: 15,
        }
      }),
      left: 0,
      right: 0
    }}>
      <View style={{
        borderRadius: 7,
        backgroundColor: 'rgba(255,255,255,.15)',
        padding: 3,
        paddingHorizontal: 7
      }}>
        <Text style={{
          color: '#fff',
          fontSize: 14
        }}>{index + 1} / {total}</Text>
      </View>
    </View>
  )
};

class Viewer extends Component{
  constructor(props){
    super(props);
    this.state={
      imgLoading:true,
      item:this.props.item
    };
  }

  render(){
    return(
      <Image
        onLayout={()=>{console.log('挂载')}}
        onLoad={()=>{this.setState({imgLoading:false})}}
        defaultSource={require('./img/imgLoading.gif')}
        source={{uri: this.state.item}}
        resizeMode='cover'
        minimumZoomScale={0.5}
        maximumZoomScale={3}
        androidScaleType='fitCenter'
        style={styles.photo}>
        {this.state.imgLoading ?
          <Image
            source={require('./img/imgLoading.gif')}
            style={{width: width, height: height}}/> : null}
      </Image>
    )
  }
}

class PhotoScaleViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgLoading: true,
      ...this.props
    };
    console.log(this.props);
  }

  _renderPhotos() {
    return (
      this.props.imgList.map((item, i) => <View
        key={i}
        style={styles.slide}>
        <Viewer
          item={item}/>
        {/*<PhotoView
          onLayout={()=>{console.log('挂载')}}
          onLoad={()=>{this.setState({imgLoading:false})}}
          defaultSource={require('./img/imgLoading.gif')}
          source={{uri: item}}
          resizeMode='cover'
          minimumZoomScale={0.5}
          maximumZoomScale={3}
          androidScaleType='fitCenter'
          style={styles.photo}>
          {this.state.imgLoading ?
            <Image
              source={require('./img/imgLoading.gif')}
              style={{width: width, height: height}}/> : null}
        </PhotoView>*/}
      </View>)
    )
  }

  render() {
    return (
      <Swiper
        removeClippedSubviews={false}
        index={this.props.index}
        style={styles.wrapper}
        renderPagination={renderPagination}>
        {this._renderPhotos()}
      </Swiper>
    )
  }
}

export default PhotoScaleViewer
