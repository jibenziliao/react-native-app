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
  Dimensions
} from 'react-native';

const {width, height}=Dimensions.get('window');

class Spinner extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {animating}=this.props;
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          animating={animating}
          style={styles.loading}
          size="large"/>
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
  },
  loading: {
    position: 'absolute',
    left: width / 2 - 80,
    top: 200,
    width: 160,
    height: 120,
    backgroundColor: 'rgba(176, 176, 176, 0.5)',
    borderRadius: 6
  }
});

export default Spinner;


