/* eslint no-use-before-define: ["error", { "variables": false }] */
import PropTypes from 'prop-types';
import React from 'react';
import { Linking, StyleSheet, Text, View, ViewPropTypes } from 'react-native';

import ParsedText from 'react-native-parsed-text';
import Communications from 'react-native-communications';

const WWW_URL_PATTERN = /^www\./i;

export default class MessageText extends React.Component {

  constructor(props) {
    super(props);
    this.onUrlPress = this.onUrlPress.bind(this);
    this.onPhonePress = this.onPhonePress.bind(this);
    this.onEmailPress = this.onEmailPress.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.currentMessage.text !== nextProps.currentMessage.text;
  }

  onUrlPress(url) {
    // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
    // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
    if (WWW_URL_PATTERN.test(url)) {
      this.onUrlPress(`http://${url}`);
    } else {
      Linking.canOpenURL(url).then((supported) => {
        if (!supported) {
          // eslint-disable-next-line
          console.error('No handler for URL:', url);
        } else {
          Linking.openURL(url);
        }
      });
    }
  }

  onPhonePress(phone) {
    const options = ['Call', 'Text', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            Communications.phonecall(phone, true);
            break;
          case 1:
            Communications.text(phone);
            break;
          default:
            break;
        }
      },
    );
  }

  onEmailPress(email) {
    Communications.email([email], null, null, null, null);
  }

  render1 = (matchingString, matches) =>{
    if(matchingString && matchingString.length>2){
      return matchingString.substring(1, matchingString.length-1)
    }
    else{
      return matchingString
    }
  }

  // render2 = (matchingString, matches) =>{
  //   if(matchingString && matchingString.length>4){
  //     return matchingString.substring(2, matchingString.length-2)
  //   }
  //   else{
  //     return matchingString
  //   }
  // }

  // render3 = (matchingString, matches) =>{
  //   console.log('render3',matchingString)
  //   if(matchingString && matchingString.length>6){
  //     return matchingString.substring(3, matchingString.length-3)
  //   }
  //   else{
  //     return matchingString
  //   }
  // }

  render() {
    const linkStyle = StyleSheet.flatten([styles[this.props.position].link, this.props.linkStyle[this.props.position]]);
		let Msg = this.props.currentMessage.text||'';
		if(this.props.currentMessage.dirctn == 'O' && Msg.startsWith('~``C')){
			Msg = Msg.slice(4);
		}

		if(Msg.length==0){
			return(null)
		}
    return (
      <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
        <ParsedText
          style={[
            styles[this.props.position].text,
            this.props.textStyle[this.props.position],
            this.props.customTextStyle,
          ]}
          parse={[
            ...this.props.parsePatterns(linkStyle),
            { type: 'url', style: linkStyle, onPress: this.onUrlPress },
            { type: 'phone', style: linkStyle, onPress: this.onPhonePress },
            { type: 'email', style: linkStyle, onPress: this.onEmailPress },
            { pattern: /Rs. \d*\.?\d+/g, style: styles.price},

            // { pattern: /(\$\*.+?\*\$)+/g, style: {fontFamily: 'Satisfy',fontWeight:'bold'}, renderText: this.render2},
            // { pattern: /(\*\$.+?\$\*)+/g, style: StyleSheet.flatten([styles.satisfy,styles.bold]), renderText: this.render2},
            // { pattern: /(\^\*.+?\*\^)+|(\*\^.+?\^\*)+/g, style: StyleSheet.flatten([styles.mono,styles.bold]), renderText: this.render2},

            // { pattern: /(_~\*.+?\*~_)+|(_\*~.+?~\*_)+|(\*_~.+?~_\*)+|(\*~_.+?_~\*)+|(~\*_.+?_\*~)+|(~_\*.+?\*_~)+/g, style: StyleSheet.flatten([styles.bold,styles.underline,styles.italic]), renderText: this.render3},

            // { pattern: /(\*~.+?~\*)+|(~\*.+?\*~)+/g, style: StyleSheet.flatten([styles.bold,styles.underline]), renderText: this.render2},
            // { pattern: /(\*_.+?_\*)+|(_\*.+?\*_)+/g, style: StyleSheet.flatten([styles.bold,styles.italic]), renderText: this.render2},
            // { pattern: /(_~.+?~_)+|(~_.+?_~)+/g, style: StyleSheet.flatten([styles.underline,styles.italic]), renderText: this.render2},
            
            { pattern: /(\*.+?\*)+/g, style: styles.bold, renderText: this.render1},
            { pattern: /(~.+?~)+/g, style: styles.underline, renderText: this.render1},
            { pattern: /(_.+?_)+/g, style: styles.italic, renderText: this.render1},

            { pattern: /(\$.+?\$)+/g, style: styles.satisfy, renderText: this.render1},
            { pattern: /(\^.+?\^)+/g, style: styles.mono, renderText: this.render1},
          ]}
          childrenProps={{ ...this.props.textProps }}
        >
          {Msg/*this.props.currentMessage.text*/}
        </ParsedText>
      </View>
    );
  }

}

const textStyle = {
  fontSize: 13.5,
  //lineHeight: 20,
  marginTop: 3,
  marginBottom: 3,
  marginLeft: 10,
  marginRight: 10,
};

const styles = {
  price:{
    color:'#1976d2',
    textDecorationLine:'underline'
  },
  // bold:{
  //   fontWeight: 'bold',
  //   fontSize:textStyle.fontSize-0.5
  // },
  // underline:{
  //   textDecorationLine:'underline'
  // },
  // italic:{
  //   fontStyle:'italic'
  // },
  satisfy:{
    fontFamily:'Satisfy'
  },
  mono:{
    fontFamily:'monospace'
  },
  left: StyleSheet.create({
    container: {},
    text: {
      color: 'black',
      ...textStyle,
    },
    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {},
    text: {
      color: 'white',
      ...textStyle,
    },
    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
};

MessageText.contextTypes = {
  actionSheet: PropTypes.func,
};

MessageText.defaultProps = {
  position: 'left',
  currentMessage: {
    text: '',
  },
  containerStyle: {},
  textStyle: { //Previously {}
	left: {color:'black',marginTop:3,marginBottom:0,marginLeft:8,marginRight:8,textAlign :'left'}, 
	right: {color:'black',marginTop:3,marginBottom:0,marginLeft:8,marginRight:8,textAlign :'left'} 
  },
  linkStyle: { left: { color: '#54a2d8' }, right: { color: '#54a2d8' } }, // 54a2d8/#63c0ff'#5bb0eb //Previously {}
  customTextStyle: {},
  textProps: {textBreakStrategy:'balanced'}, //Previously {}
  parsePatterns: () => [],
};

MessageText.propTypes = {
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
  linkStyle: PropTypes.shape({
    left: Text.propTypes.style,
    right: Text.propTypes.style,
  }),
  parsePatterns: PropTypes.func,
  textProps: PropTypes.object,
  customTextStyle: Text.propTypes.style,
};

