module.exports = function (app) {
  app.use('/about', require('./about'));
  app.use('/overview', require('./overview'));
  app.use('/login', require('./login'));
  app.use('/logout', require('./logout'));
  app.use('/', require('./root'));
};