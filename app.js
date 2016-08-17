
// require express module
var express = require('express');
var mongoose = require('./config/mongoose');

// declaring constants, don't change
var jwt_secret = 'somesuperlongwordthatnoonewillknownwhateverwheneverwherever';


// require Movie module
var Movie = require('./models/movie');
var Actor = require('./models/actor');
var User = require('./models/user');


// require installed modules
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');

// set port
var app = express();
var port = (process.env.PORT) || 5000;
app.set('port', port);

// set all the middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// express-jwt
app.use( expressJWT({
  secret: jwt_secret})
  .unless({
    path: ['/signup', '/login']
  }
  )
);



// signup routes

app.post('/signup', function (req,res) {
  // set var for the posted requests
  var user_object = req.body;

  // set new user object
  var new_user = new User(user_object);

  // save the new user object
  new_user.save(function (err, user) {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).send({
    message: 'User created'});
  });

});


app.post('/login', function (req, res) {
  var array = [];

  var entered_object = req.body;
  var entered_email = entered_object.email;
  var entered_password = entered_object.password;
  var user_object = User.findOne(entered_object).exec(function (err, user) {
    if (err) {
      // this is if there's some error in establishing connection
      return res.status(400).send("can't log in");
    }
    if(user) {

      var payload = user ;
      var expiryObj = {
        expiryInMinutes: 300
      };
      var jwt_token = jwt.sign(payload, jwt_secret,expiryObj);
      return res.status(200).send(jwt_token);
    }else{
      // this is login failed flow
      return res.status(400).send("can't log in ");
    }
  });


});



// let's set the routes for movie

app.route('/movies')
    .get(function (req,res, next) {
      Movie.find({})
      .sort({publishedYear: 1})
      .exec(function(err, movies) {
        if (err) return next(err);
        res.json(movies);
      });
    })
    .post(function(req,res, next) {
      var new_movie = new Movie(req.body);
      new_movie.save(function (err) {
        if(err) return next(err);
        res.json(new_movie);
      });
    });

    app.route('/movies/sort')
        . get(function (req, res, next) {
           Movie.aggregate(
            {$group: {_id: "$publishedYear", total: {$sum: 1}} },
            function (err, movie_arg) {
              if (err) {
                next(err);
              }
              res.json(movie_arg);
            }
          );


        });

    app.route('/movies/:movie_id')
        .get(function(req, res, next) {
          var movie_id= req.params.movie_id;
          console.log(movie_id);
          Movie.findOne({
            _id: movie_id
          }, function(err, movie) {
            if(err) return next(err);
            res.json(movie);
          });
        })
        .put( function (req, res, next) {
          var movie_id = req.params.movie_id;
          Movie.findByIdAndUpdate( movie_id, req.body, function(err, movie) {
            if (err) {
              return next(err);
            }
            res.json(movie);
          });
        })
        .delete( function (req, res, next) {
          var movie_id = req.params.movie_id;
          Movie.findByIdAndRemove( movie_id, req.body, function(err, movie) {
            if (err) {
              return next(err);
            }
            res.json(movie);
          });
        });

// set routes for actors
app.route('/actors')
    .get(function (req,res, next) {
      Actor.find({}, function(err, actors) {
        if (err) return next(err);
        res.json(actors);
      });
    })
    .post(function(req,res, next) {
      var new_actor = new Actor(req.body);
      new_actor.save(function (err) {
        if(err) {
          var err_array = Object.keys(err.errors);
          var err_mes_array ={};
          err_array.forEach(function (data) {
            err_mes_array[data] = err.errors[data].message;
          });
          return res.status(400).send(err_mes_array);
        }
         res.json(new_actor);
      });
    });

// app.route('/actors/:actor_id')
//     .get(function(req, res, next) {
//       var actor_id = req.params.actor_id;
//       Actor.findOne({
//         _id: actor_id
//       }, function(err, actor) {
//         if(err) return next(err);
//         res.json(actor);
//       });
//     })
//     .put( function (req, res, next) {
//       var actor_id = req.params.actor_id;
//       Actor.findByIdAndUpdate( actor_id, req.body, function(err, actor) {
//         if (err) {
//           return next(err);
//         }
//         res.json(actor);
//       });
//     })
//     .delete(function (req, res, next) {
//       var actor_id = req.params.actor_id;
//       Actor.findByIdAndRemove( actor_id, req.body, function(err, actor) {
//         if (err) {
//           return next(err);
//         }
//         res.json(actor);
//       });
//     });

app.route('/actors/:name')
  .get(function (req, res, next) {
    var actor_name = req.params.name;
    Actor.find().byName(actor_name).exec( function (err, actor) {
      if (err) {
        return next(err);
      }
      res.json(actor);
    });
  });

app.listen(port, function() {
  console.log('MyMDB server is running on localhost', app.get('port'));
});


module.exports = app;
