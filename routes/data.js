/*
 * ALL verbs for Data.
 */

var db = require('../database')
, ID = require('mongodb').ObjectID
, _ = require('underscore')._;

exports.show = function(req, res) {

  var isPost = req.originalMethod === 'POST';

  var callback = function(err, docs) {
    if(err) throw err;
    res.set("Access-Control-Allow-Origin", "*");
    res.json(docs);
  }

  //Reference to my collectionName
  var collName = req.params.collectionName;
  var objectId = req.params.objectId;
  if(isPost) var dbObject = req.body;

  //If the collectioName was specified,
  if(collName) {
    //Generate search object.
    var searchObject = req.query || {};
    if(objectId) {
      searchObject._id = dbObject._id = ID(objectId);
    }
    if(isPost) {
      dbObject.receivedAt = new Date();
    }

    db.collection(collName, function(err, coll) {
      if(err) throw err;

      if(isPost) coll.save(dbObject, callback);
      else coll.find(searchObject).toArray(callback);
    });
  }
  else {
    db.collectionNames(callback);
  }
}
