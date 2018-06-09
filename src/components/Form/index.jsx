import React from 'react';
import PropTypes from 'prop-types';

class Form extends React.Component {
  render() {
    return (
      <div className="form">
        <h1>{this.props.title}</h1>
        {this.props.children}
        <div>
          <button onClick={this.props.action}>{this.props.buttonLabel}</button>
        </div>
      </div>
    );
  }
}

Form.propTypes = {
  title: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element),
  action: PropTypes.func.isRequired,
  buttonLabel: PropTypes.string,
};

Form.defaultProps = {
  title: '',
  children: [],
  buttonLabel: '',
};

export default Form;
