const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
let MongoStore = require('connect-mongo')(session);
const engines = require('consolidate'); // allows popular templating libaries to work with Express
const app = express();

// mongodb connection
mongoose.connect('mongodb://localhost:27017/bookworm')
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// use session for tracking logins
app.use(session({
  secret: 'fear is the mindkiller',
  resave: true,
  saveUninitialized: false
}));

// make user ID available in templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId; // all views have access to locals
  next();
});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
// app.set('view engine', 'pug');
// app.set('views', __dirname + '/views');

/********************* TEMPLATING *********************/
app.engine('hbs', engines.handlebars); // use consolidate to attach handlebars templating
app.set('views', './views'); // set views folder to our directory
app.set('view engine', 'hbs'); // use our engine


// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
