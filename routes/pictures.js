/**
 * POST a picture.
 */
var fs = require('fs')
, db = require('../database')
, ID = require('mongodb').ObjectID
, _ = require('underscore')._
, gm = require('gm')
, Exif = require('exif').ExifImage
, mkdirp = require('mkdirp');

var defaultFolder = './files';

var pad = function(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var intTest = /^\d+$/g;

var parseFileRequest = function(req, callback) {
  var receivedTime = new Date();
  var jobNum = req.body.jobPhaseNumber || 'None';
  var areaNum = intTest.test(jobNum) ? jobNum.substring(0,2) : 'None';
  var submittedAt = new Date(req.body.submittedAt || '');
  var datepartString = submittedAt.getFullYear() + pad(submittedAt.getMonth(), 2);
  var fileFolder = defaultFolder + '/' + areaNum + '/' + jobNum + '/' + datepartString;
  var fileArray = [];

  debugger;
  mkdirp(fileFolder, function(err) {

    for (fileKey in req.files) {
      var eachFile = req.files[fileKey];
      var suffix = eachFile.name.split('.').pop();
      var myId = ID();
      var name = submittedAt.toJSON().replace(/:|\./g, '-') + myId + '.' + suffix;

      //Add data we care about.

      var fileObject = {
        _id: myId,
        jobNum: jobNum,
        path: fileFolder + '/' + name,
        submittedAt: submittedAt,
        receivedTime: receivedTime
      };

      //Nonblocking and will continue after the function ends.
      fileArray.push(fileObject);
      debugger;
      moveFile(eachFile.path, fileObject.path);

      debugger;

      if(fileArray.length == Object.keys(req.files).length) callback(fileArray);
    }
  });


}

var moveFile = function(readPath, writePath) {
  fs.createReadStream(readPath).pipe(fs.createWriteStream(writePath));
};

var receivePost = function(req, res) {

  parseFileRequest(req, function(reqFiles) {

    debugger;

    //Insert the data into the file collection.
    db.collection('files', function(err, fileCollection) {
      if(err) throw err;
      fileCollection.insert(reqFiles, function(err, returnDocument) {
        if(err) throw err;
        res.json(returnDocument);
      });
    });
  });
}

exports.receive = receivePost;

exports.list = function(req, res) {

  db.collection('files', function(err, fileCollection) {
    if(req.params.requestedId) {
      //debugger;
      fileCollection.findOne({
        _id: new ID(req.params.requestedId)
      }, function(err, returnDocument) {
        //debugger;
        if(err) console.log(err);

        res.download(returnDocument.path);
      });
    } else {
      fileCollection.find().toArray(function(err, data) {
        res.render('piclist', {
          fileList: data,
          title: "Here's the list 3.0"
        });
      });
    }
  });
}
