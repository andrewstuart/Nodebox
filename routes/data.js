/*
 * GET Data.
 */

var db = require('../database')
, ID = require('mongodb').ObjectID;

exports.show = function(req, res) {

  //Reference to my collectionName
  var collName = req.params.collectionName;
  var objectId = req.params.objectId;

  //If the collectioName was specified,
  if(collName) {

    //Generate search object.
    var searchObject = {};
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
