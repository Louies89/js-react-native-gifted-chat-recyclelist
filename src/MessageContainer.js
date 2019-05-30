/* eslint
    no-console: 0,
    no-param-reassign: 0,
    no-use-before-define: ["error", { "variables": false }],
    no-return-assign: 0,
    react/no-string-refs: 0,
    react/sort-comp: 0
*/

import PropTypes from 'prop-types';
import React from 'react';

import { FlatList, View, StyleSheet, Platform } from 'react-native';

import LoadEarlier from './LoadEarlier';
import Message from './Message';

// import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import RecyclerviewList, { DataSource } from 'react-native-recyclerview-list';

export default class MessageContainer extends React.Component {

  static getDerivedStateFromProps({ loadEarlier }, prevState) {
    if (loadEarlier === prevState.loadEarlier) return prevState;

    return {
      loadEarlier,
    };
  }

  constructor(props) {
    super(props);

    this.state = {};
    // this.renderRow = this.renderRow.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
    this.renderHeaderWrapper = this.renderHeaderWrapper.bind(this);
	
	// this._layoutProvider = new LayoutProvider(
		// index => {
			// return 0;
		// },
		// (type, dim) => {
			// dim.width = width;
			// dim.height = 100;
		// }
	// );
  }

  renderFooter() {
    if (this.props.renderFooter) {
      const footerProps = {
        ...this.props,
      };
      return this.props.renderFooter(footerProps);
    }
    return null;
  }

  renderLoadEarlier() {
    if (this.props.loadEarlier === true) {
      const loadEarlierProps = {
        ...this.props,
      };
      if (this.props.renderLoadEarlier) {
        return this.props.renderLoadEarlier(loadEarlierProps);
      }
      return <LoadEarlier {...loadEarlierProps} />;
    }
    return null;
  }

  scrollTo(options) {
    if (this.flatListRef) {
      this.flatListRef.scrollToOffset(options);
    }
	else if(this.recycleListRef){ //Added by Chandrajyoti
		this.recycleListRef.scrollToIndex({
        animated: false,
        index: -1,
        viewPosition: 0,
        viewOffset: 0
      });;
	}
  }

  reloadChat(){ //Added by Chandrajyoti
	  this.recycleListRef.props.dataSource.setDirty();
  }
  
  // renderRow({ item, index }) {   //for FlatList default implementation
    // if (!item._id && item._id !== 0) {
      // console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(item));
    // }
    // if (!item.user) {
      // if (!item.system) {
        // console.warn('GiftedChat: `user` is missing for message', JSON.stringify(item));
      // }
      // item.user = {};
    // }
    // const { messages, ...restProps } = this.props;
    // const previousMessage = messages[index + 1] || {};
    // const nextMessage = messages[index - 1] || {};

    // const messageProps = {
      // ...restProps,
      // key: item._id,
      // currentMessage: item,
      // previousMessage,
      // nextMessage,
      // position: item.user._id === this.props.user._id ? 'right' : 'left',
    // };

    // if (this.props.renderMessage) {
      // return this.props.renderMessage(messageProps);
    // }
    // return <Message {...messageProps} />;
  // }
  
  // _renderRow(item,index) {  //for FlatList by Chandrajyoti
  // _renderRow(type,item,index) {  //for RecyclerListView by Chandrajyoti
    // if (!item.msgid && item.msgid !== 0) {
      // console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(item));
    // }

    // const { messages, ...restProps } = this.props;
		
	// let previousMessage =  {};
	// if(messages && messages[index + 1]){
		// if (messages[index + 1].system) {
			// previousMessage = {createdAt:messages[index + 1].createdAt,user:{_id:messages[index + 1]._id}}; 
		// }
		// else if(messages[index + 1].msgtype=='I'){
			// previousMessage = {createdAt:new Date(messages[index + 1].rcvdat),user:{_id:item.id[0].id}}; 
		// }
		// else if(messages[index + 1].msgtype=='O'){
			// previousMessage = {createdAt:new Date(messages[index + 1].sntat),user:{_id:item.msgid}};
		// }
	// }
	
	// let nextMessage =  {};
	// if(messages && messages[index - 1]){
		// if (messages[index - 1].system) {
			// nextMessage = {createdAt:messages[index - 1].createdAt,user:{_id:messages[index - 1]._id}}; 
		// }
		// else if(messages[index - 1].msgtype=='I'){
			// nextMessage = {createdAt:new Date(messages[index - 1].rcvdat),user:{_id:item.id[0].id}};
		// }
		// else if(messages[index - 1].msgtype=='O'){
			// nextMessage = {createdAt:new Date(messages[index - 1].sntat),user:{_id:item.msgid}};
		// }
	// }
	
