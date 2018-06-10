import React from 'react';
import dbMergerApi from '../api';

// Components
import Form from './components/Form';
import Field from './components/Field';
import ConnectionIndicator from './components/ConnectionIndicator';
import Modal from './components/Modal';

const testCredentials = require('../credentials');

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);

    this.connectLocal = this.connectLocal.bind(this);
    this.connectRemote = this.connectRemote.bind(this);

    this.modalHandler = this.modalHandler.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      // modalChildren: [],
      // modalVisibility: 'hidden',
      local: {
        dbname: testCredentials.local.dbname,
        dbusername: testCredentials.local.dbusername,
        dbpassword: testCredentials.local.dbpassword,
        hostConnected: 'connected',
        dbConnected: 'disconnected',
        tables: [],
      },
      remote: {
        host: testCredentials.remote.host,
        username: testCredentials.remote.username,
        password: '',
        dbname: testCredentials.remote.dbname,
        dbusername: testCredentials.remote.dbusername,
        dbpassword: testCredentials.remote.dbpassword,
        privateKey: testCredentials.remote.privateKey,
        hostConnected: 'disconnected',
        dbConnected: 'disconnected',
        tables: [],
      },
    };
  }

  handleInputChange(e) {
    const name = e.target.name;
    const dbRef = e.target.dataset.dbref;
    const value = e.target.value;

    const newState = JSON.parse(JSON.stringify(this.state));
    newState[dbRef][name] = value;

    this.setState(newState);
  }

  connectLocal() {
    const newState = JSON.parse(JSON.stringify(this.state));

    dbMergerApi.localInterface.updateInfo(this.state.local);

    dbMergerApi
      .connectToDb('local', {
        dbName: this.state.local.dbname,
        dbUser: this.state.local.dbusername,
        dbPass: this.state.local.dbpassword,
      })
      .then(database => {
        newState.local.dbConnected = 'connected';
        newState.local.tables = database.tables;
        this.setState(newState);
      })
      .catch(e => {
        console.error(e);
        newState.local.dbConnected = 'error';
        newState.local.tables = [];
        this.setState(newState);
      });
  }

  connectRemote() {
    return new Promise(async (resolve, reject) => {
      const newState = JSON.parse(JSON.stringify(this.state));

      dbMergerApi.remoteInterface.updateInfo(this.state.remote);

      await dbMergerApi.remoteInterface
        .connect()
        .then(output => {
          newState.remote.hostConnected = 'connected';
          this.setState(newState);
        })
        .catch(error => {
          newState.remote.hostConnected = 'error';
          newState.remote.tables = [];
          this.setState(newState);
        });

      if (newState.remote.hostConnected === 'connected') {
        dbMergerApi
          .connectToDb('remote', {
            dbName: this.state.remote.dbname,
            dbUser: this.state.remote.dbusername,
            dbPass: this.state.remote.dbpassword,
          })
          .then(database => {
            newState.remote.dbConnected = 'connected';
            newState.remote.tables = database.tables;
            this.setState(newState);
          })
          .catch(e => {
            newState.remote.dbConnected = 'error';
            newState.remote.tables = [];
            this.setState(newState);
          });
      }
    });
  }

  renderTables(dbref) {
    const elements = [];
    const tables = this.state[dbref].tables;

    for (const tableName in tables) {
      const key = `${dbref}-${tableName}`;
      const table = tables[tableName];

      elements.push(
        <div className="table-selector" key={key}>
          <input type="checkbox" name={tableName} onClick={() => {
            console.log('clicked...');
            this.modal(<p>hello</p>);
          }} /> <span>{tableName}</span>
        </div>,
      );
    }

    return <div className="table-selector-container">{elements}</div>;
  }

  // modal(children) {
  //   return new Promise((resolve, reject) => {
  //     const newState = JSON.parse(JSON.stringify(this.state));
  //     this.showModal().then(() => { 
  //       newState.modalChildren = children;
  //       this.setState(newState, resolve)
  //     });
  //   })
  // }

  // showModal() {
  //   return new Promise((resolve, reject) => {
  //     const newState = JSON.parse(JSON.stringify(this.state));
  //     newState.modelVisibility = "visible";
  //     this.setState(newState, resolve);
  //   })
  // }

  // hideModal() {
  //   const newState = JSON.parse(JSON.stringify(this.state));
  //   newState.modelVisibility = "hidden";
  //   this.setState(newState);
  // }

  // modalHandler() {
  //   return (
  //     <Modal visibility={this.state.modalVisibility} close={this.hideModal}>
  //       {this.state.modalChildren}
  //     </Modal>
  //   )
  // }

  render() {
    return (
      <div className="database-info-container">
        {//this.modalHandler()}
        <div>
          <div>
            <Form
              title="Local Info"
              action={this.connectLocal}
              buttonLabel="Connect">
              <Field
                label="Database Name"
                dbref="local"
                name="dbname"
                value={this.state.local.dbname}
                handler={this.handleInputChange}
              />
              <Field
                label="Database Username"
                dbref="local"
                name="dbusername"
                value={this.state.local.dbusername}
                handler={this.handleInputChange}
              />
              <Field
                label="Database Password"
                dbref="local"
                name="dbpassword"
                value={this.state.local.dbpassword}
                handler={this.handleInputChange}
              />
            </Form>
            <ConnectionIndicator
              hostConnectedStatus={this.state.local.hostConnected}
              dbConnectedStatus={this.state.local.dbConnected}
            />
          </div>
          {this.renderTables('local')}
        </div>
        <div>
          <div>
            <Form
              title="Remote Info"
              action={this.connectRemote}
              buttonLabel="Connect">
              <Field
                label="Database Name"
                dbref="remote"
                name="dbname"
                value={this.state.remote.dbname}
                handler={this.handleInputChange}
              />
              <Field
                label="Database Username"
                dbref="remote"
                name="dbusername"
                value={this.state.remote.dbusername}
                handler={this.handleInputChange}
              />
              <Field
                label="Database Password"
                dbref="remote"
                name="dbpassword"
                value={this.state.remote.dbpassword}
                handler={this.handleInputChange}
              />
              <Field
                label="Host"
                dbref="remote"
                name="host"
                value={this.state.remote.host}
                handler={this.handleInputChange}
              />
              <Field
                label="Username"
                dbref="remote"
                name="username"
                value={this.state.remote.username}
                handler={this.handleInputChange}
              />
              <Field
                label="Password (optional)"
                dbref="remote"
                name="password"
                value={this.state.remote.password}
                handler={this.handleInputChange}
              />
              <Field
                label="Private Key (optional)"
                dbref="remote"
                name="privateKey"
                value={this.state.remote.privateKey}
                handler={this.handleInputChange}
              />
            </Form>
            <ConnectionIndicator
              hostConnectedStatus={this.state.remote.hostConnected}
              dbConnectedStatus={this.state.remote.dbConnected}
            />
          </div>
          {this.renderTables('remote')}
        </div>
      </div>
    );
  }
}
