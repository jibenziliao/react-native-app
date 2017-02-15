/**
 *
 * @author keyy/1501718947@qq.com 17/2/15 16:11
 * @description
 */
import {Dimensions} from 'react-native';

// app 只有竖屏模式，所以可以只获取一次 width
const deviceWidthDp = Dimensions.get('window').width;
// UI 默认给图是 750
const uiWidthPx = 750;

function pxToDp(uiElementPx) {
  return uiElementPx *  deviceWidthDp / uiWidthPx;
}

export default pxToDp;