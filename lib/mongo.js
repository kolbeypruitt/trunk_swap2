var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');
var usersdb = db.get('users');

var dbLib = {
  insertTrunkOffer: function (trunkOffer, user) {
    trunkdb.insert({ 
      current_year: trunkOffer.cur_year
      , current_model: trunkOffer.cur_model 
      , current_style: trunkOffer.cur_style
      , desired_year: trunkOffer.des_year   
      , desired_model: trunkOffer.des_model
      , desired_style: trunkOffer.des_style 
      , user_id: user._id
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
    return usersdb.update({_id: reqUser._id },
      { $set: { firstName: reqBody.firstName
              , lastName: reqBody.lastName
              , email: reqBody.email
              , phone: reqBody.phone
              , displayName: reqBody.firstName + ' ' + reqBody.lastName
            }});
  },

  searchShowOffer: function (paramId) {
    return trunkdb.findOne(paramId).then(function (trunk) {
      return usersdb.findOne({_id: trunk.user_id}).then(function (user) {
        return [user, trunk]
      })
    })
  },

  trunkQueryMaker: function (userOffer) {
    var obj = {};
    obj[desired_year] = userOffer.desired_year;
    obj[desired_model] = userOffer.desired_model;
    obj[desired_style] = userOffer.desired_style;
    return trunkdb.find(obj);
  },

  findMyMatches: function (userId) {
    return usersdb.findOne({_id: userId}).then(function (user) {
      return trunkdb.findOne({_id: user.trunk_id});
    })
    .then(function (myOffer) {
      var array = [];
      array.push({ 'current_year': myOffer.desired_year });
      array.push({ 'current_model': myOffer.desired_model });
      array.push({ 'current_style': myOffer.desired_style });
      return trunkdb.find( { $and: [ array[0], array[1], array[2] ] });
    })
  },

  // consider indexing the users first, then passing the indexed users
  /*
    {
      45: {id: 45, name: "jeff"},
      67: {id: 67, name: "blah blah"},
    }

    trunk.user = users[trunk.user_id] // this will be extremely fast
  */

  findUserOfTrunk: function (trunk, allUsers) {
    console.log(trunk);
    console.log(allUsers);
    var output = {};
    for (var i = 0; i < allUsers.length; i++) {
      if (allUsers[i]._id == trunk.user_id) {
        output = allUsers[i];
      }
    }
    return output;
  },

  findTrunkOfUser: function (user, allTrunks) {
    var output = {};
    for (var i = 0; i < allTrunks.length; i++) {
      if (allTrunks[i]._id == user.trunk_id) {
        output = allTrunks[i];
      }
    }
    return output;
  },

  modelDisplayObjTrunksAndUsers: function () {
    return trunkdb.find({})
    .then(function (allTrunks) {
      var records = {};
      records.allTrunks = allTrunks;
      return usersdb.find({}).then(function (allUsers) {
        records.allUsers = allUsers;
        return records;
      })
    })
    .then(function (records) {
      var allTrunks = records.allTrunks;
      var allUsers = records.allUsers;
      var viewObj = {};
      for (var i = 0; i < allTrunks.length; i++) {
        var trunk = allTrunks[i];
        var user = dbLib.findUserOfTrunk(trunk, allUsers)
        viewObj['trunk' + '_' + i] = { _id: trunk._id
                                      ,current_year: trunk.current_year
                                      ,current_model: trunk.current_model
                                      ,current_style: trunk.current_style
                                      ,firstName: user.firstName
                                      ,lastName: user.lastName
                                      ,email: user.email
                                      ,phone: user.phone
                                      ,location: 'locations pending'
                                    };
      };
      return viewObj
    });
  },

  modelDisplayObjUsersThenTrunks: function () {
    var records = {};
    return trunkdb.find({}).then(function (allTrunks) {
      return allTrunks;
    })
    .then(function (allTrunks) {
      records.allTrunks = allTrunks;
      return usersdb.find({}).then(function (allUsers) {
        records.allUsers = allUsers;
        return records;
      })
      .then(function (records) {
        var allTrunks = records.allTrunks;
        var allUsers = records.allUsers;
        var viewObj = {};
        for (var i = 0; i < allUsers.length; i++) {
          var user = allUsers[i];
          var trunk = dbLib.findTrunkOfUser(user, allTrunks)
          viewObj['user' + '_' + i] = { _id: trunk._id
                                        ,current_year: trunk.current_year
                                        ,current_model: trunk.current_model
                                        ,current_style: trunk.current_style
                                        ,firstName: user.firstName
                                        ,lastName: user.lastName
                                        ,email: user.email
                                        ,phone: user.phone
                                        ,location: 'locations pending'
                                      };
        };
        // console.log(viewObj);
        return viewObj
      });
    });
  }


}


module.exports = dbLib;



