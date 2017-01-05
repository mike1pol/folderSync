module.exports = {
  user: 'remoteUser', // remote user name
  hosts: ['remoteHost'], // remote hosts
  sshKeyPath: 'key path', // ssh key path
  srcPath: 'Source path', // source path
  destPath: 'Destination path', // remote path
  exclude: [ // exclude files or paths
    'node_modules'
  ],
  commands: [ // shell commands
    'ls -al'
  ]
};
