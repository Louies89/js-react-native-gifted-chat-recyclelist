import dayjs from 'dayjs';

export function isSameDay(currentMessage = {}, diffMessage = {}) {
  if (!diffMessage.createdAt) {
    return false;
  }

  const currentCreatedAt = dayjs(currentMessage.createdAt);
  const diffCreatedAt = dayjs(diffMessage.createdAt);

  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
    return false;
  }

  return (isSameDate(currentCreatedAt, diffCreatedAt));
}

export function isSameUser(currentMessage = {}, diffMessage = {}) {
  return !!(diffMessage.user && currentMessage.user && diffMessage.user._id === currentMessage.user._id);
	
	//if(diffMessage.sid && currentMessage.sid){
	//	// If both messages have sid & but match the sid of both messages
	//	return (diffMessage.sid === currentMessage.sid);
	//}
	//else if(!diffMessage.sid && !currentMessage.sid){
	//	//In a sid is not there at all in both messages, then its normal chat, so match the _id
	//	return (diffMessage.user._id === currentMessage.user._id)
	//}
	//else if(!diffMessage.sid || !currentMessage.sid){ 
	//	//In a Group chat each message shall have sid, so if 1 of the message missing, return false
	//	return false;
	//}
	//if(diffMessage.user && currentMessage.user){
	//	
	//}
	//else{
	//	//If user info missing in any of the 
	//	return false;
	//}
}


export function isSameDate(date1, date2) {
  date1 = dayjs(date1);
  date2 = dayjs(date2);
  return (date1.year() == date2.year() &&
    date1.month() == date2.month() &&
    date1.date() == date2.date());
}