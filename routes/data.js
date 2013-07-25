/*
 * GET Data.
 */

var show = require('../database').getMyData
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

    show(collName, searchObject, function(data) {
      res.json(data);
    })
  }
}
