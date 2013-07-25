var mongodb = require('mongodb')
, server = new mongodb.Server('localhost', 27017 )
, Db = new mongodb.Db('filesite', server, {w: -1});

Db.open(function(err) {
    if (err) throw err;

    console.log("Connected to database!");
});

module.exports.Db = Db;

module.exports.find = function(collectionName, searchObject, callback) {
  if(!collectionName) throw "Please at least pass a collection name."
  searchObject = searchObject || {};
  callback = typeof callback == 'function' ? callback : function() { return true };

  Db.collection(collectionName, function(err, coll) {
    coll.find(searchObject).toArray(function(err, returnArray) {
      debugger;
      callback(returnArray);
    })
  })
}

