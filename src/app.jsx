import React from 'react';
import dbMergerApi from '../api';

// Components
import Form from './components/Form';
import Field from './components/Field';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateLocalInterface = this.updateLocalInterface.bind(this);
    this.updateRemoteInterface = this.updateRemoteInterface.bind(this);

    this.state = {
      local: {
        host: 'localhost',
        name: 'hh',
        username: '',
        password: '',
        privateKey: '',
      },
      remote: {
        host: '',
        name: 'hh',
        username: '',
        password: '',
        privateKey: '',
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
    dbMergerApi.localInterface.updateInfo(this.state.database.local);
  }
  updateRemoteInterface() {
    dbMergerApi.remoteInterface.updateInfo(this.state.connection.remote);
    dbMergerApi.remoteInterface.connect().then(console.log);
  }

  render() {
    return (
      <div className="database-info-container">
        <Form
          title="Local Database Info"
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
        <Form
          title="Remote Database Info"
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
            label="Database Username"
            dbref="remote"
            name="username"
            value={this.state.remote.username}
            handler={this.handleInputChange}
          />
          <Field
            label="Database Password"
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
      </div>
    );
  }
}
