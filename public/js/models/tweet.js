define(function(require,exports,module){
    var Backbone = require('backbone');
    var Tweet = Backbone.Model.extend({
        defaults:{
            text:'',
            html:'',
            updated:false
        }
    })
    module.exports = Tweet;
})