/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View, ViewPropTypes } from 'react-native';

import dayjs from 'dayjs';

import Color from './Color';
import { TIME_FORMAT } from './Constant';

export default function Time({ position, containerStyle, currentMessage, timeFormat, textStyle }, context) {
  return (
    <View style={[styles[position].container, containerStyle[position]]}>
      <Text style={[styles[position].text, textStyle[position]]}>
        {dayjs(currentMessage.createdAt).format(timeFormat)}
      </Text>
    </View>
  );
}

const containerStyle = {
  marginLeft: 10,
  marginRight: 5,
  marginBottom: 2,
};

const textStyle = {
  fontSize: 11, //10,
  backgroundColor: 'transparent',
  textAlign: 'right',
};

const styles = {
  left: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: Color.timeTextColor,
      ...textStyle,
    },
  }),
  right: StyleSheet.create({
    container: {
      ...containerStyle,
    },
    text: {
      color: Color.timeTextColor, //Color.white,
      ...textStyle,
    },
  }),
};

Time.contextTypes = {
  getLocale: PropTypes.func,
};

Time.defaultProps = {
  position: 'left',
  currentMessage: {
    createdAt: null,
  },
  containerStyle: {},
  textStyle: {},
  timeFormat: TIME_FORMAT,
};

Time.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  textStyle: PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
  timeFormat: PropTypes.string,
};
