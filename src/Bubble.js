/* eslint no-use-before-define: ["error", { "variables": false }] */

import PropTypes from 'prop-types';
import React from 'react';
import {
  Text, Clipboard, StyleSheet, TouchableWithoutFeedback,
  View, ViewPropTypes, Dimensions
} from 'react-native';
import { EventRegister } from 'react-native-event-listeners';

import MessageText from './MessageText';
import MessageImage from './MessageImage';
import Time from './Time';
import Color from './Color';
import { BUBBLE_MAX_WIDTH, BUBBLE_MIN_HEIGHT } from './Constant';
import { createIconSet } from 'react-native-vector-icons';
const glyphMap = { "md-done-all" : 12, "md-checkmark" : 21, "update": 24 };
const Icon = createIconSet(glyphMap, 'FontName', 'clenet.ttf');

import { isSameUser, isSameDay } from './utils';

let { width } = Dimensions.get("window");

export default class Bubble extends React.PureComponent {

  constructor(props) {
    super(props);
    this.onLongPress = this.onLongPress.bind(this);
    this.selectMsg = this.selectMsg.bind(this);
    this.state = {
      msgSlctd: false,
      msgSnt:false,
      msgRcvd:false,
      msgRead:false,
    }
		this._isMounted=false;
		this.rcvRdAt = {rcvdat:this.props.currentMessage.rcvdat,readat:this.props.currentMessage.readat};
  }

  componentDidMount(){
	this._isMounted = true;
    this.listener1 = EventRegister.addEventListener(this.props.currentMessage._id+'bubble', (data) => {
      if(data.typ == 'selectMsg'){
        this.selectMsg();
      }
      else if(data.typ=='sntMsgSts'){
				if(data.rcvdat && data.readat && this._isMounted){
					this.rcvRdAt = {rcvdat:data.rcvdat, readat:data.readat};
          this.setState({msgSnt:false,msgRcvd:false,msgRead:true})
        }
        else if(data.readat && this._isMounted){
					this.rcvRdAt["readat"] = data.readat;
          this.setState({msgSnt:false,msgRcvd:false,msgRead:true})
        }
        else if(data.rcvdat && this._isMounted){
					this.rcvRdAt["rcvdat"] = data.rcvdat;
          this.setState({msgSnt:false,msgRcvd:true,msgRead:false})
        }
      }
      else if(data.typ=='msgSent' && this._isMounted){
        this.setState({msgSnt:true,msgRcvd:false,msgRead:false})
      }
			else if(data.typ=='showInfo' && this._isMounted){
				this.props.onShowInfo(this.rcvRdAt["rcvdat"],this.rcvRdAt["readat"]);
			}
    })
		
    this.listener2 = EventRegister.addEventListener('deSelectMsg', () => {
      if(this.state.msgSlctd){
        this.selectMsg();
      }
    })
  }

  componentWillUnmount(){
	this._isMounted = false;
    EventRegister.removeEventListener(this.listener1);
    EventRegister.removeEventListener(this.listener2);
  }