	// if(item.system){
		////item.user = {}; 
		////No need to change anything as the format of item is as below:
		////{
        //// _id: 1, //system Message Id. This can be any number
        //// text: 'This is another system message',
        //// createdAt: new Date(Date.UTC(2016, 5, 12, 17, 20, 0)),
        //// system: true,
        ////}
	// }
	// else if(item.msgid){
		
		// let msgCreatedAt = (item.msgtype=='I'?new Date(item.rcvdat):new Date(item.sntat)) || new Date();
		// let fromId = (item.msgtype=='I'?item.id[0].id:this.props.user._id)
		// item = {_id:item.msgid,text:item.msg,createdAt:msgCreatedAt,image:'file://'+item.mpath,type:item.mtype,dirctn:item.msgtype,user:{_id:fromId}};
	// }

	
    // const messageProps = {
      // ...restProps,
      // key: item._id,
      // currentMessage: item,
      // previousMessage,
      // nextMessage,
      // position: item.user._id === this.props.user._id ? 'right' : 'left',
    // };

    // if (this.props.renderMessage) {
      // return this.props.renderMessage(messageProps);
    // }
    // return <View><Message {...messageProps} /></View>;
  // }
  
  rendererChats(item,index) {  //Created newly
    if (!item.msgid && item.msgid !== 0) {
      console.warn('GiftedChat: `_id` is missing for message', JSON.stringify(item));
    }

    const { messages, ...restProps } = this.props;
	
	var previousMessage =  {};
	if(messages && messages[index + 1]){
		if (messages[index + 1].system) {
			previousMessage = {createdAt:messages[index + 1].createdAt,user:{_id:messages[index + 1]._id || 0}}; 
		}
		else if(messages[index + 1].msgtype=='I'){
			// previousMessage = {createdAt:new Date(messages[index + 1].rcvdat),user:{_id:item.id[0].id}};  //Causes Problem
      previousMessage = {createdAt:new Date(messages[index + 1].sntat),user:{_id:(messages[index + 1].sid && !messages[index + 1].tag)?messages[index + 1].sid:this.props.user.otherId || 0}}; 
      //The condition (messages[index + 1].sid && !messages[index + 1].tag) is used otherwis, if tag message and normal message comes from same user then, name is not showing for normal message
		}
		else if(messages[index + 1].msgtype=='O'){
			previousMessage = {createdAt:new Date(messages[index + 1].sntat),user:{_id:this.props.user._id  || 0}};
		}
	}
	
	var nextMessage =  {};
	if(messages && messages[index - 1]){
		if (messages[index - 1].system) {
			nextMessage = {createdAt:messages[index - 1].createdAt,user:{_id:messages[index - 1]._id || 0}}; 
		}
		else if(messages[index - 1].msgtype=='I'){
			// nextMessage = {createdAt:new Date(messages[index - 1].rcvdat),user:{_id:item.id[0].id}}; //Causes Problem
			nextMessage = {createdAt:new Date(messages[index - 1].sntat),user:{_id:this.props.user.otherId  || 0}};
		}
		else if(messages[index - 1].msgtype=='O'){
			nextMessage = {createdAt:new Date(messages[index - 1].sntat),user:{_id:this.props.user._id || 0}};
		}
	}
	
	// alert(item.msgid)
	
	if(item.system){
		item["_id"] = item.msgid;
		item.user = {}; 
		// No need to change anything as the format of item is as below:
		 // {
          // msgid: 1, //system Message Id. This can be any number
          // text: 'This is another system message',
          // createdAt: new Date(Date.UTC(2016, 5, 12, 17, 20, 0)),
          // system: true,
        // }
	}
	else if(item.msgid){
		
		// let msgCreatedAt = (item.msgtype=='I'?new Date(item.rcvdat):new Date(item.sntat)) || new Date(); //Causes Problem
		let msgCreatedAt = new Date(item.sntat) || new Date();
		let fromId = (item.msgtype=='I'?(item.sid?item.sid:this.props.user.otherId):this.props.user._id)

		item = {_id:item.msgid,
				text:item.msg,
				createdAt:msgCreatedAt,
				pushmsg: item.pushmsg,
				rcvdat: item.rcvdat,
				readat: item.readat,
				image:item.mpath,
				name:item.mname,
				type:item.mtype,
				url:item.murl,
				dirctn:item.msgtype,
				user:{_id:fromId},
				// msn:item.msn
				taged:(item.tag && item.tag.length>0),
				sid:item.sid
			   };
	}

	
    const messageProps = {
      ...restProps,
      key: item._id,
      currentMessage: item,
      previousMessage,
      nextMessage,
      position: item.user._id === this.props.user._id ? 'right' : 'left',
    };

    if (this.props.renderMessage) {
      return this.props.renderMessage(messageProps);
    }
    return <Message {...messageProps} />;
  }
  

