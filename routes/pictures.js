
/*
 * POST a picture.
 */

var fs = require('fs');

exports.pictures = function(req, res){
    //console.log(req.files);

    fs.readFile(req.files.picture.path, function(err, data) {
        var fileName = req.files.picture.name;
        var newPath = "./public/" + fileName;

        fs.writeFile(newPath, data, function(error) {
            res.redirect('/pics');

            //If you want the separate thing, comment out above.
            res.render('picture', { 
                title: 'YOU POSTED A PICTURE!',
                file: fileName,
                fileTitle: fileName
            })
        });

    });

    //res.sendfile(req.files.picture.path);
};


exports.list = function(req, res) {
        console.log(req.query);

        fs.readdir('./public/', function(err, files) {
            res.render('piclist', {
                fileList: files,
                title: "Here's the list!"
            });
        });
    }
