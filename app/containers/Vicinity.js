/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 09:54
 * @description
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  InteractionManager,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image
} from 'react-native'
import BaseComponent from '../base/BaseComponent'
import Spinner from '../components/Spinner'
import {connect} from 'react-redux'
import Map from '../pages/Map'
import MatchUsers from '../pages/MatchUsers'
import Tinder from '../pages/Tinder'
import Revel from '../pages/Revel'
import tmpGlobal from '../utils/TmpVairables'
import pxToDp from '../utils/PxToDp'
import {ComponentStyles, CommonStyles} from '../style'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: pxToDp(20),
    flex: 1
  },
  topRow: {
    marginTop: pxToDp(20)
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: pxToDp(354),
    height: pxToDp(279),
    borderRadius: pxToDp(16),
    borderColor: '#f3f3f3',
    borderWidth: pxToDp(1),

  },
  leftImage: {
    borderLeftWidth: 0
  },
  rightImage: {
    borderRightWidth: 0
  },
  cardText: {
    fontSize: pxToDp(48),
    color: '#fff'
  },
  warningContainer: {
    paddingHorizontal: pxToDp(20),
    position: 'absolute',
    left: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: pxToDp(354),
  },
  warningText: {
    fontSize: pxToDp(20)
  },
});

let navigator;

class Vicinity extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.isOpen,
      pending: false,
    };
    navigator = this.props.navigator;
  }

  componentWillMount() {

  }

  renderSpinner(data) {
    if (data) {
      return (
        <Spinner animating={data}/>
      )
    }
  }

  getNavigationBarProps() {
    return {
      title: '交友',
      leftIcon: {
        name: 'bars',
        size: pxToDp(36)
      }
    };
  }

  onLeftPressed() {
    this.props.menuChange(true);
  }

  _goMatchUsers() {
    navigator.push({
      component: MatchUsers,
      name: 'MatchUsers'
    });
  }

  _goMap() {
    navigator.push({
      component: Map,
      name: 'Map'
    });
  }

  _goShake() {
    navigator.push({
      component: Tinder,
      name: 'Tinder'
    })
  }

  _goRevel() {
    navigator.push({
      component: Revel,
      name: 'Revel'
    })
  }

  _renderCannotGoMap() {
    if (tmpGlobal.currentUser.MapPrecision === null) {
      return (
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>{'您已隐身'}</Text>
          <Text style={styles.warningText}>{'不能使用此功能'}</Text>
        </View>
      )
    } else {
      return null;
    }
  }

  renderBody() {
    return (
      <View style={ComponentStyles.container}>
        <ScrollView>
          <View style={styles.viewContainer}>
            <View style={[styles.cardRow, styles.topRow]}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  if (tmpGlobal.currentUser.MapPrecision !== null) {
                    this._goMap()
                  }
                }}>
                <Image
                  source={require('./img/map.png')}
                  style={[styles.image, styles.leftImage]}/>
                {this._renderCannotGoMap()}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  this._goMatchUsers()
                }}>
                <Image
                  source={require('./img/match.png')}
                  style={[styles.image, styles.rightImage]}/>
              </TouchableOpacity>
            </View>
            <View style={styles.cardRow}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  this._goShake()
                }}>
                <Image
                  source={require('./img/tinder.png')}
                  style={[styles.image, styles.leftImage]}/>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  this._goRevel()
                }}>
                <Image
                  source={require('./img/revel.png')}
                  style={[styles.image, styles.rightImage]}/>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    pendingStatus: state.Vicinity.pending,
    saveCoordinateStatus: state.Vicinity.asyncCoordinating
  }
};

export default connect(mapStateToProps)(Vicinity)