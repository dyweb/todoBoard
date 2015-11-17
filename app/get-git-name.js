var fs = require('fs');

module.exports = function () {
  try {
    // The 1st line of HEAD's log must be clone. The cloner must be the current Git user.
    return fs.readFileSync('./.git/logs/HEAD', 'utf8').match(/^(?:[0-9a-f]+ ){2}(.+?) /)[1];
  } catch (e) {
    // Use current system user instead.
    return process.env.LOGNAME;
  }
};
