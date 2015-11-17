var sign = require('./sign');
var log = require('./log');
var chalk = require('chalk');

sign.login(() => {
  log.info('Logged as %s.', chalk.green(sign.env.username));
});