  onLongPress() {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.context, this.props.currentMessage, this);
    } else if (this.props.currentMessage.text) {
      const options = ['Copy Text', 'Cancel'];
      const cancelButtonIndex = options.length - 1;
      this.context.actionSheet().showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(this.props.currentMessage.text);
              break;
            default:
              break;
          }
        },
      );
    }
  }

  selectMsg = () => {
    if(this.props.canSelectMsg()){
      if(this.state.msgSlctd){
        EventRegister.emit('MsgSelected',{msgid:this.props.currentMessage._id,
                                          type:this.props.currentMessage.type,
                                          sts:false});
        this.setState({msgSlctd:false});
      }
      else{
        EventRegister.emit('MsgSelected',{msgid:this.props.currentMessage._id,
                                          type:this.props.currentMessage.type,
                                          sts:true});
        this.setState({msgSlctd:true});
        this.props.setSelctnMode(true);
      }
    }
  }

  handleBubbleToNext() {
    if (
      isSameUser(this.props.currentMessage, this.props.nextMessage) &&
      isSameDay(this.props.currentMessage, this.props.nextMessage)
    ) {
      return StyleSheet.flatten([
        styles[this.props.position].containerToNext,
        this.props.containerToNextStyle[this.props.position],
      ]);
    }
    return null;
  }

  handleBubbleToPrevious() {
    if (
      isSameUser(this.props.currentMessage, this.props.previousMessage) &&
      isSameDay(this.props.currentMessage, this.props.previousMessage)
    ) {
      return StyleSheet.flatten([
        styles[this.props.position].containerToPrevious,
        this.props.containerToPreviousStyle[this.props.position],
      ]);
    }
    return null;
  }

  renderMessageText() {
    if (this.props.currentMessage.text) {
      const { containerStyle, wrapperStyle, ...messageTextProps } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      return <MessageText {...messageTextProps} />;
    }
    return null;
  }

  renderMessageImage(isCC) {
    if (this.props.currentMessage.image || this.props.currentMessage.url) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps,isCC);
      }
      return <MessageImage {...messageImageProps} />;
    }
    return null;
  }
	
	isNormalChat = () =>{
		if (this.props.ctyp()=='0' || (this.props.ctyp()=='' && !this.props.currentMessage.sid)){
			return true;
		}
		else{
			return false;
		}
	}
	
	isGroupChat = () =>{
		if (this.props.ctyp()=='1' || 
				this.props.ctyp()=='3' || 
				this.props.ctyp()=='4' || this.props.ctyp()=='5'){
			return true;
		}
		else{
			return false;
		}
	}

  renderTicks() {
    const { currentMessage } = this.props;
    if (this.props.renderTicks) {
      return this.props.renderTicks(currentMessage);
    }
    if (currentMessage.user._id !== this.props.user._id) {
      return null;
    }
    if (currentMessage.dirctn == 'O') {
			return (
				<View style={styles.tickView}>
					{/*currentMessage.pushmsg && <Text style={[styles.tick, this.props.tickStyle]}>?</Text>*/}
					{/*currentMessage.rcvdat && <Text style={[styles.tick, this.props.tickStyle]}>?</Text>*/}
					{(currentMessage.readat || this.state.msgRead)?
						<Icon style={{ color: '#26C6DA', width: 13, fontSize: 13, alignSelf: 'flex-end' }} name='md-done-all' />:
						<Icon style={{ color: (currentMessage.rcvdat==420?'#E57373':'#90A4AE'), width: 13, fontSize: 13, alignSelf: 'flex-end' }} 
							name={((currentMessage.rcvdat && currentMessage.rcvdat!=420) || this.state.msgRcvd)?'md-done-all':
										(currentMessage.rcvdat==420)?'update':
										(!currentMessage.pushmsg || this.state.msgSnt)?'md-checkmark':'update'}/>}
				</View>
			);
    }
    return null;
  }

  renderTime() {
    if (this.props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, ...timeProps } = this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      return <Time {...timeProps} />;
    }
    return null;
  }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }
	
  render() {
		if(this.props.currentMessage.taged){
			return (
				this.props.renderTags(this.props.currentMessage.text)
			)
		}
		
		let Msg = this.props.currentMessage.text||'';
		let isCC = false;
		if(this.props.currentMessage.dirctn == 'O' && Msg.startsWith('~``C')){
			isCC = true;
		}
		let hideTringle = isSameUser(this.props.currentMessage, this.props.previousMessage) && isSameDay(this.props.currentMessage, this.props.previousMessage);
    return (
      <View style={{flex:1,marginHorizontal:5}}>
        <View
          style={[
            styles[this.props.position].container,
            this.props.containerStyle[this.props.position], // for selection ,{backgroundColor:(this.state.msgSlctd?'#ffab91':null)}
          ]}
        >
          {this.props.position == 'left' ?
          <View style={[styles.triangleCorner, { borderTopColor: hideTringle?'transparent':'white'},styles.leftTrngl]} /> : null}
          <View
            style={[
              styles[this.props.position].wrapper,
              this.props.wrapperStyle[this.props.position]
              // this.handleBubbleToNext(),
              // this.handleBubbleToPrevious(),
            ]}
          >
            <TouchableWithoutFeedback
							onPress = {()=>{if(this.props.getSelctnMode()){this.selectMsg()}}}
              onLongPress={this.selectMsg} //previously this.onLongPress and it should be this.selectMsg
              accessibilityTraits="text"
              {...this.props.touchableProps}
            >
              <View>
								{isCC?<View style={styles.CCtriangle}></View> : null}
                {this.props.currentMessage.dirctn == 'I' && !hideTringle && this.isGroupChat() && this.renderCustomView()}
                {this.renderMessageImage(isCC)}
                {this.props.currentMessage.text && this.props.currentMessage.text.length ?
                  <View style={(this.props.currentMessage.text.length < 24 ? styles.textlenthmax24 : styles.textlenthmin25)}>
                    {this.renderMessageText()}
                    <View style={[styles.bottom, this.props.bottomContainerStyle[this.props.position], (this.props.currentMessage.text.length < 24 ? { marginTop: 3 } : null)]}>
                      {this.renderTime()}
                      {this.renderTicks()}
                    </View>
                  </View> :
                  <View style={[styles.bottom, this.props.bottomContainerStyle[this.props.position]]}>
                    {this.renderTime()}
                    {this.renderTicks()}
                  </View>}
              </View>
            </TouchableWithoutFeedback>
          </View>
          {this.props.position == 'right' ? <View style={[styles.triangleCorner, { borderTopColor: hideTringle?'transparent':'rgba(215,250,173,0.99)', marginLeft: -5, transform: [{ rotate: '0deg' }] }]} /> : null}
        </View>
        {this.state.msgSlctd && 
        <View onStartShouldSetResponder={() => true} onResponderRelease ={(event) => {this.selectMsg()}}
          style={[styles.selectMsg,{marginLeft:(this.props.position == 'left'?-10:0)}]}/> 
          /*rgba(128,203,196,0.3)*/}
      </View>
    );
  }

}

