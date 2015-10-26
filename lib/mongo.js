var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');
var usersdb = db.get('users');

var TrunkLib = {
  insertTrunkOffer: function (body, user) {
    trunkdb.insert({ current_year: body.cur_year
                    ,current_model: body.cur_model
                    ,current_style: body.cur_style
                    ,desired_year: body.des_year
                    ,desired_model: body.des_model
                    ,desired_style: body.des_style
                  })
    .then(function (trunkPosted) {
      return usersdb.update({_id: user._id }, { $set: {trunk_id: trunkPosted._id}})
    })
}




}

module.exports = TrunkLib;



