define(function(require,exports,module){
    var Backbone = require('backbone');
    var Tweet = require('../models/tweet');
    var TweetList = Backbone.Model.extend({
        model:Tweet
    })
    module.exports = TweetList;
})