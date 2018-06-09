import React from 'react';
import dbMergerApi from '../api';

// Components
import Form from './components/Form';
import Field from './components/Field';
import ConnectionIndicator from './components/ConnectionIndicator';

const testCredentials = require('../credentials');

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateLocalInterface = this.updateLocalInterface.bind(this);
    this.updateRemoteInterface = this.updateRemoteInterface.bind(this);
    this.connectLocal = this.connectLocal.bind(this);

    this.state = {
      local: {
        host: 'localhost',
        name: '',
        username: '',
        password: '',
        dbname: testCredentials.local.dbname,
        dbusername: testCredentials.local.dbusername,
        dbpassword: testCredentials.local.dbpassword,
        privateKey: '',
        hostConnected: 'connected',
        dbConnected: 'disconnected',
      },
      remote: {
        host: testCredentials.remote.host,
        name: '',
        username: testCredentials.remote.username,
        password: '',
        dbname: '',
        dbusername: '',
        dbpassword: '',
        privateKey: testCredentials.remote.privateKey,
        hostConnected: 'disconnected',
        dbConnected: 'disconnected',
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

    dbMergerApi.connectToDb('local', {
      dbName: this.state.local.dbname,
      dbUser: this.state.local.dbusername,
      dbPass: this.state.local.dbpassword,
    }).then(output => {
      newState.local.dbConnected = 'connected';
      this.setState(newState);
    }).catch(e => {
      newState.local.dbConnected = 'error';
      this.setState(newState);
    })
  }

  updateRemoteInterface() {
    const newState = JSON.parse(JSON.stringify(this.state));

    dbMergerApi.remoteInterface.updateInfo(this.state.remote);
    dbMergerApi.remoteInterface.connect().then(output => {
      if (output.connection) {
        newState.remote.hostConnected = 'connected';
        this.setState(newState);
      }
    }).catch(error => {
        newState.remote.hostConnected = 'error';
        this.setState(newState);
    });
  }

  render() {
    return (
      <div className="database-info-container">
        <div>
          <Form
            title="Local Info"
            action={this.connectLocal}
            buttonLabel="Test Connection">
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
        <div>
          <Form
            title="Remote Info"
            action={this.updateRemoteInterface}
            buttonLabel="Test Connection">
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
      </div>
    );
  }
}
