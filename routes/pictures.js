
/*
 * POST a picture.
 */

var fs = require('fs')
, db = require('../database')
, ID = require('mongodb').ObjectID;

exports.receive = function(req, res) {

  //TODO: Refactor to private module methods.

  //Read the file from a POST request.
  fs.readFile(req.files.file.path, function(err, data) {
    debugger;

    //Add some data and track as variables.
    var recievedTime = req.body.received = new Date();
    var originalFileName = req.body.originalFileName = req.files.file.name;
    //var publicFolder = req.body.publicFolder = '/public';
    var fileFolder = req.body.fileFolder = '/files';

    //TODO: Refactor to use a data api.
    //Insert the data into the file collection.
    db.collection('files', function(err, coll) {
      coll.insert(req.body, function(err, returnDocument) {

        //TODO: Handle multiples!
        var idString = returnDocument[0]._id.toString();

        debugger;

        //Now that we have the ObjectId, write the file to that path.
        //var filePath = '.' + fileFolder + '/' + idString;
        var filePath = '.' + fileFolder + '/' + originalFileName;

        fs.writeFile(filePath, data, function(error) {
          //Now that it's written, respond with the list.
          exports.list(req, res);

          //Uses a round trip. 
          //res.redirect('/pics');
        });
      });
    });


  });

  //res.sendfile(req.files.picture.path);
};


exports.list = function(req, res) {

  db.collection('files', function(err, coll) {
    if(req.params.requestedId) {
      debugger;
      coll.findOne({
        _id: new ID(req.params.requestedId)
      }, function(err, returnDocument) {
        debugger;
        if(err) console.log(err);

        res.download('.' + returnDocument.fileFolder + '/' + returnDocument.originalFileName);
      });
    } else {
      coll.find().toArray(function(err, data) {
        res.render('piclist', {
          fileList: data,
          title: "Here's the list 3.0"
        });
      });
    }
  });
}
