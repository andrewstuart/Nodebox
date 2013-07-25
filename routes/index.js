
/*
 * GET home page.
 */

var db = require('../database')

exports.index = function(req, res){
  db.collection('formfields', function(err, coll) {
    coll.find().toArray(function(err, returnArray) {
      res.render('index', {
        title: 'Express',
      formFields: returnArray
      });
    });
  })
}
