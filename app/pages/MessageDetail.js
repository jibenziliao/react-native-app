/**
 *
 * @author keyy/1501718947@qq.com 16/11/10 16:09
 * @description
 */
import React,{Component} from 'react'
import {
  View,
  StyleSheet,
  Text
} from 'react-native'
import * as InitialAppActions from '../actions/InitialApp'
import {connect} from 'react-redux'
import BaseComponent from '../base/BaseComponent'
import {componentStyles} from '../style'
import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat'
import CustomView from '../components/CustomView'
import signalr from 'react-native-signalr'

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});

let connection;
let proxy;

class MessageDetail extends BaseComponent{
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
    };

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;
  }

  componentWillMount() {
    this._isMounted = true;
    /*this.setState(() => {
      return {
        messages: require('../data/messages'),
      };
    });*/

    connection = signalr.hubConnection('http://nrb-stage.azurewebsites.net/mobile/chat/signalr/hubs');
    connection.logging = true;
    console.log(connection);
    proxy = connection.createHubProxy('ChatCore');

    //receives broadcast messages from a hub function, called "messageFromServer"
    proxy.on('messageFromServer', (message) => {
      console.log(message);

      //Respond to message, invoke messageToServer on server with arg 'hej'
      // let messagePromise =
      //message-status-handling
      messagePromise.done(() => {
        console.log('Invocation of NewContosoChatMessage succeeded');
      }).fail(function (error) {
        console.log('Invocation of NewContosoChatMessage failed. Error: ' + error);
      });
    });

    proxy.on('sayHey', (message) => {
      console.log(message);
    });

    // atempt connection, and handle errors
    connection.start().done(() => {
      proxy.invoke('login', '1|Test');
      console.log('Now connected, connection ID=' + connection.id);
    }).fail(() => {
      console.log('Failed');
    });

    //connection-handling
    connection.connectionSlow(function () {
      console.log('We are currently experiencing difficulties with the connection.')
    });

    connection.error(function (error) {
      console.log('SignalR error: ' + error)
    });



    proxy.on('getNewMsg', (text) => {
      console.log(text);
      console.log(text[0]['MsgList'][0]['MsgContent']);
      this.onReceive(text[0]['MsgList'][0]['MsgContent']);
    });


  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, require('../data/old_messages.js')),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }

  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });

    console.log(messages);

    proxy.invoke('userSendMsgToUser','1|Test',messages[0].text);


    // for demo purpose
    //this.answerDemo(messages);
  }

  answerDemo(messages) {
    if (messages.length > 0) {
      if ((messages[0].image || messages[0].location) || !this._isAlright) {
        this.setState((previousState) => {
          return {
            typingText: 'React Native is typing'
          };
        });
      }
    }

    setTimeout(() => {
      if (this._isMounted === true) {
        if (messages.length > 0) {
          if (messages[0].image) {
            this.onReceive('Nice picture!');
          } else if (messages[0].location) {
            this.onReceive('My favorite place');
          } else {
            if (!this._isAlright) {
              this._isAlright = true;
              this.onReceive('Alright');
            }
          }
        }
      }

      this.setState((previousState) => {
        return {
          typingText: null,
        };
      });
    }, 1000);
  }

  componentDidMount(){
    let arr=[
      {userData:{
        userId:1,
        userName:'abc',
        msgContent:'124ewafdsfa',
        time:'',
        userAvatar:''
      }},
      {}
    ];
  }


  onReceive(text) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            // avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
      };
    });


  }

  renderCustomActions(props) {
    const options = {
      'Action 1': (props) => {
        alert('option 1');
      },
      'Action 2': (props) => {
        alert('option 2');
      },
      'Cancel': () => {},
    };
    return (
      <Actions
        {...props}
        options={options}
      />
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  getNavigationBarProps() {
    return {
      title: '消息详情'
    };
  }

  componentDidMount(){

  }

  renderBody(){
    return(
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        loadEarlier={this.state.loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        isLoadingEarlier={this.state.isLoadingEarlier }
        user={{
          _id: 1, // sent messages should have same user._id
        }}
        renderActions={this.renderCustomActions}
        renderBubble={this.renderBubble}
        renderCustomView={this.renderCustomView}
        renderFooter={this.renderFooter}
      />
    )
  }

}
export default MessageDetail
