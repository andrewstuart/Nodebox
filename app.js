/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, files = require('./routes/pictures.js')
, http = require('http')
, path = require('path')
, mongodb = require('mongodb')
, db = require('./database')
, data = require('./routes/data')
, gatekeeper = require('./secure');

//db.open(function() {console.log("Connected!")});

var app = express();

// all environments
app.enable('trust proxy');
app.set('port', process.env.PORT || 3000);
app.set('securePort', process.env.SECUREPORT || 443);
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
  console.log("We're in dev!");
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/files/:requestedId?', files.list);
app.post('/files', files.receive);
app.all('/data/:collectionName?/:objectId?', gatekeeper.guard, data.show);

gatekeeper.run(app);

//https.createServer(secureOptions, app).listen(3001);


app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

