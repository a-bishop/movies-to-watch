import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import ClickOutsideDismiss from './ClickOutsideDismiss';

const ModalStyle = styled.div`
  height: 90%;
  background-color: white;
  overflow-y: auto;
  width: 100%;
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) !important;
  height: calc(100vh - 150px);
  max-width: 90%;
  background-color: white;
  padding: 2em;
  z-index: 2;
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

const MyModal = props =>
  ReactDOM.createPortal(
    <ClickOutsideDismiss
      dismiss={props.hide}
      modalDismissedCallback={props.modalDismissedCallback}
    >
      <ModalFullScreenContainer className="modalContainer">
        <ModalWrapper>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
              marginBottom: '10px'
            }}
          >
            <Dismiss className="dismissButton">X</Dismiss>
          </div>
          <ModalStyle>{props.children}</ModalStyle>
        </ModalWrapper>
      </ModalFullScreenContainer>
    </ClickOutsideDismiss>,
    document.getElementById('modal-root')
  );
export default MyModal;
