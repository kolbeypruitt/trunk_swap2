var db = require('monk')(process.env.MONGOLAB_URI || 'localhost/trunk_swap');
var trunkdb = db.get('trunks');
var usersdb = db.get('users');

var TrunkLib = {
  // insertTrunkOffer: function (body) {
  //   trunkdb.insert({ current_year: body.cur_year
  //                   ,current_model: body.cur_model
  //                   ,current_style: body.cur_style
  //                   ,desired_year: body.des_year
  //                   ,desired_model: body.des_model
  //                   ,desired_style: body.des_style
  //                 })
  // .then(function (trunk) {
  //   usersdb.findAndModify({query: {displayName: req.user.displayName},
  //                                 sort: { rating: 1 },
  //                                 update: { $inc: {trunk_id: trunk._id }},
  //                                 upsert: true
  //                               })

  //   })
  insertTrunkOffer: function (body, user) {
    trunkdb.insert({ current_year: body.cur_year
                    ,current_model: body.cur_model
                    ,current_style: body.cur_style
                    ,desired_year: body.des_year
                    ,desired_model: body.des_model
                    ,desired_style: body.des_style
                  })
    .then(function (trunkPosted) {
      usersdb.update({_id: user._id }, { $set: {trunk_id: trunkPosted._id}})
    })
}




}



/*

{
  _id: 1,
  item: "TBD",
  stock: 0,
  info: { publisher: "1111", pages: 430 },
  tags: [ "technology", "computer" ],
  ratings: [ { by: "ijk", rating: 4 }, { by: "lmn", rating: 5 } ],
  reorder: false
}
The following operation uses:

the $inc operator to increment the stock field; and
the $set operator to replace the value of the item field, the publisher field in the info embedded document, the tags field, and the second element in the ratings array.
db.books.update(
   { _id: 1 },
   {
     $inc: { stock: 5 },
     $set: {
       item: "ABC123",
       "info.publisher": "2222",
       tags: [ "software" ],
       "ratings.1": { by: "xyz", rating: 3 }
     }
   }
)
The updated document is the following:

{
  "_id" : 1,
  "item" : "ABC123",
  "stock" : 5,
  "info" : { "publisher" : "2222", "pages" : 430 },
  "tags" : [ "software" ],
  "ratings" : [ { "by" : "ijk", "rating" : 4 }, { "by" : "xyz", "rating" : 3 } ],
  "reorder" : false
}


*/

module.exports = TrunkLib;



