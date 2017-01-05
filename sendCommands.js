const Client = require('ssh2').Client;
const fs = require('fs');

module.exports = function sendCommands(config) {
  const query = [];
  config.hosts.forEach((host) => {
    query.push(new Promise((resolve, reject) => {
      const connect = new Client();
      connect
        .on('ready', () => {
          connect.shell((err, stream) => {
            let error = false;
            let resultData;
            if (err) {
              reject(err);
              return;
            }
            stream
              .on('close', () => {
                connect.end();
                if (error) {
                  reject(error);
                  return;
                }
                resolve(resultData);
              })
              .on('data', (data) => {
                resultData = data.toString();
              })
              .stderr.on('data', (data) => {
                error = data;
              });
            stream.end(`${config.commands.join('\n')}\nexit\n`);
          });
        })
        .connect({
          host,
          port: 22,
          username: config.user,
          privateKey: fs.readFileSync(config.sshKeyPath)
        });
    }));
  });
  return Promise.all(query);
};
