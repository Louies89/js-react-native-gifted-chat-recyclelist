/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import { Platform, StyleSheet, TextInput, ScrollView, View } from 'react-native';
import { createIconSet } from 'react-native-vector-icons';
const Icon = createIconSet({"md-attach":23}, 'FontName', 'clenet.ttf');

import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER } from './Constant';
import Color from './Color';

export default class Composer extends React.Component {
  state = {
    showscroll: false
  }

  onContentSizeChange(e) {
    const { contentSize } = e.nativeEvent;

    // Support earlier versions of React Native on Android.
    if (!contentSize) return;

    if (
      !this.contentSize ||
      this.contentSize.width !== contentSize.width ||
      this.contentSize.height !== contentSize.height
    ) {
      this.contentSize = contentSize;
      this.props.onInputSizeChanged(this.contentSize);
    }
  }

  onChangeText(text) {
    if (text.search('\n') == -1) {
      this.setState({ showscroll: false });
    }
    this.props.onTextChanged(text);
  }

  render() {
    return (
      <View style={styles.vw1}>
        <View style={[styles.vw2,{height: this.props.composerHeight}]}>
          <ScrollView scrollEventThrottle={10} showsVerticalScrollIndicator={this.state.showscroll}
						keyboardShouldPersistTaps = {'never'}
            style={{ marginRight: 10 }}>
            <TextInput
              placeholder={this.props.placeholder}
              placeholderTextColor={this.props.placeholderTextColor}
              multiline={this.props.multiline}
              onChange={(e) => this.onContentSizeChange(e)}
              onContentSizeChange={(e) => this.onContentSizeChange(e)}
              onChangeText={(text) => this.onChangeText(text)}
              onScroll={(nativeEvent) => { this.setState({ showscroll: true }) }}
              style={[styles.textInput, this.props.textInputStyle, { paddingTop: 5 }]}
              autoFocus={this.props.textInputAutoFocus}
              value={this.props.text}
              accessibilityLabel={this.props.text || this.props.placeholder}
              enablesReturnKeyAutomatically
              underlineColorAndroid="transparent"
              keyboardAppearance={this.props.keyboardAppearance}
              {...this.props.textInputProps}
            />
          </ScrollView>
        </View>
        
        <Icon style={styles.attach} onPress={() => { this.props.onPressAttachment() }} size={25} name="md-attach" />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    marginLeft: 0,
    fontSize: 16,
    lineHeight: 16,
	  borderRadius: 20,
	  paddingLeft:10,
    marginTop: Platform.select({
      ios: 6,
      android: 0,
    }),
    marginBottom: Platform.select({
      ios: 5,
      android: 3,
    }),
  },
  attach:{
    color: 'gray', 
    paddingRight: 15,
    paddingLeft:15,
    paddingBottom:10,
    textAlignVertical: 'center',
    textAlign:'center',
    fontSize:27,
    alignSelf:'flex-end' 
  },
  vw1:{ 
    justifyContent: 'center', 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  vw2:{
    flex: 1, marginLeft: 10, marginBottom: 6, elevation:2, backgroundColor: 'white',
    borderRadius: 20, justifyContent: 'center'
  }
});

Composer.defaultProps = {
  composerHeight: MIN_COMPOSER_HEIGHT,
  text: '',
  placeholderTextColor: Color.defaultProps,
  placeholder: DEFAULT_PLACEHOLDER,
  textInputProps: null,
  multiline: true,
  textInputStyle: {},
  textInputAutoFocus: false,
  keyboardAppearance: 'default',
  onTextChanged: () => { },
  onInputSizeChanged: () => { },
};

Composer.propTypes = {
  composerHeight: PropTypes.number,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  textInputProps: PropTypes.object,
  onTextChanged: PropTypes.func,
  onInputSizeChanged: PropTypes.func,
  multiline: PropTypes.bool,
  textInputStyle: TextInput.propTypes.style,
  textInputAutoFocus: PropTypes.bool,
  keyboardAppearance: PropTypes.string,
};
