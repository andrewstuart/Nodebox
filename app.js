
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, pics = require('./routes/pictures.js')
, http = require('http')
, path = require('path')
, mongodb = require('mongodb')
, db = require('./database');
//, data = require('./routes/data');

//db.open(function() {console.log("Connected!")});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/pics', pics.list);
app.post('/pics', pics.pictures);
app.get('/foo', function(req, res) {debugger; console.log(db)});
//app.get('/data/:collectionName', data);

app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
//Run app from database functionality.
//db.run(app);
