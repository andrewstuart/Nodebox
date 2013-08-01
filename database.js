var mongodb = require('mongodb')
, server = new mongodb.Server('localhost', 27017 )
, Db = new mongodb.Db('filesite', server, {w: -1});

Db.open(function(err) {
  if (err) throw err;

  console.log("Connected to database!");
});

module.exports = Db;
