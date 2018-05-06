module.exports = function (app) {
  app.use('/about', require('./about'));
  app.use('/overview', require('./overview'));
  app.use('/portfolio', require('./portfolio'));
  app.use('/stats', require('./stats'));
  app.use('/historical', require('./historical'));
  app.use('/login', require('./login'));
  app.use('/register', require('./register'));
  app.use('/logout', require('./logout'));
  app.use('/email/send', require('./email'));
  app.use('/text/send', require('./text'));
  app.use('/cron/historical', require('./cron'));
  app.use('/', require('./root'));
};