
// require express module
var express = require('express');
var mongoose = require('./config/mongoose');


// require Movie module
var Movie = require('./models/movie');
var Actor = require('./models/actor');


// require installed modules
var bodyParser = require('body-parser');

// set port
var app = express();
var port = (process.env.PORT) || 5000)
app.set('port', port);

// set all the middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


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
        if(err) return next(err);
        res.json(new_actor);
      });
    });

app.route('/actors/:actor_id')
    .get(function(req, res, next) {
      var actor_id = req.params.actor_id;
      Actor.findOne({
        _id: actor_id
      }, function(err, actor) {
        if(err) return next(err);
        res.json(actor);
      });
    })
    .put( function (req, res, next) {
      var actor_id = req.params.actor_id;
      Actor.findByIdAndUpdate( actor_id, req.body, function(err, actor) {
        if (err) {
          return next(err);
        }
        res.json(actor);
      });
    })
    .delete(function (req, res, next) {
      var actor_id = req.params.actor_id;
      Actor.findByIdAndRemove( actor_id, req.body, function(err, actor) {
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
