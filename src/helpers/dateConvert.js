export const dateConvert1 = date => {
  var lstDate = date.split("-");
  var MyDateString = '';
  if(lstDate.length == 3) {
     MyDateString = lstDate[2] + " / " + lstDate[1] + " / " + lstDate[0];
  }
  return MyDateString;
};

export const dateConvert2 = date => {
  var dateFormat = require('dateformat');
  var now = new Date(date);
  return dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
};
