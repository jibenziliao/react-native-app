/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 09:23
 * @description
 */
import {
  Navigator,
} from 'react-native'
import MainContainer from '../containers/MainContainer'
import MessageDetail from '../pages/MessageDetail'
import Login from '../pages/Login'
import UserProfile from '../pages/UserProfile'
import FriendsFilter from '../pages/FriendsFilter'
import UserInfo from '../pages/UserInfo'
import EditUserProfile from '../pages/EditUserProfile'
import EditPhotos from '../pages/EditPhotos'
import EditPersonalSignature from '../pages/EditPersonalSignature'
//import Map from '../pages/Map'
import MatchUsers from '../pages/MatchUsers'
import Revel from '../pages/Revel'
import Tinder from '../pages/Tinder'
import AnnouncementDetail from '../pages/AnnouncementDetail'
import AnnouncemenetList from '../pages/AnnouncemenetList'
import EditFriendFilter from '../pages/EditFriendFilter'
import Addannouncement from '../pages/Addannouncement'
import Settings from '../pages/Settings'

let navigator;

// PushFromRight
// PushFromLeft
// FloatFromRight
// FloatFromLeft
// FloatFromBottom
// FloatFromBottomAndroid
// FadeAndroid
// HorizontalSwipeJump
// HorizontalSwipeJumpFromRight
// VerticalUpSwipeJump
// VerticalDownSwipeJump

const routeMap = new Map();

routeMap.set('MainContainer', {
  component: MainContainer
});
routeMap.set('MessageDetail', {
  component: MessageDetail
});
routeMap.set('Login', {
  component: Login,
  sceneAnimation: Navigator.SceneConfigs.FloatFromBottom
});
routeMap.set('UserProfile', {
  component: UserProfile
});
routeMap.set('FriendsFilter', {
  component: FriendsFilter
});
routeMap.set('UserInfo', {
  component: UserInfo
});
routeMap.set('EditUserProfile', {
  component: EditUserProfile
});
routeMap.set('EditPhotos', {
  component: EditPhotos
});
routeMap.set('EditPersonalSignature', {
  component: EditPersonalSignature
});
//routeMap.set('Map', {
//  component: Map
//});
routeMap.set('MatchUsers', {
  component: MatchUsers
});
routeMap.set('Revel', {
  component: Revel
});
routeMap.set('Tinder', {
  component: Tinder
});
routeMap.set('AnnouncementDetail', {
  component: AnnouncementDetail
});
routeMap.set('AnnouncemenetList', {
  component: AnnouncemenetList
});
routeMap.set('EditFriendFilter', {
  component: EditFriendFilter
});
routeMap.set('Addannouncement', {
  component: Addannouncement
});
routeMap.set('Settings', {
  component: Settings
});

export function registerNavigator(tempNavigator) {
  if (navigator) {
    return;
  }
  navigator = tempNavigator;
}

export function getNavigator() {
  return navigator;
}

export function getRouteMap() {
  return routeMap;
}






