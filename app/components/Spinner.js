/**
 *
 * @author keyy/1501718947@qq.com 16/11/15 14:30
 * @description
 */
import React, {Component} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';

const {width, height}=Dimensions.get('window');

class Spinner extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {animating,customStyle}=this.props;
    return (
      <View style={styles.loadingContainer}>
        <View style={[styles.loadingCenter,customStyle]}>
          <ActivityIndicator
            animating={animating}
            style={styles.loading}
            size="large"/>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(142, 142, 142, 0.1)',
    width: width,
    height: height,
    alignItems:'center',
    justifyContent:'center'
  },
  loadingCenter:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    ...Platform.select({
      ios:{
        paddingBottom:20
      },
      android:{
        paddingBottom:StatusBar.currentHeight
      },
    })
  },
  loading: {
    width: width*4/9,
    height: width/3,
    backgroundColor: 'rgba(176, 176, 176, 0.5)',
    borderRadius: 6
  }
});

export default Spinner;

Spinner.propTypes={
  customStyle:View.propTypes.style
};


