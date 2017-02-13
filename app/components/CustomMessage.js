/**
 *
 * @author keyy/1501718947@qq.com 16/12/22 15:31
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'

import moment from 'moment'
import CustomBubble from './CustomBubble'
import CustomDay from './CustomDay'
import {Avatar, Bubble, Day} from 'react-native-gifted-chat'

export default class CustomMessage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isInBlackList: this.props.isInBlackList,
      hasRemoveBlackList: false
    };
    console.log(this.props);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.setState({
      isInBlackList: nextProps.isInBlackList,
      hasRemoveBlackList: !nextProps.isInBlackList && this.props.isInBlackList
    });
  }

  isSameDay(currentMessage = {}, diffMessage = {}) {
    let diff = 0;
    if (diffMessage.createdAt && currentMessage.createdAt) {
      diff = Math.abs(moment(diffMessage.createdAt).startOf('day').diff(moment(currentMessage.createdAt).startOf('day'), 'days'));
    } else {
      diff = 1;
    }
    if (diff === 0) {
      return true;
    }
    return false;
  }

  isSameUser(currentMessage = {}, diffMessage = {}) {
    if (diffMessage.user && currentMessage.user) {
      if (diffMessage.user._id === currentMessage.user._id) {
        return true;
      }
    }
    return false;
  }

  renderTips() {
    console.log(this.props.isInBlackList);
    if (this.state.isInBlackList) {
      return (
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsText}>
            {'你已拉黑对方,将不会收到对方的消息,'}
            <Text style={styles.clickTipsText}>{'解除黑名单'}</Text>
            {'后可恢复正常聊天'}
          </Text>
        </View>
      )
    } else if(!this.state.isInBlackList && this.state.hasRemoveBlackList) {
      return (
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsText}>
            {'你已将对方移出黑名单'}
          </Text>
        </View>
      )
    }else{
      return null
    }
  }

  renderDay() {
    if (this.props.currentMessage.createdAt) {
      const {containerStyle, ...other} = this.props;
      const dayProps = {
        ...other,
        isSameUser: this.isSameUser,
        isSameDay: this.isSameDay,
      };
      if (this.props.renderDay) {
        return this.props.renderDay(dayProps);
      }
      return <CustomDay {...dayProps}/>;
    }
    return null;
  }

  renderBubble() {
    const {...other} = this.props;
    const bubbleProps = {
      ...other,
      isSameUser: this.isSameUser,
      isSameDay: this.isSameDay,
    };
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps);
    }
    return <CustomBubble {...bubbleProps}/>;
  }

  //聊天双方都显示头像
  renderAvatar() {
    //console.log(this.props);
    //if (this.props.user._id !== this.props.currentMessage.user._id) {
    const {...other} = this.props;
    const avatarProps = {
      ...other,
      isSameUser: this.isSameUser,
      isSameDay: this.isSameDay,
    };
    return <Avatar {...avatarProps}/>;
    //}
    //return null;
  }

  render() {
    return (
      <View>
        {this.renderDay()}
        {this.renderTips()}
        <View style={[styles[this.props.position].container, {
          marginBottom: this.isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10,
        }, this.props.containerStyle[this.props.position]]}>
          {this.props.position === 'left' ? this.renderAvatar() : null}
          {this.renderBubble()}
          {this.props.position === 'right' ? this.renderAvatar() : null}
        </View>
      </View>
    );
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0,
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8,
    },
  }),
  tipsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 10,
    backgroundColor:'#E2E2E2',
    borderRadius:4
  },
  tipsText: {
    color: '#fff',
    flexWrap:'wrap'
  },
  clickTipsText: {
    color: 'blue'
  }
};

CustomMessage.defaultProps = {
  renderAvatar: null,
  renderBubble: null,
  renderDay: null,
  position: 'left',
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
  containerStyle: {},
};

CustomMessage.propTypes = {
  renderAvatar: React.PropTypes.func,
  renderBubble: React.PropTypes.func,
  renderDay: React.PropTypes.func,
  position: React.PropTypes.oneOf(['left', 'right']),
  currentMessage: React.PropTypes.object,
  nextMessage: React.PropTypes.object,
  previousMessage: React.PropTypes.object,
  user: React.PropTypes.object,
  containerStyle: React.PropTypes.shape({
    left: View.propTypes.style,
    right: View.propTypes.style,
  }),
};
