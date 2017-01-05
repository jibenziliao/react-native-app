/**
 *
 * @author keyy/1501718947@qq.com 17/1/4 15:50
 * @description
 */
import React, {Component} from 'react'
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
} from 'react-native'
import {URL_DEV, TIME_OUT} from '../constants/Constant'

const window = Dimensions.get('window');
const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#03A9F4',
    padding:20,
    paddingRight:40//menu的宽度加宽了20,避免切换时出现白色缝隙
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  name: {
    marginHorizontal: 10,
    flexWrap: 'wrap',
    flex: 1
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
  },
});

class Menu extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      uri: this.props.userInfo.PhotoUrl,
      name: this.props.userInfo.Nickname
    };

  }

  static propTypes = {
    onItemSelected: React.PropTypes.func.isRequired,
  };

  render() {
    return (
      <ScrollView scrollsToTop={false} style={[styles.menu, {width: this.props.openMenuOffset + 20}]}>
        <View style={[styles.avatarContainer]}>
          <Image
            style={styles.avatar}
            source={{uri: URL_DEV + this.state.uri}}/>
          <Text style={styles.name}>{this.state.name}</Text>
        </View>

        <Text
          onPress={() => this.props.onItemSelected('About')}
          style={styles.item}>
          About
        </Text>

        <Text
          onPress={() => this.props.onItemSelected('Contacts')}
          style={styles.item}>
          Contacts
        </Text>
      </ScrollView>
    );
  }
}

export default Menu;