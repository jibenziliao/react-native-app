/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 09:47
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform
} from 'react-native'
import IonIcon from 'react-native-vector-icons/Ionicons'
import pxToDp from '../utils/PxToDp'
import {CommonStyles, StyleConfig} from '../style'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  touchableContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopColor: '#cecece',
    borderTopWidth: StyleSheet.hairlineWidth,
    ...Platform.select({
      ios: {
        height: pxToDp(97)
      },
      android: {
        height: pxToDp(97)
      }
    }),
    paddingTop: pxToDp(6),
    paddingBottom: pxToDp(10)
  },
  badgeContainer: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: pxToDp(8),
    right: pxToDp(16),
    borderRadius: pxToDp(17),
    paddingHorizontal:pxToDp(4),
    ...Platform.select({
      ios:{
        paddingTop:pxToDp(4),
        paddingBottom:pxToDp(6),
      },
      android:{
        paddingVertical:pxToDp(4)
      }
    })
  },
  badgeText: {
    color: '#fff',
    fontSize: pxToDp(18),
    flexDirection: 'row',
    width: pxToDp(36),
    textAlign:'center'
  }
});

class TabBar extends Component {

  constructor(props) {
    super(props);
    if (props.tabBarResources.length !== props.tabs.length) {
      console.warn('ScrollableTabView TabBar config error, please check');
    }
  }

  _badgeCountHandler(value) {
    return parseInt(value) > 99 ? '99+' : value;
  }

  renderBadge(index) {
    if (this.props.unReadCount > 0 && index === 2) {
      return (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>
            {this._badgeCountHandler(this.props.unReadCount)}
          </Text>
        </View>
      )
    } else {
      return null
    }
  }

  render() {
    const {
      tabBarResources,
      activeTab,
      tabs,
      goToPage
    } = this.props;
    return (
      <View style={styles.container}>
        {
          tabs.map((tab, index) => {
            return (
              <TouchableOpacity
                style={styles.touchableContainer}
                key={index}
                onPress={() => {
                  goToPage(index)
                }}
                activeOpacity={1}>
                <IonIcon
                  name={tabBarResources[index].name}
                  size={tabBarResources[index].size}
                  color={activeTab === index ? StyleConfig.color_primary : '#B2B5B1'}/>
                <Text
                  style={{color: activeTab === index ? StyleConfig.color_primary : '#B2B5B1', fontSize: pxToDp(22)}}>
                  {tabBarResources[index].title}
                </Text>
                {this.renderBadge(index)}
              </TouchableOpacity>
            );
          })
        }
      </View>
    );
  }
}

TabBar.propTypes = {
  tabBarResources: React.PropTypes.array.isRequired,
  activeTab: React.PropTypes.number,
  tabs: React.PropTypes.array
};

export default TabBar;


