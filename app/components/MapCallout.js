/**
 *
 * @author keyy/1501718947@qq.com 16/11/30 10:10
 * @description
 */
import React, {PropTypes, Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native'
import MapView from 'react-native-maps'
import {URL_DEV} from '../constants/Constant'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class MapCallout extends Component {
  constructor(props) {
    super(props);
    //this.onPress = this.props.onPress.bind(this, this.props.location);
  }

  renderGenderIcon(data) {
    if (data) {
      return (
        <Icon name="mars-stroke" size={16} style={[styles.genderIcon, {color: '#2977FB'}]}/>
      )
    } else {
      return (
        <Icon name="venus" size={16} style={[styles.genderIcon, {color: '#FF8F77'}]}/>
      )
    }
  }

  renderDatingPurpose(datingPurpose, index) {
    let customStyle = {};
    let datingPurposeCN = '';
    if ('Love' == datingPurpose) {
      customStyle = {backgroundColor: '#FF9184'};
      datingPurposeCN = '男女朋友';
    } else if ('Relationship' == datingPurpose) {
      customStyle = {backgroundColor: '#AFC2FD'};
      datingPurposeCN = '异性知己';
    } else if ('Friendship' == datingPurpose) {
      customStyle = {backgroundColor: '#AEFBC9'};
      datingPurposeCN = '朋友';
    } else if ('Others' == datingPurpose) {
      customStyle = {backgroundColor: '#C2B1C0'};
      datingPurposeCN = '中介或其他服务';
    } else {
      customStyle = {backgroundColor: '#D6DFA9'};
      datingPurposeCN = '朋友';
    }
    return (
      <Text
        key={index}
        style={[styles.datingPurpose, customStyle, styles.font_ms]}>{datingPurposeCN}
      </Text>
    )
  }

  render() {
    const {location} = this.props;
    //##############原交友目的################
    //const datingPurposes = location.DatingPurpose.split(', ');
    //##############################

    //TODO: 获取附近的人的概略信息
    //模拟假数据
    const datingPurposes = ['Love','FriendShip'];

    return (
      <MapView.Callout
        onPress={()=> {
          this.props.onPress(location)
        }}
        style={styles.callout}>
        <View style={styles.container}>
          <View style={styles.userAvatar}>
            <Image
              style={styles.avatar}
              source={{uri: URL_DEV + location.PhotoUrl}}/>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.nickRow}>
              <Text>{location.Nickname}</Text>
              {this.renderGenderIcon(location.Gender)}
            </View>
            <View>
              <Text>ID: {location.UserId}</Text>
            </View>
            <View style={styles.datingPurposeRow}>
              {datingPurposes.map((datingPurpose, index)=>this.renderDatingPurpose(datingPurpose, index))}
            </View>
          </View>
          <View style={styles.link}>
            <Icon name="angle-double-right" size={28} style={styles.linkIcon}/>
          </View>
        </View>
      </MapView.Callout>
    )
  }
}

const styles = StyleSheet.create({
  callout: {
    position: 'relative',
    flex: 1,
    width: 260,
    height: 100,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  userAvatar: {
    width: 90,
    height: 90
  },
  avatar: {
    width: 90,
    height: 90
  },
  userInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 5
  },
  nickRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  datingPurposeRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  datingPurpose: {
    borderRadius: 4,
    marginRight: 4,
    marginVertical: 2,
    paddingHorizontal: 2
  },
  genderIcon: {
    //marginLeft:4
  },
  link: {
    width: 16,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center'
  },
  linkIcon: {},
  font_ms: {
    fontSize: 12
  }
});

MapCallout.propTypes = {
  location: PropTypes.object.isRequired,
  onPress: PropTypes.func
};
