const CommandInterface = require('./CommandInterface');
const Database = require('./Database');

class Application {
  constructor() {
    this.localInterface = new CommandInterface('local', {});
    this.remoteInterface = new CommandInterface('remote', {});
  }

  connectToDb(dbref, info) {
    return new Promise(async (resolve, reject) => {
      let dbInterface;

      const dbName = `${dbref}Db`;

      switch (dbref) {
        case 'local':
          dbInterface = this.localInterface;
          break;
        case 'remote':
          dbInterface = this.remoteInterface;
          break;
      }

      this[dbName] = new Database(
        dbInterface,
        info.dbName,
        info.dbUser,
        info.dbPass,
      );

      this[dbName]
        .initTables()
        .then(resolve)
        .catch(reject);
    });
  }

  init() {
    return new Promise(async resolve => {
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