  renderHeaderWrapper() {
    return <View style={styles.headerWrapper}>{this.renderLoadEarlier()}</View>;
  }

  render() {
    if (this.props.messages.length === 0) {
      return <View style={styles.container} />;
    }
	// alert(Object.keys(this.props.messages[0]))

    return (
      // <View style={styles.container}>
        // <FlatList
          // ref={(ref) => (this.flatListRef = ref)}
          // keyExtractor={(item) => item._id.toString()}
          // enableEmptySections
          // extraData={this.state}
          // automaticallyAdjustContentInsets={false}
          // removeClippedSubviews={Platform.OS === 'android'}
          // inverted={this.props.inverted}
          // {...this.props.listViewProps}
          // data={this.props.messages}
          // style={styles.listStyle}
          // contentContainerStyle={styles.contentContainerStyle}
          // renderItem={this.renderRow}
          // renderHeader={this.renderFooter}
          // renderFooter={this.renderLoadEarlier}
          // {...this.props.invertibleScrollViewProps}
          // ListFooterComponent={this.renderHeaderWrapper}
        // />
      // </View>
	  
	  
	  //Added by Chandrajyoti
      // <View style={styles.container}>
        // <FlatList
          // ref={(ref) => (this.flatListRef = ref)}
          // keyExtractor={(item) => item.msgid.toString()}
          // enableEmptySections
          // extraData={this.state}
          // automaticallyAdjustContentInsets={false}
          // removeClippedSubviews={Platform.OS === 'android'}
          // inverted={this.props.inverted}
          // {...this.props.listViewProps}
          // data={this.props.messages}
          // style={styles.listStyle}
          // contentContainerStyle={styles.contentContainerStyle}
          // renderItem={this._renderRow}
          // {...this.props.invertibleScrollViewProps} //Not used at all, as it is received, it is just passed 
		  // ListHeaderComponent = {this.renderFooter}  //As the chat is inverted, the header part shall render the bottom of the chat
        // />
      // </View>
	  
	  // <View style={[styles.container,{marginTop:10,marginBottom:5}]}>
        // <RecyclerListView
          // style={{ flex: 1 }}
          // showsVerticalScrollIndicator={true}
          // layoutProvider={this._layoutProvider}
          // dataProvider={new DataProvider((r1, r2) => {
            // return r1.msgid !== r2.msgid;
          // }).cloneWithRows(this.props.messages)}
          // rowRenderer={this._renderRow}
          // renderAheadOffset={2000}
          // canChangeSize={true}
        // />
	  // </View>
	  <View style={[styles.container,{marginTop:3,marginBottom:3}]}>
		<RecyclerviewList
			style={{ flex: 1}}
			ref={(ref) => (this.recycleListRef = ref)}
			dataSource={new DataSource(this.props.messages, (item, index) => item.msgid)}
			initialListSize={15}
			windowSize={20}
			renderItem={({ item, index }) => this.rendererChats(item, index)}
			ListHeaderComponent={this.props.renderFooter(this.props)}
			initialScrollIndex = {this.props.initScrolIndx} //Note: any negative number, it shows last message
			initialScrollOffset = {0}
		/>
	  </View>
	  
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    justifyContent: 'flex-end',
  },
  headerWrapper: {
    flex: 1,
  },
  listStyle: {
    flex: 1,
  },
});

MessageContainer.defaultProps = {
  messages: [],
  user: {},
  renderFooter: null,
  renderMessage: null,
  onLoadEarlier: () => {},
  inverted: true,
  loadEarlier: false,
  listViewProps: {},
  invertibleScrollViewProps: {}, // TODO: support or not?
};

MessageContainer.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.object,
  renderFooter: PropTypes.func,
  renderMessage: PropTypes.func,
  renderLoadEarlier: PropTypes.func,
  onLoadEarlier: PropTypes.func,
  listViewProps: PropTypes.object,
  inverted: PropTypes.bool,
  loadEarlier: PropTypes.bool,
  invertibleScrollViewProps: PropTypes.object, // TODO: support or not?
};
