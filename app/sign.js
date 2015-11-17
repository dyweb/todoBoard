var read = require('./read');
var chalk = require('chalk');
var inquirer = require('inquirer');
var getGitName = require('./get-git-name');
var log = require('./log');
var fs = require('fs-extra');

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
      default: logged ? sign.env.username : getGitName(),
      validate: x => /^[0-9a-zA-Z._\-]+$/.test(x) || 'Only 0-9, a-z, A-Z and . _ - allowed.'
    }], answers => {
      if (logged && sign.env.username === answers.username) {
        cb();
        return;
      }
      // TODO: check if duplicate.
      sign.env = answers;
      fs.writeJsonSync('./.env.json', answers);
      cb();
    });
  }
};
