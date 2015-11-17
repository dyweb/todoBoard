var read = require('./read');
var chalk = require('chalk');
var inquirer = require('inquirer');
var log = require('./log');
var fs = require('fs-extra');

function isDuplicate(username) {
  var userpath = './participants/' + username;
  try {
    fs.statSync(userpath);
    return true;
  } catch (e) {
    fs.mkdirSync(userpath);
    return false;
  }
}

function getDefaultUserName() {
  try {
    // The 1st line of HEAD's log must be clone. The cloner must be the current Git user.
    return fs.readFileSync('./.git/logs/HEAD', 'utf8').match(/^(?:[0-9a-f]+ ){2}(.+?) /)[1];
  } catch (e) {
    // Use current system user instead.
    return process.env.LOGNAME;
  }
}

var sign = module.exports = {
  isLogged: () => {
    return !!sign.env || !!(sign.env = read('./.env.json', true));
  },
  login: (cb) => {
    var logged = sign.isLogged();
    var message = logged ?
      'You\'re signed as ' + chalk.green(sign.env.username) + '. Press enter to skip or enter a new username:' :
      'Not signed. Press enter to use the default username or enter a new one:';
    inquirer.prompt([{
      name: 'username',
      type: 'input',
      message: message,
      default: logged ? sign.env.username : getDefaultUserName(),
      validate: x => /^[0-9a-zA-Z._\-]+$/.test(x) || 'Only 0-9, a-z, A-Z and . _ - allowed.'
    }], answers => {
      if (logged && sign.env.username === answers.username) {
        cb();
        return;
      }
      log.info(
        isDuplicate(answers.username) ? 'Login as existing user %s.' : 'Create new user %s.',
        chalk.green(answers.username)
      );
      fs.writeJsonSync('./.env.json', sign.env = answers);
      cb();
    });
  }
};
