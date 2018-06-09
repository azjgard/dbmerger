import React from 'react';
import PropTypes from 'prop-types';

class ConnectionIndicator extends React.Component {
  getColor(status) {
    switch (status) {
      case 'connected':
        return 'green';
        break;
      case 'error':
        return 'red';
        break;
      default:
        return 'gray';
        break;
    }
  }

  render() {
    return (
      <div className="connection-indicator">
        <div>
          Connected to Host:{' '}
          <span
            style={{
              color: this.getColor(this.props.hostConnectedStatus),
            }}>
            {this.props.hostConnectedStatus}
          </span>
        </div>
        <div>
          Connected to Database:{' '}
          <span
            style={{
              color: this.getColor(this.props.dbConnectedStatus),
            }}>
            {this.props.dbConnectedStatus}
          </span>
        </div>
      </div>
    );
  }
}

ConnectionIndicator.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  dbConnectedStatus: PropTypes.string.isRequired,
  hostConnectedStatus: PropTypes.string.isRequired,
};

ConnectionIndicator.defaultProps = {
  children: [],
};

export default ConnectionIndicator;
