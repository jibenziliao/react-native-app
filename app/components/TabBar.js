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
} from 'react-native'
import IonIcon from 'react-native-vector-icons/Ionicons'

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
    backgroundColor: '#5067FF'
  },
  badgeContainer: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 4,
    right: 8,
    width: width / 18,
    height: width / 16,
    borderRadius: width / 36,
  },
  badgeText: {
    color: '#fff'
  }
});

class TabBar extends Component {

  constructor(props) {
    super(props);
    if (props.tabBarResources.length !== props.tabs.length) {
      console.warn('ScrollableTabView TabBar config error, please check');
    }
  }

  renderBadge(index) {
    if (this.props.unReadCount > 0 && index === 2) {
      return (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{this.props.unReadCount}</Text>
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
                  color={activeTab === index ? '#FFF' : '#B2B5B1'}/>
                <Text
                  style={{color: activeTab === index ? '#FFF' : '#B2B5B1'}}>
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


