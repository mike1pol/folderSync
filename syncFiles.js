const Rsync = require('rsync');
/**
 * Sync files by rsync
 * @type {Function}
 * @param {json} config Config file
 * @return {Promise}
 */
module.exports = function syncFiles(config) {
  const query = [];
  config.hosts.forEach((host) => {
    query.push(new Promise((resolve, reject) => {
      const rsync = new Rsync()
        .flags('rz')
        .delete()
        .source(config.srcPath)
        .exclude(config.exclude)
        .destination(`${config.user}@${host}:${config.destPath}`);
      rsync.execute((err, code, cmd) => {
        if (err) {
          return reject(err);
        }
        return resolve([code, cmd]);
      });
    }));
  });
  return Promise.all(query);
};
