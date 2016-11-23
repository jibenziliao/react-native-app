/**
 *
 * @author keyy/1501718947@qq.com 16/11/23 19:41
 * @description
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Platform
} from "react-native"
import Icon from 'react-native-vector-icons/Ionicons'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  labelContainer: {
    marginLeft: 10,
    marginRight: 10
  },
  label: {
    fontSize: 16,
    lineHeight: 16,
    color: 'grey',
  }
});

class CheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked,
    };
  }

  getInitialStyle() {
    return {
      checkbox: {
        flexDirection: 'row'
      },
      checkboxView: {
        width: 20,
        height: 20,
        paddingLeft: (Platform.OS === 'ios') ? 5 : 2,
        paddingBottom: (Platform.OS === 'ios') ? 0 : 5,
        overflow: 'hidden',
        borderWidth: (Platform.OS === 'ios') ? 1 : 2,
        borderColor: '#039BE5',
        borderRadius: (Platform.OS === 'ios') ? 11 : 2,
        backgroundColor: this.state.checked ? '#039BE5' : 'transparent',
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      checked: nextProps.checked
    });
  }

  toggle() {
    this.setState({checked: !this.state.checked});
    //setState方法时异步的,此时this.state.checked还没么有更新,所以这里onChange()传参传的是!this.state.checked
    this.props.onChange(!this.state.checked);
  }

  render() {
    return (
      <TouchableOpacity
        ref="checkbox"
        style={this.getInitialStyle().checkbox}
        onPress={this.toggle.bind(this)}>
        <View style={this.getInitialStyle().checkboxView}>
          <Icon
            name={(Platform.OS === 'ios') ? 'ios-checkmark-outline' : 'md-checkmark'}
            style={[{
              color: this.state.checked ? '#fff' : 'transparent',
              lineHeight: (Platform.OS === 'ios') ? 20 : 16,
              marginTop: (Platform.OS === 'ios') ? undefined : 1,
              fontSize: (Platform.OS === 'ios') ? 16 : 16
            }, this.props.iconStyle]}/>
        </View>
        <Text style={[styles.label, this.props.labelStyle]}>{this.props.label}</Text>
      </TouchableOpacity>
    )
  }
}
export default CheckBox

CheckBox.propTypes = {
  label: React.PropTypes.string.isRequired,
  checked: React.PropTypes.bool.isRequired,
  onChange: React.PropTypes.func.isRequired,
  iconStyle: React.PropTypes.object,
  labelStyle: React.PropTypes.object,
  labelLeft: React.PropTypes.bool
};

CheckBox.defaultProps = {
  label: 'Label',
  labelLeft: false,
  checked: false
};

