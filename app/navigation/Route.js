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
  component: Login
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






