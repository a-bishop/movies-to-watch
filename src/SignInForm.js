import React, { useState } from 'react';
import ToggleContent from './ToggleContent';
import MyModal from './MyModal';
import PasswordResetForm from './PasswordResetForm';
import styled from 'styled-components';

const Title = styled.h4`
  margin-top: 0;
  margin-bottom: 0.8em;
`;

const SignInText = styled.div`
  margin-right: 1rem;
  text-decoration: underline;
  cursor: pointer;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  border: 2px solid black;
  padding: 2rem;
  margin: 1rem;
  background: lavender;
`;

const Submit = styled.input`
  border: 1px solid black;
  border-radius: 5px;
  width: 40%;
  background: cornflowerBlue;
  padding: 8px;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 1.7em;
`;

const TextInput = styled.input`
  height: 18px;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid black;
  font-family: Futura;
  font-weight: bold;
  margin-top: 10px;
`;

const Error = styled.p`
  margin: 0;
  color: red;
`;

const SignIn = ({ modalDismiss, passwordReset, passwordResetError, handleSignInCallback, signInError }) => {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSetEmail(e) {
    setEmail(e.target.value);
  }

  function handleSetPassword(e) {
    setPassword(e.target.value);
  }

  function handleSignIn(e) {
    e.preventDefault();
    handleSignInCallback(email, password);
  }

  return (
    <ToggleContent
      toggle={show => <SignInText onClick={show}>Sign In</SignInText>}
      content={hide => (
        <MyModal override={modalDismiss} hide={hide} modalDismissedCallback={() => console.log('done')}>
          <div>
            <Form className="Form" onSubmit={handleSignInCallback}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <PasswordResetForm shouldDismissModal={modalDismiss} passwordResetCallback={passwordReset} emailError={passwordResetError}/>
                <Title>Sign in to edit</Title>
                <span style={{ marginBottom: '1.3em' }}>
                </span>
              </div>
                <label htmlFor="email">Email:</label>
                <TextInput type="email" id="email" onChange={handleSetEmail} value={email} />
                <div style={{ marginTop: '10px' }}>
                  <label htmlFor="password">Password:</label>
                  <TextInput type="password" id="password" onChange={handleSetPassword} value={password} />
                </div>
                <Submit className="Submit" onClick={handleSignIn} type="submit" value='Sign In' />
                <br />
                <Error>{signInError}</Error>
            </Form>
          </div>
      </MyModal>  
    )}
  />
  );
};

export default SignIn;
