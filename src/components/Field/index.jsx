import React from 'react';
import PropTypes from 'prop-types';

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

Field.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  handler: PropTypes.func.isRequired,
  dbref: PropTypes.string.isRequired,
};

export default Field;
