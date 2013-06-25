define(function(require,exports,module){
    var Backbone = require('backbone');
    require('lib/backbone.localStorage');
    var Post = Backbone.Model.extend({
        defaults:{
            updated:localStorage.getItem('boxUpdated') || false,
            PLACEHOLDER:'<div>撰写新推文...</div>'
        },
        localStorage:new Backbone.LocalStorage('postText')
    })
    module.exports = Post;
})