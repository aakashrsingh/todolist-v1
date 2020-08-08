module.exports.getDate=function (){
let today = new Date();
let day = "";
let options={
  weekday: "long",
  month:"long",
  day:"numeric",
}
day=today.toLocaleDateString("en-US", options);
return day;
}
module.exports.getDay= function (){
let today = new Date();
let day = "";
let options={
  weekday: "long",
}
day=today.toLocaleDateString("en-US", options);
return day;
}
