/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 10:03
 * @description
 */
import React, {Component} from 'react'
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  navigationBar: {
    backgroundColor: '#4CD472',
    ...Platform.select({
      ios: {
        height: 64
      },
      android: {
        height: 54
      }
    }),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    flexDirection: 'row'
  },
  navigationBarTitleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 80,
    right: 80,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        top: 20
      },
      android: {
        top: 0
      }
    })
  },
  navigationBarTitle: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  leftButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 60,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        top: 20
      },
      android: {
        top: 0
      }
    })
  },
  rightButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        top: 20
      },
      android: {
        top: 0
      }
    })
  },
  rightButtonTextStyle: {
    color: '#FFF',
    textAlign: 'right',
    fontSize: 16
  },
});

const defaultNavigationBarProps = {
  hideNav: false,
  hideLeftButton: false,
  hideRightButton: true
};

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.navigationBarProps = {
      ...defaultNavigationBarProps,
      ...props.navigationBarProps
    };
  }

  componentWillReceiveProps(nextProps) {
    this.navigationBarProps = {
      ...defaultNavigationBarProps,
      ...nextProps.navigationBarProps
    };
  }

  renderLeftButton() {
    if (this.navigationBarProps.hideLeftButton) {
      return null;
    }
    let {onLeftPressed} = this.props;
    let name = this.navigationBarProps.leftIcon && this.navigationBarProps.leftIcon.name ? this.navigationBarProps.leftIcon.name : 'angle-left';
    let size = this.navigationBarProps.leftIcon && this.navigationBarProps.leftIcon.size ? this.navigationBarProps.leftIcon.size : 30;
    return (
      <TouchableOpacity onPress={onLeftPressed} style={[styles.leftButton, this.navigationBarProps.leftButton]}>
        <Icon name={name} size={size} color={'#FFF'}/>
      </TouchableOpacity>
    );
  }

  renderRightButton() {
    if (this.navigationBarProps.hideRightButton) {
      return null;
    }
    //优先Icon, text次之
    let {onRightPressed} = this.props;
    let component;
    let name = this.navigationBarProps.rightIcon && this.navigationBarProps.rightIcon.name ? this.navigationBarProps.rightIcon.name : 'bars';
    let size = this.navigationBarProps.rightIcon && this.navigationBarProps.rightIcon.size ? this.navigationBarProps.rightIcon.size : 24;
    if (!this.navigationBarProps.hideRightButton && !this.navigationBarProps.rightTitle) {
      component = (
        <Icon name={name} size={size} color={'#FFF'}/>
      );
    } else if (this.navigationBarProps.rightTitle && this.navigationBarProps.rightTitle !== '') {
      component = (
        <Text
          style={[styles.rightButtonTextStyle, this.navigationBarProps.rightButtonTextStyle]}>{this.navigationBarProps.rightTitle}</Text>
      );
    } else {
      return null;
    }

    return (
      <TouchableOpacity onPress={onRightPressed} style={[styles.rightButton, this.navigationBarProps.rightButton]}>
        {component}
      </TouchableOpacity>
    );
  }

  render() {
    const {hideNav, title} = this.navigationBarProps;
    if (hideNav) {
      return null;
    }
    if (!title) {
      console.warn('你需要给页面设置标题');
    }
    return (
      <View style={[styles.navigationBar, this.navigationBarProps.navigationBar]}>
        {this.renderLeftButton()}
        {this.renderRightButton()}
        <View style={styles.navigationBarTitleContainer}>
          <Text numberOfLines={1}
                style={[styles.navigationBarTitle, this.navigationBarProps.navigationBarTitle]}>{title}</Text>
        </View>
      </View>
    );
  }
}

export default NavigationBar;


