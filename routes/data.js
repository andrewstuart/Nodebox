/*
 * GET Data.
 */

var db = require('../database')
, ID = require('mongodb').ObjectID;

exports.show = function(req, res) {

  debugger;

  //Reference to my collectionName
  var collName = req.params.collectionName;
  var objectId = req.params.objectId;

  //If the collectioName was specified,
  if(collName) {

    //Generate search object.
    var searchObject = req.query;
    if(objectId) searchObject._id = ID(objectId);

    debugger;

    db.getMyData(collName, searchObject, function(data) {
      res.json(data);
    });
  }
  else {
    debugger;
    db.collectionNames( function(err, dataArray) {
      res.json(dataArray);
    })
  }
}

exports.post = function(req, res) {
  var collectionName = req.params.collectionName;
  var objectId = req.params.objectId;
  var dbObject = req.body;

  //Generate search object.
  var searchObject = req.query;
  searchObject._id = objectId ? ID(objectId) : ID();

  debugger;

  db.collection(collectionName, function(err, coll) {
    if(err) throw err;
    debugger;
    coll.update(searchObject, {$set: dbObject}, {upsert: true}, function(err, returnDocuments) {
      if(err) throw err;
      debugger;
      res.json(returnDocuments);
    })
  });
  debugger;
}
