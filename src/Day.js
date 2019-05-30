/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View, ViewPropTypes } from 'react-native';
import dayjs from 'dayjs';
import Color from './Color';

import { isSameDay, isSameDate } from './utils';
import { DATE_FORMAT } from './Constant';

export default function Day(
  { dateFormat, currentMessage, previousMessage, nextMessage, containerStyle, wrapperStyle, textStyle, inverted },
  context,
) {
  if (!isSameDay(currentMessage, inverted ? previousMessage : nextMessage)) {
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={wrapperStyle}>
          <Text style={[styles.text, textStyle]}>
            {isSameDate(dayjs(currentMessage.createdAt), dayjs()) ? 'Today' :
              isSameDate(dayjs(currentMessage.createdAt), dayjs().add(-1, 'day')) ? 'Yesterday' :
                dayjs(currentMessage.createdAt).format(dateFormat)}
          </Text>
        </View>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  text: {
    backgroundColor: Color.backgroundTransparent,
    color: '#E3F2FD', //Previously Color.defaultColor,
    fontSize: 12, //Previously 12,
    fontWeight: 'bold', //Previously '600',
  },
});

Day.contextTypes = {
  getLocale: PropTypes.func,
};

Day.defaultProps = {
  currentMessage: {
    // TODO: test if crash when createdAt === null
    createdAt: null,
  },
  previousMessage: {},
  nextMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  textStyle: { backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 10, borderRadius: 10 },// Previously {},
  dateFormat: DATE_FORMAT,
};

Day.propTypes = {
  currentMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  inverted: PropTypes.bool,
  containerStyle: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  dateFormat: PropTypes.string,
};
