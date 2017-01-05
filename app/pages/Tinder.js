import React, {Component} from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  InteractionManager,
  TouchableOpacity
} from 'react-native'
import BaseComponent from '../base/BaseComponent'
import Icon from 'react-native-vector-icons/FontAwesome'
import SwipeCards from 'react-native-swipe-cards'
import {connect} from 'react-redux'
import {URL_DEV, TIME_OUT, URL_WS_DEV} from '../constants/Constant'
import * as HomeActions from '../actions/Home'
import tmpGlobal from '../utils/TmpVairables'

const {width, height}=Dimensions.get('window');

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    paddingTop: 20
  },
  card: {
    alignItems: 'flex-start',
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    elevation: 1,
  },
  userInfo: {
    paddingHorizontal: 10,
  },
  thumbnail: {
    width: width * 5 / 6,
    height: width * 5 / 6,
  },
  nameText: {
    fontSize: 14,
    paddingVertical: 10
  },
  userInfoLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  userInfoLabel: {
    borderRadius: 4,
    backgroundColor: 'pink',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginBottom: 10,
    marginRight: 10
  },
  locationLabel: {
    backgroundColor: '#1496ea'
  },
  userInfoText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 4
  },
  userLocation: {
    marginLeft: 0
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

let lastCount;

let Card = React.createClass({

  _renderLocation(data) {
    console.log(this.props);
    if (data !== null) {
      return (
        <View style={[styles.userInfoLabel, styles.locationLabel]}>
          <Text style={[styles.userInfoText, styles.userLocation]}>{data}</Text>
        </View>
      )
    } else {
      return null;
    }
  },

  _renderGenderStyle(gender) {
    return {
      backgroundColor: gender ? '#1496ea' : 'pink',
      borderColor: gender ? '#1496ea' : 'pink',
    }
  },

  render() {
    return (
      <View style={styles.card}>
        <Image style={styles.thumbnail} source={{uri: URL_DEV + this.props.PrimaryPhotoFilename}}/>
        <View style={styles.userInfo}>
          <Text style={styles.nameText}>{this.props.Nickname}</Text>
          <View style={styles.userInfoLabelContainer}>
            <View style={[styles.userInfoLabel, this._renderGenderStyle(this.props.Gender)]}>
              <Icon
                name={this.props.Gender ? 'mars-stroke' : 'venus'}
                color={'#fff'}
                size={12}/>
              <Text style={styles.userInfoText}>{this.props.Age}{'岁'}</Text>
            </View>
            {this._renderLocation(this.props.Location)}
          </View>
        </View>
      </View>
    )
  }
});

let NoMoreCards = React.createClass({
  render() {
    return (
      <TouchableOpacity
        style={styles.noMoreCards}
        onPress={()=> {
          this.props.refresh()
        }}>
        <Text>没有更多卡片了,点击刷新</Text>
      </TouchableOpacity>
    )
  }
});

class Tinder extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      outOfCards: false,
      pageIndex: 1,
      pageSize: 5,
      refresh: false
    };
    this.handleYup = this.handleYup.bind(this);
    this.handleNope = this.handleNope.bind(this);
    this.cardRemoved = this.cardRemoved.bind(this);
  }

  getNavigationBarProps() {
    return {
      title: '摇一摇'
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(()=> {
      this._getMatchUserList();
    })
  }

  _getMatchUserList() {
    const {dispatch}=this.props;
    let data = {
      lat: tmpGlobal.currentLocation.Lat,
      lng: tmpGlobal.currentLocation.Lng,
      pageIndex: this.state.pageIndex,
      pageSize: this.state.pageSize
    };
    dispatch(HomeActions.getMatchUsers(data, (json)=> {
      lastCount = json.Result.length;
      this.setState({
        cards: json.Result
      });
    }, (error)=> {
    }));
  }

  _refresh() {
    const {dispatch}=this.props;
    this.setState({
      pageIndex: 1
    });
    let data = {
      lat: tmpGlobal.currentLocation.Lat,
      lng: tmpGlobal.currentLocation.Lng,
      pageIndex: 1,
      pageSize: this.state.pageSize
    };
    dispatch(HomeActions.getMatchUsers(data, (json)=> {
      lastCount = json.Result.length;
      this.setState({
        cards: json.Result,
        refresh: true
      });
    }, (error)=> {
    }));
  }

  handleYup(card) {
    console.log("yup")
  }

  handleNope(card) {
    console.log("nope")
  }

  cardRemoved(index) {
    //在请求发送之前重置是否刷新的状态(因为SwipCards.js中的componentWillReceiveProps方法会在此阶段触发,故不能在请求拿到数据后重置)
    this.setState({refresh: false});
    console.log(this.props);
    console.log(`The index is ${index}`);
    let CARD_REFRESH_LIMIT = 3;
    if (this.state.cards.length - index <= CARD_REFRESH_LIMIT + 1) {
      console.log(`There are only ${this.state.cards.length - index - 1} cards left.`);
      if (lastCount === this.state.pageSize && this.state.cards.length >= this.state.pageSize) {
        const {dispatch} = this.props;
        this.state.pageIndex += 1;
        const data = {
          pageSize: this.state.pageSize,
          pageIndex: this.state.pageIndex,
          lat: tmpGlobal.currentLocation.Lat,
          lng: tmpGlobal.currentLocation.Lng
        };
        dispatch(HomeActions.getMatchUsersQuiet(data, (json)=> {
          lastCount = json.Result.length;
          this.setState({
            cards: this.state.cards.concat(json.Result)
          });
          console.log(`Adding ${json.Result.length} more cards`);
        }, (error)=> {

        }));
      }
    }
  }

  renderYupView() {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Icon name={'home'} color={'pink'} size={20}/>
        <Text>{'喜欢'}</Text>
      </View>
    )
  }

  renderNoView() {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Icon name={'home'} color={'pink'} size={20}/>
        <Text>{'不喜欢'}</Text>
      </View>
    )
  }

  renderBody() {
    if (this.state.cards.length === 0) {
      return null
    } else {
      return (
        <SwipeCards
          refresh={this.state.refresh}
          cards={this.state.cards}
          loop={false}
          renderCard={(cardData) => <Card key={cardData.UserId} {...cardData} />}
          renderNoMoreCards={() => <NoMoreCards refresh={()=> {
            this._refresh()
          }}/>}
          containerStyle={styles.cardContainer}
          showYup={true}
          showNope={true}
          yupView={this.renderYupView()}
          noView={this.renderNoView()}
          handleYup={this.handleYup}
          handleNope={this.handleNope}
          cardRemoved={this.cardRemoved}
        />
      )
    }
  }
}

export default connect((state)=> {
  return {
    ...state
  }
})(Tinder);