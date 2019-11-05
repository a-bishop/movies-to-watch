import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import ClickOutsideDismiss from './ClickOutsideDismiss';

const ModalStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) !important;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  padding: 1em 2em 1em 2em;
  background-color: white;
  border: 1px solid grey;
  z-index: 2;

  @media only screen and (max-width: 500px) {
    width: 90%;
  }
`;

const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh);
  font-family: 'Futura';
  background-color: rgba(220, 220, 220, 0.5);
  z-index: 1;
`;

const MyModal = props =>
  ReactDOM.createPortal(
    <ClickOutsideDismiss
      dismiss={props.hide}
      modalDismissedCallback={props.modalDismissedCallback}
    >
      <ModalContainer className="modalContainer">
        <ModalStyle>{props.children}</ModalStyle>
      </ModalContainer>
    </ClickOutsideDismiss>,
    document.getElementById('modal-root')
  );
export default MyModal;
