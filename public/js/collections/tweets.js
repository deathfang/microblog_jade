define(function(require,exports,module){
    var Backbone = require('backbone');
    var Tweet = require('../models/tweet');
    var TweetList = Backbone.Collection.extend({
        model:Tweet
    })
    module.exports = new TweetList;
})