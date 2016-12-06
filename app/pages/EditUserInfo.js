/**
 * 编辑我的详细资料
 * @author keyy/1501718947@qq.com 16/12/5 16:02
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Platform,
  TouchableHighlight
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import ImagePicker from 'react-native-image-picker'
import Spinner from '../components/Spinner'
import {Button as NBButton} from 'native-base'
import RNPicker from 'react-native-picker'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  scrollViewContainer: {
    flex: 1
  },
  photosContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10
  },
  userInfo:{
    backgroundColor:'#fff',
    padding:10,
    marginBottom:10
  },
  itemTitle:{
    paddingVertical:10
  },
  listItem:{
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#d4cfcf',
    alignItems: 'center'
  },
  topItem:{
    borderTopWidth:1,
    borderTopColor:'#d4cfcf'
  },
  fullInput: {
    flex: 1
  },
  input: {
    height: 40,
    paddingLeft: 10,
    textAlignVertical: 'center',
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputLabel:{
    width:100
  },
  rightLabel: {
    width: 80,
    paddingLeft: 10,
    textAlignVertical: 'center'
  },
  emotionStatusIOS: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    paddingHorizontal: 10
  },
  emotionStatusIOSView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  emotionStatusIOSText: {
    textAlignVertical: 'center'
  },
});

class EditUserInfo extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.route.params
    };
    console.log(this.props.route.params);
  }

  componentDidMount() {

  }

  getNavigationBarProps() {
    return {
      title: '编辑资料',
      hideRightButton: false,
      rightTitle: '完成'
    };
  }

  //点击完成(保存编辑后的个人资料)
  onRightPressed() {

  }

  _createHeightData() {
    let data = [];
    for (let i = 100; i < 251; i++) {
      data.push(i + '')
    }
    return data;
  }

  _createWeightData() {
    let data = [];
    for (let i = 20; i < 501; i++) {
      data.push(i + '')
    }
    return data;
  }

  _createMapData() {
    return ['0m(精确定位)', '200m', '500m', '1000m', '隐身'];
  }

  //通用选择弹窗显示文本方法
  renderSinglePicker(text, value, _createData) {
    return (
      <TouchableHighlight
        onPress={()=> {
          this._showPicker(_createData, text, value)
        }}
        style={styles.emotionStatusIOS}
        activeOpacity={0.5}
        underlayColor="rgba(247,245,245,0.7)">
        <View style={styles.emotionStatusIOSView}>
          <Text style={styles.emotionStatusIOSText}>
            {this.state[`${text}`]}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  _updateState(text, value, pickedValue) {
    switch (text) {
      case 'MarriageStatusName':
        this.setState({MarriageStatusName: pickedValue});
        break;
      case 'educationStatusText':
        this.setState({educationStatusText: pickedValue});
        break;
      case 'Height':
        this.setState({heightText: pickedValue});
        break;
      case 'Weight':
        this.setState({weightText: pickedValue});
        break;
      case 'JobTypeName':
        this.setState({JobTypeName: pickedValue});
        break;
      case 'IncomeLevelName':
        this.setState({IncomeLevelName: pickedValue});
        break;
      case 'mapPrecisionText':
        this.setState({mapPrecisionText: pickedValue});
        break;
      default:
        console.error('设置数据出错!');
        break;
    }
    let index;
    switch (value) {
      case 'MarriageStatusName':
        this.setState({MarriageStatusName: pickedValue});
        break;
      case 'educationStatus':
        this.setState({educationStatus: pickedValue});
        break;
      case 'Height':
        this.setState({Height: parseInt(pickedValue)});
        break;
      case 'Weight':
        this.setState({Weight: parseInt(pickedValue)});
        break;
      case 'JobTypeName':
        this.setState({JobTypeName: pickedValue});
        break;
      case 'IncomeLevelName':
        this.setState({IncomeLevelName: pickedValue});
        break;
      case 'mapPrecision':
        if (pickedValue == '隐身') {
          this.setState({mapPrecision: null});
        } else {
          pickedValue = pickedValue.substring(0, pickedValue.indexOf('m'));
          this.setState({mapPrecision: pickedValue});
        }
        break;
      default:
        console.error('设置数据出错');
        break;
    }
  }


  _showPicker(_createData, text, value) {
    RNPicker.init({
      pickerData: _createData,
      selectedValue: [this.state[`${text}`]],
      onPickerConfirm: pickedValue => {
        this._updateState(text, value, pickedValue[0]);
        RNPicker.hide();
      },
      onPickerCancel: pickedValue => {
        RNPicker.hide();
      },
      onPickerSelect: pickedValue => {
        this._updateState(text, value, pickedValue[0]);
      }
    });
    RNPicker.show();
  }

  renderBody() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollViewContainer}>
          <View style={styles.photosContainer}>
            <Text>{'这里相册显示区域'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.itemTitle}>{'基本资料'}</Text>
            <View style={[styles.listItem,styles.topItem]}>
              <Text style={styles.inputLabel}>{'昵称'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Nickname}
                onChangeText={(Nickname)=>this.setState({Nickname})}
                maxLength={15}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'身高'}</Text>
              {this.renderSinglePicker('Height', 'Height', this._createHeightData())}
              <Text style={styles.rightLabel}>{'cm'}</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'体重'}</Text>
              {this.renderSinglePicker('Weight', 'Weight', this._createWeightData())}
              <Text style={styles.rightLabel}>{'cm'}</Text>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'职业'}</Text>
              {this.renderSinglePicker('JobTypeName', 'IncomeLevelName', this.state.DictMap.JobTypeDict)}
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'收入'}</Text>
              {this.renderSinglePicker('IncomeLevelName', 'IncomeLevelName', this.state.DictMap.IncomeLevelDict)}
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'所在地'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Location}
                onChangeText={(Location)=>this.setState({Location})}
                maxLength={50}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'情感状态'}</Text>
              {this.renderSinglePicker('MarriageStatusName', 'MarriageStatusName', this.state.DictMap.MarriageStatusDict)}
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'家乡'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Hometown}
                onChangeText={(Hometown)=>this.setState({Hometown})}
                maxLength={50}/>
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.itemTitle}>{'交友条件'}</Text>
            <View style={[styles.listItem,styles.topItem]}>
              <Text style={styles.inputLabel}>{'年龄'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Nickname}
                onChangeText={(Nickname)=>this.setState({Nickname})}
                maxLength={15}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'所在地'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Location}
                onChangeText={(Location)=>this.setState({Location})}
                maxLength={15}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'家乡'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Hometown}
                onChangeText={(Hometown)=>this.setState({Hometown})}
                maxLength={15}/>
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.itemTitle}>{'其他'}</Text>
            <View style={[styles.listItem,styles.topItem]}>
              <Text style={styles.inputLabel}>{'昵称'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Nickname}
                onChangeText={(Nickname)=>this.setState({Nickname})}
                maxLength={15}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'所在地'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Location}
                onChangeText={(Location)=>this.setState({Location})}
                maxLength={15}/>
            </View>
            <View style={styles.listItem}>
              <Text style={styles.inputLabel}>{'家乡'}</Text>
              <TextInput
                style={[styles.input, styles.fullInput]}
                underlineColorAndroid={'transparent'}
                value={this.state.Hometown}
                onChangeText={(Hometown)=>this.setState({Hometown})}
                maxLength={15}/>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

}
export default EditUserInfo
