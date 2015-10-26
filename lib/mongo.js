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
                    ,user_id: user._id
                  })
    .then(function (trunkPosted) {
      return usersdb.update({_id: user._id }, { $set: {trunk_id: trunkPosted._id}})
    })
  },

  searchForTrunk: function (reqBody) {
    // console.log(reqBody);
    var obj = {}
    if(reqBody.findYear!='null') {
        obj['current_year'] = reqBody.findYear;
    }
    if(reqBody.findModel!='null') {
        obj['current_model'] = reqBody.findModel;
    }
    if(reqBody.findStyle!='null') {
        obj['current_style'] = reqBody.findStyle;
    }
    return trunkdb.find(obj, function(err, docs){
        if (err) return err;
        // console.log(docs);
        // res.send(docs);
    })
  }




}

module.exports = TrunkLib;



