import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import ClickOutsideDismiss from './ClickOutsideDismiss';

const ModalStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) !important;
  max-height: calc(100vh - 210px);
  overflow-y: auto;
  padding: 20px;
  background-color: white;
  border: 1px solid grey;
  z-index: 2;
`;

const ModalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh);
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
