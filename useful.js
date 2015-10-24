,function(accessToken, refreshToken, profile, done) {
      usersdb.findOne({ 'email': profile.emails[0].value }, function (err, user) {
        if (!user) {
          // make a new google profile without key start with $
          var new_profile = {}
          new_profile.id = profile.id
          new_profile.displayName = profile.displayName
          new_profile.emails = profile.emails
          new_profile.firstName = profile.name.givenName
          new_profile.lastName = profile.name.familyName
          user = new User({
              name: profile.displayName
            , firstName:  profile.name.givenName
            , lastName: profile.name.familyName
            , email: profile.emails[0].value
            , username: 'google'
            , provider: profile.username
          })
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        } else {
          return done(err, user)
        }
      })
    }
  ));



