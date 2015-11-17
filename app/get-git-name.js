var fs = require('fs');

module.exports = function () {
  try {
    return fs.readFileSync('./.git/logs/HEAD', 'utf8').match(/^(?:[0-9a-f]+ ){2}(.+?) /)[1];
  } catch (e) {
    return process.env.LOGNAME;
  }
};
