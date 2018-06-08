const Table = require("./Table");

class Database {
  constructor(commandInterface, dbName, dbUser, dbPass) {
    this.commandInterface = commandInterface;
    this.dbName = dbName;
    this.dbUser = dbUser;
    this.dbPass = dbPass;
    this.tables = {};
  }

  executeCommand(command) {
    return this
      .commandInterface
      .execCommand(
        `mysql -u ${this.dbUser} -p${this.dbPass} -e "${command}"`
      );
  }

  listTables() {
    return new Promise((resolve, reject) => {
      this.commandInterface
        .execCommand(
          `mysql -u ${this.dbUser} -p${this.dbPass} -e "show tables from ${
            this.dbName
          }"`
        )
        .then(result => {
          const output = result.stdout;
          const tableNames = output.split("\n");
          tableNames.splice(0, 1); // first line isn't an actual table name
          resolve(tableNames);
        });
    });
  }

  initTables() {
    return new Promise((resolve, reject) => {
      this.listTables().then(tableNames =>
        tableNames.map(tableName => {
          this.tables[tableName] = new Table(
            this.commandInterface,
            this.dbName,
            this.dbUser,
            this.dbPass,
            tableName
          );
          resolve(this);
        })
      );
    });
  }
}

module.exports = Database;
