/**
 *
 * @author keyy/1501718947@qq.com 16/11/19 15:07
 * @description
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  TouchableOpacity,
  Image,
  Picker,
  Platform
} from 'react-native';
import Button from 'react-native-button'
import Icon from 'react-native-vector-icons/FontAwesome'
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';

class ImageViewer extends Component {
  constructor(props) {
    super(props);
  }

  _dataSource(data) {
    const rowHasChanged = (r1, r2) => r1 !== r2;
    const ds = new ListView.DataSource({rowHasChanged});
    return ds.cloneWithRows(data);
  }

  renderPermissionPicker(rowData) {
    if (Platform.OS == 'ios') {
      return (
        <View style={{flex: 1}}>
          {this.renderPermissionOptions(rowData,this.props.dataSource)}
        </View>
      )
    } else {
      return (
        <Picker
          style={styles.picker}
          selectedValue={rowData.Permission}
          onValueChange={(value)=> {
            this.props.setPermission(rowData, this.props.dataSource, value)
          }}>
          <Picker.Item label="所有人可见" value="Everybody"/>
          <Picker.Item label="有照片可见" value="WithPhotoToSee"/>
          <Picker.Item label="VIP可见" value="VipToSee"/>
          <Picker.Item label="仅邀请可见" value="InviteToSee"/>
        </Picker>
      )
    }
  }

  renderPermissionOptions(rowData,dataSource) {
    return (
      <Menu
        style={{flex: 1}}
        onSelect={(value) => {
          this.props.setPermission(rowData, dataSource, value+'')
        }}>
        <MenuTrigger>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F0F0F0',
            height: 40,
            borderRadius: 4,
            paddingHorizontal: 10
          }}>
            <Text>{this.renderPermissionText(rowData.Permission)}</Text>
            <Icon name="angle-down" size={16}/>
          </View>
        </MenuTrigger>
        <MenuOptions
          optionsContainerStyle={{flex: 1}}>
          <MenuOption value='Everybody' text='所有人可见'/>
          <MenuOption value='WithPhotoToSee' text='有照片可见'/>
          <MenuOption value='VipToSee' text='VIP可见'/>
          <MenuOption value='InviteToSee' text='仅邀请可见'/>
        </MenuOptions>
      </Menu>
    )
  }

  renderPermissionText(text){
    if(text=='Everybody'){
      return '所有人可见';
    }else if(text=='WithPhotoToSee'){
      return '有照片可见';
    }else if(text=='VipToSee'){
      return 'VIP可见';
    }else if(text=='InviteToSee'){
      return '仅邀请可见';
    }
  }

  _renderRow(rowData) {
    return (
      <View style={styles.column}>
        <View style={styles.imageOptions}>
          <Image source={rowData} style={styles.image}/>
          <View style={styles.button}>
            <Button
              style={styles.avatar}
              containerStyle={styles.avatarContainer}
              onPress={()=> {
                this.props.setAvatar(rowData)
              }}>
              设为头像
            </Button>
            <Button
              style={styles.deleteBtn}
              containerStyle={styles.deleteBtnContainer}
              onPress={()=> {
                this.props.deletePhoto(rowData)
              }}>
              删除
            </Button>
          </View>
        </View>
        <View style={styles.permission}>
          {this.renderPermissionPicker(rowData,this.props.dataSource)}
        </View>
      </View>
    )
  }

  render() {
    return (
      <View>
        <ListView
          contentContainerStyle={styles.listContent}
          dataSource={this._dataSource(this.props.dataSource)}
          renderRow={this._renderRow.bind(this)}
          pageSize={3}
          deletePhoto={(id)=> {
            this.props.deletePhoto(id)
          }}
          setAvatar={(id)=> {
            this.props.setAvatar(id)
          }}
          setPersmission={(singleData, allData, permission)=> {
            this.props.setPermission(singleData, allData, permission)
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column'
  },
  image: {
    width: 100,
    height: 100
  },
  imageOptions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 100
  },
  avatar: {
    color: 'blue'
  },
  avatarContainer: {
    backgroundColor: '#EBEBEB',
    padding: 4,
    borderRadius: 4,
    width: 100
  },
  deleteBtn: {
    color: 'red',
  },
  deleteBtnContainer: {
    backgroundColor: '#EBEBEB',
    padding: 4,
    borderRadius: 4,
    width: 100
  },
  permission: {
    flex: 1
  },
  picker: {
    flex: 1
  },
  listContent: {
    flex: 1
  }
});

export default ImageViewer