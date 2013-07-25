/**
 * POST a picture.
 */

var fs = require('fs')
, db = require('../database')
, ID = require('mongodb').ObjectID
, _ = require('underscore')
, gm = require('gm')
, Exif = require('exif').ExifImage;

var defaultFolder = '/files';

var moveFile = function(readPath, writePath, options) {
  options = options || {};
  var close = typeof options.close === 'function' ? options.close : function() {return true;};

  var writeStream = fs.createWriteStream(writePath);//.addEventListener("close", close);

  fs.createReadStream(readPath).pipe(writeStream);
};

var receive = function(req, res) {
  //Place to store data temporarily.
  var dbObject = _.extend({}, req.body);

  var receivedTime = dbObject.receivedTime = new Date();

  for (fileName in req.files) {
    var file = req.files[fileName];

    debugger;

    var originalFileName = dbObject.originalFileName = file.name;
    var fileFolder = dbObject.fileFolder = defaultFolder;


    var newFilePath = dbObject.filePath = '.' + fileFolder + '/' + originalFileName;

    moveFile(file.path, newFilePath, {
      close: function(event) {
        debugger;
        console.log("Moved the file!");
      }
    });

    debugger;

    new Exif({image: file.path}, function(err, exifData) {

      dbObject.exif = exifData;

      //TODO: Refactor to use a data api.
      //Insert the data into the file collection.
      db.collection('files', function(err, fileCollection) {
        if(err) throw err;
        fileCollection.update({'filePath': newFilePath}, {$set: dbObject}, {upsert: true}, function(err, returnDocument) {
          if(err) throw err;

          exports.list(req, res);
        });
      });
    });
  }
}

exports.receive = receive;

exports.list = function(req, res) {

  db.collection('files', function(err, fileCollection) {
    if(req.params.requestedId) {
      //debugger;
      fileCollection.findOne({
        _id: new ID(req.params.requestedId)
      }, function(err, returnDocument) {
        //debugger;
        if(err) console.log(err);

        res.download('.' + returnDocument.fileFolder + '/' + returnDocument.originalFileName);
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
