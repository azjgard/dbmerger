import React from 'react';
import PropTypes from 'prop-types';

class Modal extends React.Component {
  modalContainerClass() {
    return `modal-container ${this.props.visibility}`;
  }

  render() {
    return (
      <div className={this.modalContainerClass()}>
        <button className="close-modal" onClick={this.props.close}>
          X
        </button>
        <div className="modal">{this.props.children}</div>
      </div>
    );
  }
}

Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
  visibility: PropTypes.string,
  close: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  children: [],
  visibility: '',
};

export default Modal;
