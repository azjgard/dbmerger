class Table {
  constructor(commandInterface, dbName, dbUser, dbPass, tableName) {
    this.commandInterface = commandInterface;
    this.dbName = dbName;
    this.dbUser = dbUser;
    this.dbPass = dbPass;
    this.tableName = tableName;
  }

  dump() {
    return new Promise((resolve, reject) => {
      const fileName =
        this.dbName + "__" + this.tableName + "__" + new Date().getTime();
      const sql = `mysqldump -u ${this.dbUser} -p${this.dbPass} ${
        this.dbName
      } ${this.tableName} > ~/${fileName}.sql`;
      this.commandInterface.execCommand(sql).then(result => {
        // console.log(result.stdout);
        resolve(`${fileName}.sql`);
      });
    });
  }

  dumpAndSend() {
    return new Promise((resolve, reject) => {
      this.dump().then(fileName => {
        // console.log("successfully dumped " + fileName);
        this.commandInterface.sendFile(fileName).then(() => resolve(fileName));
      });
    });
  }

  overwrite(fileName) {
    return new Promise((resolve, reject) => {
      const command = `mysql -u ${this.dbUser} -p${this.dbPass} ${
        this.dbName
      } < ~/${fileName}`;

      console.log(command);
      this.commandInterface.execCommand(command).then(result => {
        // console.log(result);
        resolve();
      });
    });
  }

  describe() {
    return new Promise((resolve, reject) => {
      const sql = `mysql -u ${this.dbUser} -p${this.dbPass} -e "describe ${
        this.dbName
      }.${this.tableName}"`;

      this.commandInterface
        .execCommand(sql)
        .then(result => resolve(result.stdout));
    });
  }

  describeToJson() {
    return new Promise((resolve, reject) => {
      this.describe().then(result => {
        const lines = result.split("\n");
        const headers = ["Field", "Type", "Null", "Key", "Default", "Extra"];

        let data = {};
        let currentField = "";

        lines.map(eachLine);
        resolve(data);

        function eachLine(line, lineIndex) {
          const columns = line.split("\t");
          columns.map(eachColumn);
        }

        function eachColumn(value, columnIndex) {
          const columnHeader = headers[columnIndex];

          if (columnIndex === 0) currentField = value;
          if (!data[currentField]) data[currentField] = {};

          data[currentField][columnHeader] = value;
        }
      });
    });
  }
}

module.exports = Table;
