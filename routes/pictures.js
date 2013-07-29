/**
 * POST a picture.
 */
var fs = require('fs')
, db = require('../database')
, ID = require('mongodb').ObjectID
, _ = require('underscore')
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

var parseFileRequest = function(req) {
  //Get references to some variables.
  var dbObject = _.extend({}, req.body);
  var receivedTime = dbObject.receivedTime = new Date();

  var jobNum = dbObject.jobPhaseNumber || 'None';
  var areaNum = dbObject.areaNum = intTest.test(jobNum) ? jobNum.substring(0,2) : 'None';

  var submittedAt = new Date(dbObject.submittedAt || '');

  //Get date folder from the submittedTime
  var datepartString = submittedAt.getFullYear() + pad(submittedAt.getMonth(), 2);

  debugger;

  var fileArray = [];

  for(eachFile in req.files) {
    var fileName = eachFile.name;
    var f = {file: req.files[fileName]};
    f.folder = dbObject.fileFolder = defaultFolder + '/' + areaNum + '/' + jobNum + '/' + datepartString;
    f.suffix = f.file.name.split('.').pop();
    f.name = submittedAt.toJSON().replace(/:|\./g, '-') + jobNum + '.' + f.suffix;
    f.path = dbObject.filePath = f.folder + '/' + f.name;
    new Exif({image: eachFile.path}, function(err, exifData) {
      f.exif = exifData;
      fileArray.push(f);
      if(fileArray.length === req.files.length) {
        return {
          dbObject: dbObject,
        f: fileArray
        }
      }
    });
  }

}

var moveFile = function(readPath, writePath) {
  fs.createReadStream(readPath).pipe(fs.createWriteStream(writePath));
};

var receivePost = function(req, res) {
  //Place to store data temporarily.
  var reqDetails = parseFileRequest(req);
  var dbObject = reqDetails.dbObject;
  for (eachFile in reqDetails.f) {

    mkdirp(eachFile.folder, function(err) {
      moveFile(eachFile.path, f.path);
    });

    new Exif({image: eachFile.path}, function(err, exifData) {

      dbObject.exif = exifData;


      //TODO: Refactor to use a data api.
      //Insert the data into the file collection.
    });
  }
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

        res.download(returnDocument.filePath);
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
