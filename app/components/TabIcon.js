/**
 *
 * @author keyy/1501718947@qq.com 16/11/8 16:38
 * @description
 */
import React, {PropTypes} from 'react'
import {Text, View} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string
};

function renderIcon(name,size,props){
  return(
    <View style={{flex:1,justifyContent:'space-between',alignItems:'center'}}>
      <Icon name={name} size={size} style={{color: props.selected ? 'red' : 'black'}}/>
      <Text style={{color: props.selected ? 'red' : 'black'}}>
        {props.title}
      </Text>
    </View>
  )
}

const TabIcon = (props) => {
  if(props.sceneKey=='home'){
    return renderIcon('home',28,props)
  }else if(props.sceneKey=='vicinity'){
    return  renderIcon('compass',28,props)
  }else if(props.sceneKey=='mine'){
    return renderIcon('user',26,props)
  }else{
    return renderIcon('commenting-o',26,props)
  }
};

TabIcon.propTypes = propTypes;

export default TabIcon;