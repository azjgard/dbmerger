import React from 'react';

import dbMergerApi from '../api';

class Field extends React.Component {
  render() {
    return (
      <div className="field">
        <span>{this.props.label}</span>
        <input
          type="text"
          name={this.props.name}
          value={this.props.value}
          onChange={this.props.handler}
          data-dbref={this.props.dbref}
        />
      </div>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateLocalInterface = this.updateLocalInterface.bind(this);
    this.updateRemoteInterface = this.updateRemoteInterface.bind(this);

    this.state = {
      connection: {
        local: {
          host: 'localhost',
          username: '',
          password: '',
          privateKey: '',
        },
        remote: {
          host: '',
          username: '',
          password: '',
          privateKey: '',
        },
      },
      database: {
        local: {
          name: '',
          username: '',
          password: '',
        },
        remote: {
          host: '',
          port: '',
          name: '',
          username: '',
          password: '',
        },
      },
    };
  }

  handleInputChange(e) {
    const name = e.target.name;
    const dbRef = e.target.dataset.dbref;

    const stateClone = JSON.parse(JSON.stringify(this.state));
    stateClone.connection[dbRef][name] = e.target.value;

    this.setState(stateClone);
  }

  updateLocalInterface() {
    dbMergerApi.localInterface.updateInfo(this.state.database.local);
  }
  updateRemoteInterface() {
    dbMergerApi.remoteInterface.updateInfo(this.state.connection.remote);
    dbMergerApi.remoteInterface.connect().then(console.log);
  }

  render() {
    return (
      <div className="database-info-container">
        <div>
          <h1>Local Database Info</h1>
          <Field
            label="Database Name"
            dbref="local"
            name="name"
            value={this.state.database.local.name}
            handler={this.handleInputChange}
          />
          <Field
            label="Database Username"
            dbref="local"
            name="username"
            value={this.state.database.local.username}
            handler={this.handleInputChange}
          />
          <Field
            label="Database Password"
            dbref="local"
            name="password"
            value={this.state.database.local.password}
            handler={this.handleInputChange}
          />
          <div>
            <button onClick={this.updateLocalInterface}>Test Connection</button>
          </div>
        </div>
        <div>
          <h1>Remote Database Info</h1>
          <Field
            label="Host"
            dbref="remote"
            name="host"
            value={this.state.connection.remote.host}
            handler={this.handleInputChange}
          />
          <Field
            label="Database Username"
            dbref="remote"
            name="username"
            value={this.state.connection.remote.username}
            handler={this.handleInputChange}
          />
          <Field
            label="Database Password"
            dbref="remote"
            name="password"
            value={this.state.connection.remote.password}
            handler={this.handleInputChange}
          />
          <Field
            label="Private Key (optional)"
            dbref="remote"
            name="privateKey"
            value={this.state.connection.remote.privateKey}
            handler={this.handleInputChange}
          />
          <div>
            <button onClick={this.updateRemoteInterface}>Test Connection</button>
          </div>
        </div>
      </div>
    );
  }
}
