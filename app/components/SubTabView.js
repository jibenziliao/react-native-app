/**
 *
 * @author keyy/1501718947@qq.com 17/1/6 16:38
 * @description
 */
import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import {
  TabViewAnimated,
  TabBarTop
} from 'react-native-tab-view'
import MeetList from '../pages/MeetList'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class SubTabView extends Component {

  constructor(props){
    super(props);
    this.state={
      index: 0,
      routes: [
        {key: '1', title: '聚会'},
        {key: '2', title: '约会'},
      ],
      ...this.props
    };

    console.log(this.props);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      ...this.state,
      ...nextProps
    })
  }

  _handleChangeTab = (index) => {
    this.setState({index});
  };

  _renderHeader = (props) => {
    return <TabBarTop {...props} />;
  };

  _renderScene = ({route}) => {
    switch (route.key) {
      case '1':
        return <MeetList style={[styles.page, {backgroundColor: '#ff4081'}]} {...this.state}/>;
      case '2':
        return <View style={[styles.page, {backgroundColor: '#673ab7'}]}/>;
      default:
        return null;
    }
  };

  render() {
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onRequestChangeTab={this._handleChangeTab}
      />
    );
  }
}