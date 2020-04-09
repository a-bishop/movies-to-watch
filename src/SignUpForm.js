import React, { useState } from 'react';
import ToggleContent from './ToggleContent';
import MyModal from './MyModal';
import styled from 'styled-components';

const Title = styled.h4`
  margin-top: 0;
  margin-bottom: 0.8em;
`;

const SignUpText = styled.div`
  margin-left: 1rem;
  text-decoration: underline;
  cursor: pointer;
`;

const Submit = styled.input`
  border: 1px solid black;
  border-radius: 5px;
  width: 50%;
  background: papayawhip;
  padding: 8px;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 1.7em;
`;

const TextInput = styled.input`
  height: 18px;
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

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  border: 2px solid black;
  padding: 2rem;
  margin: 1rem;
  background: darkkhaki;
`;

const SignUp = ({ modalDismiss, handleSignUpCallback, signUpError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  function handleSetEmail(e) {
    setEmail(e.target.value);
  }

  function handleSetName(e) {
    setName(e.target.value);
  }

  function handleSetPassword(e) {
    setPassword(e.target.value);
  }

  function handleSignUp(e) {
    e.preventDefault();
    handleSignUpCallback(name, email, password);
  }

  return (
    <ToggleContent
      toggle={show => <SignUpText onClick={show}>Sign Up</SignUpText>}
      content={hide => (
        <MyModal override={modalDismiss} hide={hide} modalDismissedCallback={() => console.log('done')}>
          <div>
            <Form className="Form" onSubmit={handleSignUpCallback}>
              <Title>Sign up</Title>
              <label htmlFor="email">First Name:</label>
              <TextInput type="name" id="name" onChange={handleSetName} value={name} />
              <div style={{ marginTop: '10px' }}>
              <label htmlFor="email">Email:</label>
              </div>
              <TextInput type="email" id="email" onChange={handleSetEmail} value={email} />
              <div style={{ marginTop: '10px' }}>
                <label htmlFor="password">Choose a Password:</label>
              </div>
              <TextInput type="password" id="password" onChange={handleSetPassword} value={password} />
              <Submit className="Submit" onClick={handleSignUp} type="submit" value="Sign Up!" />
              <br />
              <Error>{signUpError}</Error>
            </Form>
          </div>
        </MyModal>
      )}
    />
  );
};

export default SignUp;
