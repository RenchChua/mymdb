

var mongoose = require('mongoose');

// setting how the json structure will be like

var movieSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  publishedYear: Number,
  director: String,
  actor: String,
  pusblished: {
    type: String,
    default: 'MGM'
  },
  website: {
    type: String,
    trim: true,
    get: function(url) {
      if(! url) return url;
      if( url.indexOf('http://') !== 0 &&
          url.indexOf('https://') !== 0
        ){
          url = 'http://'+ url;
        }
        return url;
    }
  }
}, {timestamps: {}});
// register the getter

movieSchema.set('toJSON', {getters: true});

// register the schema

var Movie = mongoose.model('Movie', movieSchema);

// make this available to our other files

module.exports = Movie;
