var mongodb = require('mongodb')
, server = new mongodb.Server('localhost', 27017 )
, Db = new mongodb.Db('filesite', server, {w: -1});

Db.open(function(err) {
    if (err) throw err;

    console.log("Connected to database!");
});

module.exports = Db;

/*
exports.run = function(app) {
    db.open(function(err, db) {
        if (err) throw err;

        console.log("Connected to database!");

        db.collection("foo", function(err, coll) {
            debugger;
            coll.find().toArray(function(err, docs) {

                console.log(docs);
            });

            coll.find({}, function(err, results) {

                results.toArray(function(err, data) {

                    console.log(data)

                })
            })
        })

        app.files = new mongodb.Collection(db, 'files');

        app.listen(app.get('port'), function(){
            console.log('Express server listening on port ' + app.get('port'));
        });
    });
}
*/
