var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var userdb = db.get('users');

var Users = {
  insertGoogleUser: function(userData) {
    userdb.insert({email: userData.emails[0].value, firstName: userData.name.givenName, lastName: userData.name.familyName});
  },

  isUserInDb: function (userData) {
    var dbMatch = userdb.findOne({email: userData.emails[0].value});
    if (dbMatch) return true;
    else return false;
  },

  findUser: function (userData) {
    return userdb.findOne({email: userData.emails[0].value})
  }
}

module.exports = Users;