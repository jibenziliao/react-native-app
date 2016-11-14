/**
 *
 * @author keyy/1501718947@qq.com 16/11/8 15:27
 * @description
 */
import {
  StyleSheet,
  Dimensions,
Platform
} from 'react-native';

const { height, width } = Dimensions.get('window');

// ===============================================
// style config
// ===============================================

export const StyleConfig = {

  color_primary: 'rgba(60, 177, 158, 1)',
  color_danger: 'rgba(199, 85, 74, 1)',
  color_warning: 'rgba(216, 196, 128, 1)',
  color_success: 'rgba(69, 190, 174, 1)',
  color_white: 'rgba(255, 255, 255, 1)',
  color_light: 'rgba(255, 255, 255, 0.6)',
  color_muted: 'rgba(0, 0, 0, 0.4)',
  color_gray: 'rgba(0, 0, 0, 0.6)',
  color_dark: 'rgba(0, 0, 0, 0.7)',
  color_black: 'rgba(0, 0, 0, 0.8)',

  font_eg: 24,
  font_lg: 20,
  font_md: 18,
  font_sm: 16,
  font_xs: 14,
  font_ms: 12,

  line_height_lg: 36,
  line_height_md: 26,
  line_height_sm: 24,

  space_0:   0,
  space_5:   5,
  space_10:   10,
  space_15:   15,
  space_20:   20,

  screen_width: width,
  screen_height: height,
};


// ===============================================
// common styles
// ===============================================

