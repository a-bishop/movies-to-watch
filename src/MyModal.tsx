import React from 'react';
import { useMediaQuery } from 'react-responsive';

import ReactDOM from 'react-dom';
import styled from 'styled-components';
import ClickOutsideDismiss from './ClickOutsideDismiss';

const ModalStyle = styled.div`
  height: 90%;
  background-color: white;
  overflow-y: auto;
  width: 100%;
`;

const ModalWrapper = styled.div<{ isMobile: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) !important;
  overflow-y: auto;
  width: 30%;
  min-width: 400px;
  background-color: white;
  padding: 2em;
  z-index: 2;
  ${({ isMobile }) => isMobile && `height: 85vh`}
`;

const ModalFullScreenContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10000vh;
  font-family: 'Futura';
  background-color: rgba(220, 220, 220, 0.5);
  z-index: 1;
`;

const Dismiss = styled.span`
  margin-right: 1rem;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.5em;
  opacity: 0.6;
`;

interface Props {
  children: React.ReactNode;
  hide: () => void;
  modalDismissedCallback: () => void;
  override: boolean;
}

const MyModal = ({ children, hide, modalDismissedCallback, override }: Props) => {
  const isMobile = useMediaQuery({ maxHeight: 800 });
  const root = document.getElementById('modal-root');

  return root
    ? ReactDOM.createPortal(
        <ClickOutsideDismiss dismiss={hide} modalDismissedCallback={modalDismissedCallback} override={override}>
          <ModalFullScreenContainer className="modalContainer">
            <ModalWrapper isMobile={isMobile}>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'flex-end',
                  marginBottom: '10px',
                }}
              >
                <Dismiss className="dismissButton">X</Dismiss>
              </div>
              <ModalStyle>{children}</ModalStyle>
            </ModalWrapper>
          </ModalFullScreenContainer>
        </ClickOutsideDismiss>,
        root
      )
    : null;
};
export default MyModal;