const styles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
      flexDirection: 'row',
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: Color.leftBubbleBackground,
      maxWidth: BUBBLE_MAX_WIDTH,
      // marginRight: 60,
      minHeight: BUBBLE_MIN_HEIGHT,
      justifyContent: 'flex-end',
    },
    containerToNext: {
      borderBottomLeftRadius: 3,
    },
    containerToPrevious: {
      borderTopLeftRadius: 3,
    },
  }),
  right: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'flex-start',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: Color.defaultBlue,
      maxWidth: BUBBLE_MAX_WIDTH,
      // marginLeft: 60,
      minHeight: BUBBLE_MIN_HEIGHT,
      justifyContent: 'flex-start',
    },
    containerToNext: {
      borderBottomRightRadius: 3,
    },
    containerToPrevious: {
      borderTopRightRadius: 3,
    },
  }),
  bottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  tick: {
    fontSize: 10,
    backgroundColor: Color.backgroundTransparent,
    color: Color.white,
  },
  tickView: {
    flexDirection: 'row',
    marginRight: 5,
    marginBottom: 2
  },
  triangleCorner: {
    width: 0,
    height: 0,
    // backgroundColor: 'transparent',
    // borderStyle: 'solid',
    borderRightWidth: 15,
    borderTopWidth: 15,
    borderRightColor: 'transparent',
    borderRadius: 3,
  },
  textlenthmax24: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 3
  },
  textlenthmin25: {
    flexDirection: 'column'
  },
	CCtriangle: {
    width: 0,
    height: 0,
		bottom:0,
		// left:0,
    // backgroundColor: 'transparent',
    // borderStyle: 'solid',
    borderRightWidth: 11,
    borderTopWidth: 11,
    borderRightColor: 'transparent',
    borderTopLeftRadius: 3,
    borderTopColor:'#f9a825',position:'absolute', alignSelf: 'flex-start',transform: [{ rotate: '-90deg' }]
  },
  leftTrngl:{alignSelf: 'flex-start', position: 'absolute', transform: [{ rotate: '90deg' }] },
  selectMsg:{position:'absolute',width:width,height:'103%',margin:0,backgroundColor:'rgba(102,187,106,0.3)'}
};

Bubble.contextTypes = {
  actionSheet: PropTypes.func,
};

Bubble.defaultProps = {
  touchableProps: {},
  onLongPress: null,
  renderMessageImage: null,
  renderMessageText: null,
  renderCustomView: null,
  renderTicks: null,
  renderTime: null,
  position: 'left',
  currentMessage: {
    text: null,
    createdAt: null,
    image: null,
  },
  nextMessage: {},
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {  //Previously {}
    left: {
      backgroundColor: 'white', marginLeft: 10, borderRadius: 0, borderBottomRightRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5,
      borderRightColor: 'gray', borderRightWidth: 0.25, borderBottomColor: 'gray', borderBottomWidth: 0.25
    },
    right: {
      backgroundColor: 'rgba(215,250,173,0.99)', borderRadius: 0, borderBottomLeftRadius: 5, alignSelf: 'flex-end', borderTopLeftRadius: 5,
      borderBottomRightRadius: 5, borderLeftColor: 'gray', borderLeftWidth: 0.25, borderBottomColor: 'gray', borderBottomWidth: 0.25
    }
  }, //rgba(210,255,170,1),rgba(190,250,200,0.8) rgba(210,250,200,0.8) rgba(230,250,200,0.8) ccf7c2/dbf7c9/e2ffd0
  bottomContainerStyle: {},
  tickStyle: { color: '#aaa' },//Previously {}
  containerToNextStyle: {},
  containerToPreviousStyle: {},
};

Bubble.propTypes = {
  user: PropTypes.object.isRequired,
  touchableProps: PropTypes.object,
  onLongPress: PropTypes.func,
  renderMessageImage: PropTypes.func,
  renderMessageText: PropTypes.func,
  renderCustomView: PropTypes.func,
  renderTime: PropTypes.func,
  renderTicks: PropTypes.func,
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  wrapperStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  bottomContainerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  tickStyle: Text.propTypes.style,
  containerToNextStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
  containerToPreviousStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
};
