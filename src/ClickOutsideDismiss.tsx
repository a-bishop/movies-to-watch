import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

interface Props {
  children: React.ReactNode;
  dismiss: () => void;
  modalDismissedCallback: () => void;
  override: boolean;
}

function useClickOutsideDismiss(
  ref: React.RefObject<HTMLElement>,
  dismiss: Props['dismiss'],
  callback: Props['modalDismissedCallback'],
  override: Props['override']
) {
  useEffect(() => {
    if (override) {
      dismiss();
      callback();
    }
  }, [override, callback, dismiss]);

  function handleClickOutside(event: any) {
    const className = event.target.className;
    if (className && typeof className === 'string' && ref.current && (className.includes('modalContainer') || className.includes('dismissButton'))) {
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

function ClickOutsideDismiss({ children, dismiss, modalDismissedCallback, override }: Props) {
  const wrapperRef = useRef(null);
  useClickOutsideDismiss(wrapperRef, dismiss, modalDismissedCallback, override);

  return <div ref={wrapperRef}>{children}</div>;
}

ClickOutsideDismiss.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ClickOutsideDismiss;
