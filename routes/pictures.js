
/*
 * POST a picture.
 */

//var fs = require('fs');

exports.pictures = function(req, res){

    res.sendfile(req.files.file.path);
    /*res.render('picture', { title: 'YOU POSTED A PICTURE!'}, function(err, html) {
        if(!err) res.sendfile(req.files.file.path);
    });*/
};
