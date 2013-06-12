seajs.config({
  // Enable plugins
//  "plugins": ['shim'],
   "alias": {
    "jquery":'lib/jquery',
//   "jquery-plugins":{
//       "match": "lib/jquery-plugins/*.js",
//       "deps": ["jquery"],
//       "exports": "jQuery"
//   },
    'UA':'lib/yui-ua',
    "moment":"lib/moment",
    "twitterText":"lib/twitter-text"
  }
});

//concat
//seajs.config({
//    "alias": {
//        "moment":"lib/moment"
//    }
//});
