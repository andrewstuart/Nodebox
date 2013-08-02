/*
 * ALL verbs for Data.
 */

var db = require('../database')
, ID = require('mongodb').ObjectID
, _ = require('underscore')._;

exports.show = function(req, res) {

  debugger;

  var isPost = req.originalMethod === 'POST';
  
  debugger;

  var sendJson = function(err, docs) {
    if(err) throw err;
    res.set("Access-Control-Allow-Origin", "*");
    res.json(docs);
  }

  //Reference to my collectionName
  //TODO: Find out how to ignore static path roots.
  var collName = req.params.collectionName;
  var objectId = req.params.objectId;
  var searchObject = req.query || {};
  var dbObject = {};

  debugger;
  if(isPost) dbObject = req.body;

  //If the collectioName was specified,
  if(collName) {
    //Generate search object.
    if(objectId) {
      searchObject._id = dbObject._id = ID(objectId);
    }
    if(isPost) {
      dbObject.receivedAt = new Date();
    }

    db.collection(collName, function(err, coll) {
      if(err) res.send(error);

      if(isPost) coll.save(dbObject, sendJson);
      else coll.find(searchObject).toArray(sendJson);
    });
  }
  else {
    db.collectionNames(sendJson);
  }
}