export const CommonStyles = StyleSheet.create({

  // flex grid

  flexColumn: {
    flexDirection: 'column'
  },

  flexRow: {
    flexDirection: 'row'
  },

  flexItemsMiddle: {
    alignItems: 'center'
  },

  flexItemsTop: {
    alignItems: 'flex-start'
  },

  flexItemsBottom: {
    alignItems: 'flex-end'
  },

  flexItemsLeft: {
    justifyContent: 'flex-start'
  },

  flexItemsCenter: {
    justifyContent: 'center'
  },

  flexItemsRight: {
    justifyContent: 'flex-end'
  },

  flexSelfTop: {
    alignSelf: 'flex-start'
  },

  flexSelfMiddle: {
    alignSelf: 'center'
  },

  flexSelfBottom: {
    alignSelf: 'flex-end'
  },

  flexItemsAround: {
    justifyContent: 'space-around'
  },

  flexItemsBetween: {
    justifyContent: 'space-between'
  },

  flexWrap:{
    flexWrap:'wrap'
  },

  flex_1: {
    flex: 1
  },

  flex_2: {
    flex: 2
  },

  flex_3: {
    flex: 3
  },

  flex_4: {
    flex: 4
  },

  flex_5: {
    flex: 5
  },

  // font size

  font_eg: {
    fontSize: StyleConfig.font_eg
  },

  font_lg: {
    fontSize: StyleConfig.font_lg
  },

  font_md: {
    fontSize: StyleConfig.font_md
  },

  font_sm: {
    fontSize: StyleConfig.font_sm
  },

  font_xs: {
    fontSize: StyleConfig.font_xs
  },

  font_ms: {
    fontSize: StyleConfig.font_ms
  },

  line_height_lg: {
    lineHeight: StyleConfig.line_height_lg
  },

  line_height_md: {
    lineHeight: StyleConfig.line_height_md
  },

  line_height_sm: {
    lineHeight: StyleConfig.line_height_sm
  },

  // text

  text_left: {
    textAlign: 'left'
  },

  text_center: {
    textAlign: 'center'
  },

  text_right: {
    textAlign: 'right'
  },

  text_primary: {
    color: StyleConfig.color_primary
  },

  text_danger: {
    color: StyleConfig.color_danger
  },

  text_warning: {
    color: StyleConfig.color_warning
  },

  text_success: {
    color: StyleConfig.color_success
  },

  text_white: {
    color: StyleConfig.color_white
  },

  text_light: {
    color: StyleConfig.color_light
  },

  text_muted: {
    color: StyleConfig.color_muted
  },

  text_gray: {
    color: StyleConfig.color_gray
  },

  text_dark: {
    color: StyleConfig.color_dark
  },

  text_black: {
    color: StyleConfig.color_black
  },

  //background

  background_white: {
    backgroundColor: StyleConfig.color_white
  },

  background_light: {
    backgroundColor: StyleConfig.color_light
  },

  background_dark: {
    backgroundColor: StyleConfig.color_dark
  },
  // space

  m_t_20: {
    marginTop: StyleConfig.space_20
  },

  m_t_15:{
    marginTop: StyleConfig.space_15
  },

  m_t_10:{
    marginTop: StyleConfig.space_10
  },

  m_t_5:{
    marginTop: StyleConfig.space_5
  },

  m_t_0:{
    marginTop: StyleConfig.space_0
  },

  m_l_20: {
    marginLeft: StyleConfig.space_20
  },

  m_l_15:{
    marginLeft: StyleConfig.space_15
  },

  m_l_10:{
    marginLeft: StyleConfig.space_10
  },

  m_l_5:{
    marginLeft: StyleConfig.space_5
  },

  m_l_0:{
    marginLeft: StyleConfig.space_0
  },

  m_r_20: {
    marginRight: StyleConfig.space_20
  },

  m_r_15:{
    marginRight: StyleConfig.space_15
  },

  m_r_10:{
    marginRight: StyleConfig.space_10
  },

  m_r_5:{
    marginRight: StyleConfig.space_5
  },

  m_r_0:{
    marginRight: StyleConfig.space_0
  },

  m_b_20: {
    marginBottom: StyleConfig.space_20
  },

  m_b_15:{
    marginBottom: StyleConfig.space_15
  },

  m_b_10:{
    marginBottom: StyleConfig.space_10
  },

  m_b_5:{
    marginBottom: StyleConfig.space_5
  },

  m_b_0:{
    marginBottom: StyleConfig.space_0
  },

  m_x_20: {
    marginHorizontal: StyleConfig.space_20
  },

  m_x_15:{
    marginHorizontal: StyleConfig.space_15
  },

  m_x_10:{
    marginHorizontal: StyleConfig.space_10
  },

  m_x_5:{
    marginHorizontal: StyleConfig.space_5
  },

  m_x_0:{
    marginHorizontal: StyleConfig.space_0
  },

  m_y_20: {
    marginVertical: StyleConfig.space_20
  },

  m_y_15:{
    marginVertical: StyleConfig.space_15
  },

  m_y_10:{
    marginVertical: StyleConfig.space_10
  },

  m_y_5:{
    marginVertical: StyleConfig.space_5
  },

  m_y_0:{
    marginVertical: StyleConfig.space_0
  },

  m_a_20: {
    margin: StyleConfig.space_20
  },

  m_a_15:{
    margin: StyleConfig.space_15
  },

  m_a_10:{
    margin: StyleConfig.space_10
  },

  m_a_5:{
    margin: StyleConfig.space_5
  },

  m_a_0:{
    margin: StyleConfig.space_0
  },

  p_t_20: {
    paddingTop: StyleConfig.space_20
  },

  p_t_15:{
    paddingTop: StyleConfig.space_15
  },

  p_t_10:{
    paddingTop: StyleConfig.space_10
  },

  p_t_5:{
    paddingTop: StyleConfig.space_5
  },

  p_t_0:{
    paddingTop: StyleConfig.space_0
  },

  p_l_20: {
    paddingLeft: StyleConfig.space_20
  },

  p_l_15:{
    paddingLeft: StyleConfig.space_15
  },

  p_l_10:{
    paddingLeft: StyleConfig.space_10
  },

  p_l_5:{
    paddingLeft: StyleConfig.space_5
  },

  p_l_0:{
    paddingLeft: StyleConfig.space_0
  },

  p_r_20: {
    paddingRight: StyleConfig.space_20
  },

  p_r_15:{
    paddingRight: StyleConfig.space_15
  },

  p_r_10:{
    paddingRight: StyleConfig.space_10
  },

  p_r_5:{
    paddingRight: StyleConfig.space_5
  },

  p_r_0:{
    paddingRight: StyleConfig.space_0
  },

  p_b_20: {
    paddingBottom: StyleConfig.space_20
  },

  p_b_15:{
    paddingBottom: StyleConfig.space_15
  },

  p_b_10:{
    paddingBottom: StyleConfig.space_10
  },

  p_b_5:{
    paddingBottom: StyleConfig.space_5
  },

  p_b_0:{
    paddingBottom: StyleConfig.space_0
  },

  p_x_20: {
    paddingHorizontal: StyleConfig.space_20
  },

  p_x_15:{
    paddingHorizontal: StyleConfig.space_15
  },

  p_x_10:{
    paddingHorizontal: StyleConfig.space_10
  },

  p_x_5:{
    paddingHorizontal: StyleConfig.space_5
  },

  p_x_0:{
    paddingHorizontal: StyleConfig.space_0
  },

  p_y_20: {
    paddingVertical: StyleConfig.space_20
  },

  p_y_15:{
    paddingVertical: StyleConfig.space_15
  },

  p_y_10:{
    paddingVertical: StyleConfig.space_10
  },

  p_y_5:{
    paddingVertical: StyleConfig.space_5
  },

  p_y_0:{
    paddingVertical: StyleConfig.space_0
  },

  p_a_20: {
    padding: StyleConfig.space_20
  },

  p_a_15:{
    padding: StyleConfig.space_15
  },

  p_a_10:{
    padding: StyleConfig.space_10
  },

  p_a_5:{
    padding: StyleConfig.space_5
  },

  p_a_0:{
    padding: StyleConfig.space_0
  }
});

// ===============================================
// component styles
// ===============================================

export const componentStyles=StyleSheet.create({
  container:{
    ...Platform.select({
      ios: {
        paddingTop:64
      },
      android: {
        paddingTop:54
      }
    }),
    backgroundColor:'#ebebeb',
    paddingHorizontal:10,
    flex: 1,
  },
});