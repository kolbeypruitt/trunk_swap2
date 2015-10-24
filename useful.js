// this one works perfect*
function (accessToken, refreshToken, profile, done) {
  var person;
    usersdb.findOne({'email': profile.emails[0].value}).then(function (user) {
      if (!user) {
        usersdb.insert({ 'email': profile.emails[0].value
                          , 'displayName': profile.displayName
                          , 'firstName': profile.name.givenName
                          , 'lastName': profile.name.familyName
        })
      } else {
        usersdb.findOne({'email': profile.emails[0].value}).then(function (user) {
          person = user;
        })
      }
    })
    done(null,person)
  }
));



function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {
                usersdb.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err) { return done(err); }
                    if (user) {
                        // user was found in database, but token was set to undefined on logout. replace its token.
                        user.google.token = token;
                        usersdb.insert(user,function (err, user) {
                          if (err) { throw err; }
                          return done(null, user);
                        })
                    } else {
                        // create a newUser based on the userSchema if user doesn't exist in database.
                        var newUser          = new User();
                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                        newUser.groups.push(newUser.google.email);

                        newUser.save();
                        return done(null, newUser);
                    }
                });
            } else {
                // user already exists and is logged in, we have to link accounts
                var user          = req.user; // pull the user out of the session
                user.google.id    = profile.id;
                user.google.token = token;
                user.google.name  = profile.displayName;
                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email
                user.groups.push(user.google.email);
                usersdb.insert(user,function (err, user) {
                  if (err) { throw err; }
                  return done(null, user);
                })
                // user.save(function(err) {
                //     if (err) { throw err; }
                //     return done(null, user);
                // });
            }
        });
    }));

