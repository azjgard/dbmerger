const CommandInterface = require('./CommandInterface');
const local = require('../config').local;
const remote = require('../config').remote;
const Database = require('./Database');

class Application {
  constructor() {
    this.localInterface = new CommandInterface('local', remote.auth);
    this.remoteInterface = new CommandInterface('remote', remote.auth);
  }

  init() {
    return new Promise(async (resolve) => {
      await this.remoteInterface.connect();

      const remoteDb = new Database(
        this.remoteInterface,
        remote.db.dbName,
        remote.db.dbUser,
        remote.db.dbPass,
      );

      const localDb = new Database(
        this.localInterface,
        local.db.dbName,
        local.db.dbUser,
        local.db.dbPass,
      );

      await localDb.initTables();
      await remoteDb.initTables();

      // Both of these work like a charm!!

      // remoteDb.tables.wp_posts.dumpAndSend().then(fileName => {
      //   localDb.tables.tasks.overwrite(fileName).then(console.log);
      // });

      // localDb.tables.tasks.dumpAndSend().then((fileName) => {
      //   remoteDb.tables.tasks.overwrite(fileName).then(console.log);
      // });

      resolve();
    });
  }
}

module.exports = Application;
