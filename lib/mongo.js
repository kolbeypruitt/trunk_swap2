var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');
var usersdb = db.get('users');

var dbLib = {
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
    var obj = {};
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
  },

  findTrunkMatch: function (userOffer) {
    var obj = {};
    obj[desired_year] = userOffer.desired_year;
    obj[desired_model] = userOffer.desired_model;
    obj[desired_style] = userOffer.desired_style;
    return trunkdb.find(userOffer);
  },

  editUserSettings: function (reqBody, reqUser) {
    reqUser.firstName = reqBody.firstName;
    reqUser.lastName = reqBody.lastName;
    reqUser.email = reqBody.email;
    reqUser.phone = reqBody.phone;
    return usersdb.update({_id: reqUser._id }, { $set: { firstName: reqBody.firstName
                                                        , lastName: reqBody.lastName
                                                        , email: reqBody.email
                                                        , phone: reqBody.phone
                                                      }}).then(function () {
    })
  },

  searchShowOffer: function (reqParams) {
    console.log(reqParams);
    return trunkdb.findOne({_id: reqParams.id})
  }


}

module.exports = dbLib;



