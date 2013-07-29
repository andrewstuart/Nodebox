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

/*
var parseFileRequest = function(req) {
  //Get references to some variables.
  var dbObject = _.extend({}, req.body);
  dbObject.fileArray = []
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

      //If you have every file taken care of, post the collection and send a response.
      if(fileArray.length === req.files.length) {
        db.collection('files', function(err, coll) {
          coll.insert(dbObject, function(err, responseObject) {
            res.redirect('/files');
          });
        });
      }
    });

    mkdirp(eachFile.folder, function(err) {
      moveFile(eachFile.path, f.path);
    });
  }
}
*/

var moveFile = function(readPath, writePath) {
  fs.createReadStream(readPath).pipe(fs.createWriteStream(writePath));
};

var receivePost = function(req, res) {
  //Store the body to be written to the form data.
  var formData = _.extend({}, req.body);
  formData.fileArray = [];
  var dbFileArray = [];

  var receivedTime = formData.receivedTime = new Date();
  var jobNum = formData.jobPhaseNumber || 'None';
  var areaNum = formData.areaNum = intTest.test(jobNum) ? jobNum.substring(0,2) : 'None';
  var submittedAt = new Date(formData.submittedAt || '');

  //Files will be stored in a location based on their submittedAt time.
  var datepartString = submittedAt.getFullYear() + pad(submittedAt.getMonth(), 2);
  var folder = defaultFolder + '/' + areaNum + '/' + jobNum + '/' + datepartString;

  for(fileName in req.files) {
    var eachFile = req.files[fileName];
    //debugger;

    //Get a bunch of info about the file.
    var f = {
      suffix: eachFile.name.split('.').pop(),
      _id: eachFile._id ? ID(eachFile._id) : ID()
    };
    f.name = submittedAt.toJSON().replace(/:|\./g, '-') + jobNum + '.' + f.suffix;
    f.path = folder + '/' + f.name;

    formData.fileArray.push({
      _id: f._id,
      path: f.path
    });

    //Also get the Exif.
    new Exif({image: req.files[fileName].path}, function(err, exifData) {
      f.exif = exifData;
      
      dbFileArray.push(f);

      //If you have every file taken care of, post the collection and send a response.
      if(dbFileArray.length === Object.keys(req.files).length) {
        debugger;
        
        //Insert files
        db.collection('files', function(err, coll) {
          coll.insert(dbFileArray, function(err, responseObject) {
          });
        });
        //At the same time insert formSubmission. Nonblocking is cool!
        db.collection('formSubmission', function(err, coll) {
          coll.insert(formData, function(err, responseObject) {
            res.json(responseObject);
            //res.redirect('/files');
          });
        });
      }
    });
    
    //Make a directory if it's not found and move the file there.
    mkdirp(folder, function(err) {
      moveFile(eachFile.path, f.path);
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
