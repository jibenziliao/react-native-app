/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 09:58
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import {getNavigator} from '../navigation/Route'
import NavigationBar from '../components/NavigationBar'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});

class BaseComponent extends Component {
  constructor(props) {
    super(props);
    this.getNavigationBarProps = this.getNavigationBarProps.bind(this);
    this.renderNavigationBar = this.renderNavigationBar.bind(this);
    this.renderBody = this.renderBody.bind(this);
    this.onLeftPressed = this.onLeftPressed.bind(this);
    this.onRightPressed = this.onRightPressed.bind(this);
  }

  /**
   * 子类可重写
   * @returns {null}
   */
  getNavigationBarProps() {
    return null;
  }

  renderNavigationBar() {
    let navigationBarProps = this.getNavigationBarProps();
    navigationBarProps = {...this.props, ...navigationBarProps};
    return (
      <NavigationBar
        navigationBarProps={navigationBarProps}
        onLeftPressed={this.onLeftPressed}
        onRightPressed={this.onRightPressed}
      />
    );
  }

  renderBody() {

  }

  renderSpinner(){

  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.renderNavigationBar()}
        {this.renderBody()}
        {this.renderSpinner()}
      </View>
    );
  }

  componentWillUnmount() {
    return null;
  }

  onLeftPressed() {
    const {navigator}=this.props;
    navigator.pop();
  }

  onRightPressed() {
    console.log('onRightPressed');
  }
}

export default BaseComponent;