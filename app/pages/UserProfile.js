/**
 *
 * @author keyy/1501718947@qq.com 16/11/17 16:30
 * @description
 */
import React, {Component} from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import BaseComponent from '../base/BaseComponent'
import MainContainer from '../containers/MainContainer'
import {
  Container,
  Content,
  List,
  ListItem,
  InputGroup,
  Input,
  Icon as NBIcon,
  Text as NBText,
  Picker as NBPicker,
  Button as NBButton
} from 'native-base'

class UserProfile extends BaseComponent {
  constructor(props) {
    super(props)
  }

  getNavigationBarProps() {
    return {
      title: '个人资料'
    };
  }

  goNext() {
    const {navigator} =this.props;
    navigator.push({
      component: MainContainer,
      name: 'MainContainer'
    });
  }

  renderBody() {
    return (
      <Container>
        <Content>
          <List>
            <ListItem>
              <InputGroup>
                <Input inlineLabel label="First Name" placeholder="John" />
              </InputGroup>
            </ListItem>

            <ListItem>
              <InputGroup>
                <NBIcon name="ios-person" style={{ color: '#0A69FE' }} />
                <Input placeholder="EMAIL" />
              </InputGroup>
            </ListItem>
            </List>
          </Content>
        </Container>
    )
  }
}

export default UserProfile