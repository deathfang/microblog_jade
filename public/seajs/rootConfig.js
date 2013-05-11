seajs.config({
  // Enable plugins
  "plugins": ['shim'],
   "alias": {
    'jquery':{
        "src":'libs/jquery',
        "exports":"jQuery"
    },
   "jquery-plugins":{
       "match": "libs/jquery-plugins/*.js",
       "deps": ["jquery"],
       "exports": "jQuery"
   },
    'UA':'libs/yui-ua'
  }
});

