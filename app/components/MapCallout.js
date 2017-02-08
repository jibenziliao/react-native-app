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
  Image,
  Dimensions
} from 'react-native'
import MapView from 'react-native-maps'
import {URL_DEV} from '../constants/Constant'
import Icon from 'react-native-vector-icons/FontAwesome'

const {width, height}=Dimensions.get('window');

const styles = StyleSheet.create({
  callout: {
    position: 'relative',
    flex: 1,
    width: width * 2 / 3,
    height: width * 5 / 18,
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
  userInfoLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  userInfoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'pink',
    borderWidth: 1,
    borderColor: 'pink',
    paddingHorizontal: 6
  },
  userInfoIcon: {
    marginRight: 4,
    color: '#FFF'
  },
  userInfoText: {
    fontSize: 10,
    color: '#FFF'
  },
  personSignal: {
    flexWrap: 'wrap',
    overflow: 'hidden',
    fontSize: 12
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

export default class MapCallout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarLoading: true,
    };
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

  _renderGenderStyle(gender) {
    return {
      backgroundColor: gender ? '#1496ea' : 'pink',
      borderColor: gender ? '#1496ea' : 'pink',
    }
  }

  render() {
    const {location} = this.props;
    return (
      <MapView.Callout
        onPress={()=> {
          this.props.onPress(location)
        }}
        style={styles.callout}>
        <View style={styles.container}>
          <View style={styles.userAvatar}>
            <Image
              onLoadEnd={()=> {
                this.setState({avatarLoading: false})
              }}
              style={styles.avatar}
              source={{uri: URL_DEV + location.PhotoUrl}}>
              {this.state.avatarLoading ?
                <Image
                  source={require('./img/imgLoading.gif')}
                  style={styles.avatar}/> : null}
            </Image>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.nickRow}>
              <Text>{location.Nickname}</Text>
            </View>
            {/*{this.renderGenderIcon(location.Gender)}*/}
            <View style={styles.userInfoLabelContainer}>
              <View style={[styles.userInfoLabel, this._renderGenderStyle(location.Gender)]}>
                <Icon
                  name={location.Gender ? 'mars-stroke' : 'venus'}
                  size={10}
                  style={styles.userInfoIcon}/>
                <Text style={styles.userInfoText}>{location.Age}{'岁'}</Text>
              </View>
            </View>
            <View>
              <Text
                numberOfLines={2}
                style={styles.personSignal}>
                签名:{location.PersonSignal || 'TA暂无签名'}
              </Text>
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

MapCallout.propTypes = {
  location: PropTypes.object.isRequired,
  onPress: PropTypes.func
};
