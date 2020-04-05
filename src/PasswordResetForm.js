import React, { useState } from 'react';
import ToggleContent from './ToggleContent';
import MyModal from './MyModal';
import styled from 'styled-components';

const Title = styled.h4`
  margin-top: 0;
  margin-bottom: 0.8em;
`;

const ResetText = styled.div`
  margin-bottom: 10px;
  font-size: 0.8rem;
  text-decoration: underline;
  cursor: pointer;
`;

const Submit = styled.input`
  border: 1px solid black;
  border-radius: 5px;
  background: papayawhip;
  padding: 8px;
  font-size: 1em;
  font-weight: bold;
  margin-top: 1.7em;
`;

const TextInput = styled.input`
  height: 3em;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid black;
  font-family: Futura;
  font-weight: bold;
  margin-top: 10px;
`;

const Error = styled.p`
  margin-top: 10px;
  color: red;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  border: 2px solid black;
  padding: 2em 2em 0 2em;
  margin: 0 0 1em 1em;
  background: darkkhaki;
`;

const PasswordReset = ({ shouldDismissModal, passwordResetCallback, emailError }) => {
  const [email, setEmail] = useState('');

  function handleSetEmail(e) {
    setEmail(e.target.value);
  }

  function emailSend(e) {
    e.preventDefault();
    passwordResetCallback(email);
  }

  return (
    <ToggleContent
      toggle={show => <ResetText onClick={show}>Forgot Your Password?</ResetText>}
      content={hide => (
        <MyModal override={shouldDismissModal} hide={hide} modalDismissedCallback={() => console.log('done')}>
          <div>
            <Form className="Form" onSubmit={emailSend}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <Title>Password Reset</Title>
              </div>
              <div style={{ marginTop: '10px' }}>
              <label htmlFor="email">Email:</label>
              <TextInput type="email" id="email" onChange={handleSetEmail} value={email} />
              </div>
              <Submit className="Submit" onClick={emailSend} type="submit" value="Send Reset Email" />
              <br />
              <Error>{emailError}</Error>
            </Form>
          </div>
        </MyModal>
      )}
    />
  );
};

export default PasswordReset;
