
/*
 * POST a picture.
 */

var fs = require('fs')
, db = require('../database');

debugger;

exports.pictures = function(req, res) {

    //TODO: Refactor to private module methods.

    //Read the file from the request.
    fs.readFile(req.files.file.path, function(err, data) {
        debugger;
        var fileName = req.files.file.name;
        var newPath = "./public/" + fileName;

        req.body.fileName = fileName;
        req.body.path = newPath;

        //Insert the data into the file collection.
        db.collection('files', function(err, coll) {

            coll.insert(req.body, function(err, data) {
                debugger;
            });
        });

        fs.writeFile(newPath, data, function(error) {


            res.redirect('/pics');

            //If you want the separate thing, comment out above.
            res.render('picture', { 
                title: 'YOU POSTED A PICTURE!',
                file: fileName,
                fileTitle: fileName
            });
        });

    });

    //res.sendfile(req.files.picture.path);
};


exports.list = function(req, res) {
    console.log(req.query);

    db.collection('files', function(err, coll) {
        coll.find().toArray(function(err, data) {
            res.render('piclist', {
                fileList: data.fileName,
                title: "Here's the list 2.0"
            });
        });
    });

    fs.readdir('./public/', function(err, files) {
        res.render('piclist', {
            fileList: files,
            title: "Here's the list!"
        });
    });
}
