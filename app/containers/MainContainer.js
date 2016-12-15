/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 09:24
 * @description
 */
import React, {Component} from 'react'
import {
  StyleSheet
} from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import Home from './Home'
import Vicinity from './Vicinity'
import Message from './Message'
import Mine from './Mine'
import TabBar from '../components/TabBar'

const styles = StyleSheet.create({
  /**
   * iOS平台下, react-native-scrollable-tab-view是用ScrollView实现的
   * 当react-native-scrollable-tab-view嵌套react-native-viewpager时, 需要给react-native-scrollable-tab-view的子View设置overflow='hidden',
   * ScrollView的removeClippedSubviews才能起作用, 将不在屏幕可视范围的视图移除掉.
   */
  subView: {
    overflow: 'hidden'
  },
  scrollTabView: {
    bottom: 0,
  }
});

//tabBar的icon图标和文字标题
const TAB_BAR_RESOURCES = [
  {name: 'ios-home-outline', size: 28, title: '广场'},
  {name: 'ios-compass-outline', size: 28, title: '附近'},
  {name: 'ios-chatbubbles-outline', size: 28, title: '消息'},
  {name: 'ios-contact-outline', size: 28, title: '我的'}
];

class MainContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScrollableTabView
        style={styles.scrollTabView}
        tabBarPosition="bottom"
        locked={true}
        scrollWithoutAnimation={false}
        prerenderingSiblingsNumber={4}
        initialPage={0}
        renderTabBar={() => {
          return <TabBar tabBarResources={TAB_BAR_RESOURCES}/>
        }}>
        <Home style={styles.subView} navigator={this.props.navigator}/>
        <Vicinity style={styles.subView} navigator={this.props.navigator}/>
        <Message style={styles.subView} navigator={this.props.navigator}/>
        <Mine style={styles.subView} navigator={this.props.navigator}/>
      </ScrollableTabView>
    );
  }
}

export default MainContainer;
