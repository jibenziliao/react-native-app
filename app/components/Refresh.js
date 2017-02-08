/**
 *
 * @author keyy/1501718947@qq.com 17/2/8 11:27
 * @description
 */
import React, {Component, PropTypes} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  refreshScreen: {
    ...Platform.select({
      ios: {
        top: 64,
        height: height - 64 - 45.5
      },
      android: {
        top: 54,
        height: height - 54 - 50
      }
    }),
    position: 'absolute',
    left: 0,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center'
  },
  refreshBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderColor: 'gray',
    borderWidth: 1
  },
});

class Refresh extends Component {
  constructor(props) {
    super(props);
  }

  static PropTypes = {
    text: PropTypes.string.isRequired,
    refresh: PropTypes.func.isRequired
  };

  static defaultProps = {
    text: '点击重试'
  };


  render() {
    return (
      <View style={styles.refreshScreen}>
        <View style={styles.center}>
          <TouchableOpacity
            onPress={()=>{this.props.refresh()}}
            style={styles.refreshBtn}>
            <Text>{this.props.text}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default Refresh