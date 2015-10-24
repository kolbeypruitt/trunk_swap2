var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var userdb = db.get('users');

var Users = {
  insertGoogleUser: function(userData) {
    userdb.insert({email: userData.id, firstName: 'userData.name.givenName', lastName: 'userData.name.familyName'});
  },

  isUserInDb: function (userData) {
    var dbMatch = userdb.findOne({email: userData._id});
    if (dbMatch) return true;
    else return false;
  },

  findUser: function (userData) {
    return userdb.findOne({email: userData._id})
  }
}

module.exports = Users;