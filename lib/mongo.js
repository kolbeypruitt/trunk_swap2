var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');
var usersdb = db.get('users');

var TrunkLib = {
  insertTrunkOffer: function (trunkOffer, user) {
    trunkdb.insert({ current_year: trunkOffer.cur_year
                    ,current_model: trunkOffer.cur_model
                    ,current_style: trunkOffer.cur_style
                    ,desired_year: trunkOffer.des_year
                    ,desired_model: trunkOffer.des_model
                    ,desired_style: trunkOffer.des_style
                  })
    .then(function (trunkPosted) {
      return usersdb.update({_id: user._id }, { $set: {trunk_id: trunkPosted._id}})
    })
  },

  searchForTrunk: function (trunkParams, user) {
    return trunkdb.find({ current_year: trunkParams.findYear
                  ,current_model: trunkParams.findModel
                  ,current_style: trunkParams.findStyle
                })
  }




}

module.exports = TrunkLib;



