/**
 * 创建临时全局变量
 * @author keyy/1501718947@qq.com 16/12/10 13:18
 * @description
 */

let tmpGlobal = {
  currentLocation: null,
  currentUser: null,
  _initWebSocket: null,
  isConnected: true, //全局保存网络状态
  cookie: null,
  webSocketInitState: false,//webSocket连接初始化状态true成功,false失败
  webSocketConnectCount: 0,//webSocket连接次数
  ws:null,
  _wsTokenHandler:null
};

export default tmpGlobal