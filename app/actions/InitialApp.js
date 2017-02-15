/**
 *
 * @author keyy/1501718947@qq.com 16/11/8 17:34
 * @description
 */
import * as ActionTypes from './ActionTypes'
import DeviceInfo from 'react-native-device-info'
import {postFetch, getFetch} from '../utils/NetUtil'
import tmpGlobal from '../utils/TmpVairables'

console.log("Device Unique ID", DeviceInfo.getUniqueID());  // e.g. FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9
// * note this is IDFV on iOS so it will change if all apps from the current apps vendor have been previously uninstalled

console.log("Device Manufacturer", DeviceInfo.getManufacturer());  // e.g. Apple

console.log("Device Brand", DeviceInfo.getBrand());  // e.g. Apple / htc / Xiaomi

console.log("Device Model", DeviceInfo.getModel());  // e.g. iPhone 6

console.log("Device ID", DeviceInfo.getDeviceId());  // e.g. iPhone7,2 / or the board on Android e.g. goldfish

console.log("System Name", DeviceInfo.getSystemName());  // e.g. iPhone OS

console.log("System Version", DeviceInfo.getSystemVersion());  // e.g. 9.0

console.log("Bundle ID", DeviceInfo.getBundleId());  // e.g. com.learnium.mobile

console.log("Build Number", DeviceInfo.getBuildNumber());  // e.g. 89

console.log("App Version", DeviceInfo.getVersion());  // e.g. 1.1.0

console.log("App Version (Readable)", DeviceInfo.getReadableVersion());  // e.g. 1.1.0.89

console.log("Device Name", DeviceInfo.getDeviceName());  // e.g. Becca's iPhone 6

console.log("User Agent", DeviceInfo.getUserAgent()); // e.g. Dalvik/2.1.0 (Linux; U; Android 5.1; Google Nexus 4 - 5.1.0 - API 22 - 768x1280 Build/LMY47D)

console.log("Device Locale", DeviceInfo.getDeviceLocale()); // e.g en-US

console.log("Device Country", DeviceInfo.getDeviceCountry()); // e.g US

console.log("Device Timezone", DeviceInfo.getTimezone());

tmpGlobal.appInfo = {
  appVersionReadable: DeviceInfo.getReadableVersion(),
  appVersion: DeviceInfo.getVersion(),
  buildNumber: DeviceInfo.getBuildNumber(),
  bundleId: DeviceInfo.getBundleId(),
  systemVersion: DeviceInfo.getSystemVersion(),
  systemName: DeviceInfo.getSystemName(),
  deviceId: DeviceInfo.getDeviceId(),
  deviceModel: DeviceInfo.getModel(),
  deviceBrand: DeviceInfo.getBrand(),
  deviceManufacturer: DeviceInfo.getManufacturer(),
  deviceUniqueId: DeviceInfo.getUniqueID(),
  deviceName: DeviceInfo.getDeviceName(),
  deviceLocale: DeviceInfo.getDeviceLocale(),
  userAgent: DeviceInfo.getUserAgent(),
  deviceCountry: DeviceInfo.getDeviceCountry()
};

export function initDevice(data, resolve, reject) {
  return (dispatch)=> {
    postFetch('/initial', data, dispatch, {type: ActionTypes.FETCH_BEGIN}, {type: ActionTypes.FETCH_END}, {type: ActionTypes.FETCH_FAILED}, resolve, reject);
  }
}