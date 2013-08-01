var fs = require('fs')
, https = require('https')
, _ = require('underscore')._

//Example for data driven functionality and non-repetition.
var optionsLocations = [{name: 'cert', fsPath: './app.crt'},{name: 'key', fsPath: './privatekey.pem'}];

var options = {};
var validation = {};
var myApp = {};

var addOption = function(object) {
  _.extend(options, object);

  //TODO: use optionsLocations to check that everything's ready.
  if(options.key && options.cert) {
    https.createServer(options, myApp).listen(myApp.get('securePort'), function() {
      console.log("Express server securely listening on port " + myApp.get('securePort'));
    })
  }
}

validation['foo'] = 'dev';


exports.run = function(app) {

  myApp = app;

  fs.readFile('./privatekey.pem', function(err, data) {
    addOption({key: data});
  });

  fs.readFile('./app.crt', function(err, data) {
    addOption({cert: data});
  });
};

exports.guard = function(req, res, next) {
  if(!req.secure) return next();
  token = req.query.authToken;
  if(validation[token]) {
    req.env = validation[token];
    delete req.query['authToken'];

    return next();
  }
  else res.send(403);
}

var guardExperimental = function(req, res, next) {
  debugger;

  var pathArray = req.path.split('/');
  var routeArray = req.route.path.split('/');

  var token = pathArray.pop();

  debugger;

  for(pathElement in routeArray) {
    if(routeArray[pathElement].substring(0,1) !== ':') {
      debugger;
      //TODO: Don't use shift.
      pathArray.shift();
    }
  }

  debugger;

  if(validation[token]) {
    debugger;
    req.pathArray = pathArray;
    req.env = validation[token];
    debugger;
    next();
  }
  else {
    res.send(403);
  }
}
