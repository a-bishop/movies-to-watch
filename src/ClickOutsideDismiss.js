import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function useClickOutsideDismiss(ref, dismiss, callback) {
  function handleClickOutside(event) {
    const className = event.target.className;
    if (
      ref.current &&
      (className.includes('modalContainer') ||
        className.includes('dismissButton'))
    ) {
      dismiss();
      callback();
    }
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
}

function ClickOutsideDismiss(props) {
  const wrapperRef = useRef(null);
  useClickOutsideDismiss(
    wrapperRef,
    props.dismiss,
    props.modalDismissedCallback
  );

  return <div ref={wrapperRef}>{props.children}</div>;
}

ClickOutsideDismiss.propTypes = {
  children: PropTypes.element.isRequired
};

export default ClickOutsideDismiss;
