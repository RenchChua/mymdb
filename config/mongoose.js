// if it's not on localhost, then it should be <username>:<password>@host:port/<name of db>
var mongo_url = process.env.MONGODB_URI || 'mongodb://localhost/mymdb_db';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongo_url);

module.exports = mongoose;
