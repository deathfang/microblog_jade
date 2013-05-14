seajs.config({
  // Enable plugins
//  "plugins": ['shim'],
   "alias": {
    "jquery":'libs/jquery',
//   "jquery-plugins":{
//       "match": "libs/jquery-plugins/*.js",
//       "deps": ["jquery"],
//       "exports": "jQuery"
//   },
    'UA':'libs/yui-ua',
    "moment":"libs/moment",
    "twitterText":"libs/twitter-text"
  }
});

//concat
//seajs.config({
//    "alias": {
//        "moment":"libs/moment"
//    }
//});
