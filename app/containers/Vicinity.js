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
  Dimensions
} from 'react-native'
import BaseComponent from '../base/BaseComponent'
import Spinner from '../components/Spinner'
import {connect} from 'react-redux'
import Map from '../pages/Map'
import MatchUsers from '../pages/MatchUsers'
import Tinder from '../pages/Tinder'
import Revel from '../pages/Revel'
import tmpGlobal from '../utils/TmpVairables'

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  viewContainer: {
    flex: 1
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    flex: 1,
    marginTop: 20
  },
  bottomRow: {
    marginBottom: 20
  },
  card: {
    backgroundColor: 'pink',
    width: width / 3,
    height: width / 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  cardText: {
    fontSize: 24,
    color: '#fff'
  },
  warningContainer: {
    paddingHorizontal: 10,
    position: 'absolute',
    left: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 3,
  },
  warningText: {
    fontSize: 10
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
        size: 26
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
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.viewContainer}>
            <View style={styles.cardRow}>
              <TouchableOpacity
                style={styles.card}
                onPress={()=> {
                  if (tmpGlobal.currentUser.MapPrecision !== null) {
                    this._goMap()
                  }
                }}>
                <Text style={styles.cardText}>{'寻TA'}</Text>
                {this._renderCannotGoMap()}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.card}
                onPress={()=> {
                  this._goMatchUsers()
                }}>
                <Text style={styles.cardText}>{'匹配'}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.cardRow, styles.bottomRow]}>
              <TouchableOpacity
                style={styles.card}
                onPress={()=> {
                  this._goShake()
                }}>
                <Text style={styles.cardText}>{'眼缘'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.card}
                onPress={()=> {
                  this._goRevel()
                }}>
                <Text style={styles.cardText}>{'随缘'}</Text>
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