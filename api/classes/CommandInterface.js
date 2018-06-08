// used for executing commands locally
const shell = require('shelljs');

// used for executing commands remotely
const NodeSsh = require('node-ssh');

const ssh = new NodeSsh();

class CommandInterface {
  constructor(type, info) {
    this.type = type || null;
    this.info = info || null;
  }

  updateInfo(updatedInfo) {
    this.info = updatedInfo;
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.type === 'remote') {
        const connectionObject = {
          host: this.info.host,
          username: this.info.username,
        };

        if (this.info.privateKey) {
          connectionObject.privateKey = this.info.privateKey;
        }

        ssh.connect(connectionObject).then(resolve);
      } else {
        resolve();
      }
    });
  }

  execCommand(cmd) {
    return new Promise((resolve, reject) => {
      if (this.type === 'remote') {
        ssh.execCommand(cmd).then(resolve, reject);
      } else if (this.type === 'local') {
        shell.exec(cmd, {silent: true}, (x, stdout, stderr) =>
          resolve({stdout, stderr}),
        );
      }
    });
  }

  sendFile(fileName) {
    return new Promise((resolve, reject) => {
      if (this.type === 'remote') {
        shell.exec(
          `scp -i ${this.info.privateKey} ${this.info.username}@${
            this.info.host
          }:~/${fileName} ~`,
          (x, out, err) => {
            // console.log(out);
            resolve(fileName);
          },
        );
      } else if (this.type === 'local') {
        const command = `scp -i ${this.info.privateKey} ~/${fileName} ${
          this.info.username
        }@${this.info.host}:~`;

        console.log(command);

        shell.exec(command, (x, out, err) => {
          // console.log(out);
          resolve(fileName);
        });
      }
    });
  }
}

module.exports = CommandInterface;
