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

    this.state = {
      local: {
        host: 'localhost',
        name: '',
        username: '',
        password: '',
        dbname: '',
        dbpassword: '',
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

  updateLocalInterface() {
    dbMergerApi.localInterface.updateInfo(this.state.local);
  }
  updateRemoteInterface() {
    dbMergerApi.remoteInterface.updateInfo(this.state.remote);
    dbMergerApi.remoteInterface.connect().then(output => {
      if (output.connection) {
        const newState = JSON.parse(JSON.stringify(this.state));
        newState.remote.hostConnected = 'connected';
        this.setState(newState);
      }
    });
  }

  render() {
    return (
      <div className="database-info-container">
        <Form
          title="Local Info"
          action={this.updateLocalInterface}
          buttonLabel="Test Connection">
          <Field
            label="Database Name"
            dbref="local"
            name="name"
            value={this.state.local.name}
            handler={this.handleInputChange}
          />
          <Field
            label="Database Username"
            dbref="local"
            name="username"
            value={this.state.local.username}
            handler={this.handleInputChange}
          />
          <Field
            label="Database Password"
            dbref="local"
            name="password"
            value={this.state.local.password}
            handler={this.handleInputChange}
          />
        </Form>
        <ConnectionIndicator 
          hostConnectedStatus={this.state.local.hostConnected}
          dbConnectedStatus={this.state.local.dbConnected}
        />
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
    );
  }
}
