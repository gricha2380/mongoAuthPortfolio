module.exports = function (app) {
  app.use('/about', require('./about'));
  app.use('/overview', require('./overview'));
  app.use('/portfolio', require('./portfolio'));
  app.use('/stats', require('./stats'));
  app.use('/historical', require('./historical'));
  app.use('/login', require('./login'));
  app.use('/register', require('./register'));
  app.use('/settings', require('./settings'));
  app.use('/logout', require('./logout'));
  app.use('/email/send', require('./trigger/email'));
  app.use('/text/send', require('./trigger/SMS'));
  app.use('/cron/historical', require('./cron/snapshot'));
  app.use('/cron/SMS', require('./cron/SMS'));
  app.use('/cron/email', require('./cron/email'));
  app.use('/', require('./root'));
};