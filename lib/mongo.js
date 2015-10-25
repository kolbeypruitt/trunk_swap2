var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');


var TrunkLib = {
  insertTrunkOffer: function (body) {
    trunkdb.insert({ current_year: body.cur_year
                    ,current_model: body.cur_model
                    ,current_style: body.cur_style
                    ,desired_year: body.des_year
                    ,desired_model: body.des_model
                    ,desired_style: body.des_style
                  })
    .then(function (trunk) {
      return usersdb.findAndModify({query: {displayName: req.user.displayName},
                                    sort: { rating: 1 },
                                    update: { $inc: {trunk_id: trunk._id }},
                                    upsert: true
                                  })

      }).then(function (whatever) {
        console.log(whatever);
      })
}



}

module.exports = TrunkLib;



