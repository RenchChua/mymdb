var mongoose = require('mongoose');

// mongoose.connect(mongo_url);

// setting how the json structure will be like

var actorSchema = new mongoose.Schema({
  first_name: {
    type: String,
    trim: true,
    required: [true, "Please enter name!"]
  },
  last_name: {
    type: String,
    trim: true
  },
  email:{
    type: String,
    unique: true,
    index: true,
    required: [true, "Please enter email!"],
    match: [/.+\@.+\..+/, "Not a valid email address"]
  },
  age: Number,
  agency: {
    type: String,
    default: 'Slave Drivers Inc.'
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
}, {timestamps:{}});


// set virtual attributes

actorSchema.virtual('fullname').get(function() {
  return this.first_name + " " + this.last_name;
});

// register the modifiers

actorSchema.set('toJSON', {getters: true, virtuals: true});

// setting up query

actorSchema.query = {
  byName: function (name) {
    return this.find({
      $or: [
        { first_name: new RegExp(name, 'i' ) },
        { last_name: new RegExp(name, 'i' ) }
      ]
    });
  }
};

// register the schema

var Actor = mongoose.model('Actor', actorSchema);

// make this available to our other files

module.exports = Actor;
