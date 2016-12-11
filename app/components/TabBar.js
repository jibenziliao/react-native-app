/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 09:47
 * @description
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height:46
  },
  touchableContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#5067FF'
  }
});

class TabBar extends Component {

  constructor(props) {
    super(props);
    if (props.tabBarResources.length !== props.tabs.length) {
      console.warn('ScrollableTabView TabBar config error, please check');
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
                <Icon
                  name={tabBarResources[index].name}
                  size={tabBarResources[index].size}
                  color={activeTab == index ? '#FFF' : '#B2B5B1'}/>
                <Text style={{color: activeTab == index ? '#FFF' : '#B2B5B1'}}>
                  {tabBarResources[index].title}
                </Text>
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


