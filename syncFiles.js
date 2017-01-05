const Rsync = require('rsync');
/**
 * Sync files by rsync
 * @type {Function}
 * @param {json} config Config file
 * @return {Promise}
 */
module.exports = function syncFiles(config) {
  const rsync = new Rsync()
    .flags('rz')
    .source(config.srcPath)
    .exclude(config.exclude)
    .destination(`${config.user}@${config.host}:${config.destPath}`);
  return new Promise((resolve, reject) => {
    rsync.execute((err, code, cmd) => {
      if (err) {
        return reject(err);
      }
      return resolve([code, cmd]);
    });
  });
};
