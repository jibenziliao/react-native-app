/**
 *
 * @author keyy/1501718947@qq.com 16/12/22 20:07
 * @description
 */
/*
 **  This component will be published in a separate package
 */
import React,{Component} from 'react'
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

// TODO
// 3 words name initials
// handle only alpha numeric chars

export default class CustomGiftAvatar extends Component {
  setAvatarColor() {
    const userName = this.props.currentMessage.user.name || '';
    const name = userName.toUpperCase().split(' ');
    if (name.length === 1) {
      this.avatarName = `${name[0].charAt(0)}`;
    } else if (name.length > 1) {
      this.avatarName = `${name[0].charAt(0)}${name[1].charAt(0)}`;
    } else {
      this.avatarName = '';
    }

    let sumChars = 0;
    for(let i = 0; i < userName.length; i++) {
      sumChars += userName.charCodeAt(i);
    }

    // inspired by https://github.com/wbinnssmith/react-user-avatar
    // colors from https://flatuicolors.com/
    const colors = [
      '#e67e22', // carrot
      '#2ecc71', // emerald
      '#3498db', // peter river
      '#8e44ad', // wisteria
      '#e74c3c', // alizarin
      '#1abc9c', // turquoise
      '#2c3e50', // midnight blue
    ];

    this.avatarColor = colors[sumChars % colors.length];
  }

  renderAvatar() {
    if (typeof this.props.currentMessage.user.avatar === 'function') {
      return this.props.currentMessage.user.avatar();
    } else if (typeof this.props.currentMessage.user.avatar === 'string') {
      return (
        <Image
          source={{uri: this.props.currentMessage.user.avatar}}
          style={[defaultStyles.avatarStyle, this.props.avatarStyle]}
        />
      );
    }
    return null;
  }

  renderInitials() {
    return (
      <Text style={[defaultStyles.textStyle, this.props.textStyle]}>
        {this.avatarName}
      </Text>
    );
  }

  render() {
    if (!this.props.currentMessage.user.name && !this.props.currentMessage.user.avatar) {
      // render placeholder
      return (
        <View style={[
          defaultStyles.avatarStyle,
          {backgroundColor: 'transparent'},
          this.props.avatarStyle,
        ]}/>
      )
    }
    if (this.props.currentMessage.user.avatar) {
      return (
        <TouchableOpacity
          disabled={this.props.onPress ? false : true}
          onPress={() => {
            const {onPress, ...other} = this.props;
            this.props.onPress && this.props.onPress(other);
          }}
        >
          {this.renderAvatar()}
        </TouchableOpacity>
      );
    }

    if (!this.avatarColor) {
      this.setAvatarColor();
    }

    return (
      <TouchableOpacity
        disabled={this.props.onPress ? false : true}
        onPress={() => {
          const {onPress, ...other} = this.props;
          this.props.onPress && this.props.onPress(other);
        }}
        style={[
          defaultStyles.avatarStyle,
          {backgroundColor: this.avatarColor},
          this.props.avatarStyle,
        ]}
      >
        {this.renderInitials()}
      </TouchableOpacity>
    );
  }
}

const defaultStyles = {
  avatarStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  textStyle: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'transparent',
    fontWeight: '100',
  },
};

CustomGiftAvatar.defaultProps = {
  user: {
    name: null,
    avatar: null,
  },
  onPress: null,
  avatarStyle: {},
  textStyle: {},
};

CustomGiftAvatar.propTypes = {
  user: React.PropTypes.object,
  onPress: React.PropTypes.func,
  avatarStyle: Image.propTypes.style,
  textStyle: Text.propTypes.style,
};
