var User = require('../models').User;

exports.getUserByName = function (name, callback) {
    User.findOne({name: name}, callback);
};

exports.getUsersByQuery = function (query, opt, callback) {
    User.find(query, null, opt, callback);
};

exports.newAndSave = function(name,passwd,callback){
    var user = new User();
    user.name = name;
    user.passwd = passwd;
    user.save(callback);
}
