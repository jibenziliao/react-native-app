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
    backgroundColor: '#000',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
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
        ios:{
          top:25,
        },
        android:{
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

class PhotoScaleViewer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Swiper
        index={this.props.index}
        style={styles.wrapper}
        renderPagination={renderPagination}>
        {
          this.props.imgList.map((item, i) => <View
            key={i}
            style={styles.slide}>
            <TouchableWithoutFeedback
              onPress={e => this.props.pressHandle()}>
              <PhotoView
                source={{uri: item}}
                resizeMode='contain'
                minimumZoomScale={0.5}
                maximumZoomScale={3}
                androidScaleType='center'
                style={styles.photo}/>
            </TouchableWithoutFeedback>
          </View>)
        }
      </Swiper>
    )
  }
}

export default PhotoScaleViewer
