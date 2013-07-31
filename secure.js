var fs = require('fs')
, https = require('https')
, _ = require('underscore')._;


//Example for data driven functionality and non-repetition.
var optionsLocations = [{name: 'cert', fsPath: './app.crt'},{name: 'key', fsPath: './privatekey.pem'}];

var options = {};
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


module.exports = function(app) {
  myApp = app;

  fs.readFile('./privatekey.pem', function(err, data) {
    addOption({key: data});
  });

  fs.readFile('./app.crt', function(err, data) {
    addOption({cert: data});
  });
};
