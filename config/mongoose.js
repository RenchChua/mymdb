// if it's not on localhost, then it should be <username>:<password>@host:port/<name of db>
var mongoose = require('mongoose');
var mongo_url = process.env.MONGODB_URI || 'mongodb://localhost/mymdb_db';
mongoose.connect(mongo_url);

module.exports = mongoose;
