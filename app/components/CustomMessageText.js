/**
 *
 * @author keyy/1501718947@qq.com 16/12/22 22:37
 * @description
 */
import React ,{Component}from 'react'
import {
  Linking,
  StyleSheet,
  Text,
  View,
  Clipboard
} from 'react-native'

import ParsedText from 'react-native-parsed-text'
import Communications from 'react-native-communications'

export default class CustomMessageText extends Component {
  constructor(props) {
    super(props);
    this.onUrlPress = this.onUrlPress.bind(this);
    this.onPhonePress = this.onPhonePress.bind(this);
    this.onEmailPress = this.onEmailPress.bind(this);
  }

  onUrlPress(url) {
    Linking.openURL(url);
  }

  onPhonePress(phone) {
    const options = [
      '复制',
      '取消',
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString(this.props.currentMessage.text);
            break;
        }
      });
  }

  onEmailPress(email) {
    const options = [
      '复制',
      '取消',
    ];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions({
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString(this.props.currentMessage.text);
            break;
        }
      });
  }

  render() {
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        <ParsedText
          style={[styles[this.props.position].text, this.props.textStyle[this.props.position]]}
          parse={[
            {type: 'url', style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onUrlPress},
            {type: 'phone', style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onPhonePress},
            {type: 'email', style: StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]), onPress: this.onEmailPress},
          ]}
        >
          {this.props.currentMessage.text}
        </ParsedText>
      </View>
    );
  }
}

const textStyle = {
  fontSize: 16,
  lineHeight: 20,
  marginTop: 5,
  marginBottom: 5,
  marginLeft: 10,
  marginRight: 10,
};

const styles = {
  left: StyleSheet.create({
    container: {
    },
    text: {
      color: 'black',
      ...textStyle,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {
    },
    text: {
      color: 'white',
      ...textStyle,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
};

CustomMessageText.contextTypes = {
  actionSheet: React.PropTypes.func,
};

CustomMessageText.defaultProps = {
  position: 'left',
  currentMessage: {
    text: '',
  },
  containerStyle: {},
  textStyle: {},
  linkStyle: {},
};

CustomMessageText.propTypes = {
  position: React.PropTypes.oneOf(['left', 'right']),
  currentMessage: React.PropTypes.object,
  containerStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style,
  }),
  textStyle: React.PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
  linkStyle: React.PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
};
