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
  TouchableOpacity,
  TouchableHighlight
} from 'react-native'
import {URL_DEV, TIME_OUT} from '../constants/Constant'
import tmpGlobal from '../utils/TmpVairables'
import Icon from 'react-native-vector-icons/FontAwesome'

const window = Dimensions.get('window');
const uri = 'https://pickaface.net/gallery/avatar/Opi51c74d0125fd4.png';

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#03A9F4',
  },
  userInfoContainer: {
    padding: 20,
    paddingRight: 40//menu的宽度加宽了20,避免切换时出现白色缝隙
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
  signatureContent: {
    flexWrap: 'nowrap',
    flexDirection: 'row',
  },
  listItemContainer:{
    backgroundColor:'#c7c7d0'
  },
  item: {
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 5,
  },
  listItem: {},
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height:60
  },
  iconContainer: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText:{
    fontSize:16
  },
});

class Menu extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }

  render() {
    return (
      <View style={[styles.menu,{width: this.props.openMenuOffset + 20}]}>
        <View style={styles.userInfoContainer}>
          <View style={[styles.avatarContainer]}>
            <Image
              style={styles.avatar}
              source={{uri: URL_DEV + this.props.userInfo.PhotoUrl}}/>
            <Text style={styles.name}>{this.props.userInfo.Nickname}</Text>
          </View>
          <TouchableOpacity
            style={styles.signatureContent}
            onPress={()=> {
              this.props.goSignature()
            }}>
            <Text numberOfLines={1}>{this.props.userInfo.PersonSignal}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView scrollsToTop={false} style={styles.listItemContainer}>
          <View style={styles.listItem}>
            <TouchableHighlight
              onPress={()=> {
                this.props.goPhotos()
              }}
              underlayColor={'#b8b8bf'}>
              <View style={styles.itemContainer}>
                <View style={styles.iconContainer}>
                  <Icon name={'picture-o'} size={20}/>
                </View>
                <Text style={styles.itemText}>{'相册'}</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.listItem}>
            <TouchableHighlight
              onPress={()=> {
                this.props.goPhotos()
              }}
              underlayColor={'#b8b8bf'}>
              <View style={styles.itemContainer}>
                <View style={styles.iconContainer}>
                  <Icon name={'address-card-o'} size={20}/>
                </View>
                <Text style={styles.itemText}>{'资料'}</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={styles.listItem}>
            <TouchableHighlight
              onPress={()=> {
                this.props.goSettings()
              }}
              underlayColor={'#b8b8bf'}>
              <View style={styles.itemContainer}>
                <View style={styles.iconContainer}>
                  <Icon name={'wrench'} size={20}/>
                </View>
                <Text style={styles.itemText}>{'设置'}</Text>
              </View>
            </TouchableHighlight>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Menu;