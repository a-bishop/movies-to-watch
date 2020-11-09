import React, { useState } from 'react';
import ToggleContent from './ToggleContent';
import MyModal from './MyModal';
import styled from 'styled-components';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// const Flex = styled.div`
//   display: flex;
//   align-items: center;
// `

const Title = styled.h4`
  margin-top: 0;
  margin-bottom: 0.8em;
`;

const SignUpText = styled.div`
  margin: 0 0 0 0.5rem;
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
  height: 35px;
  padding: 0.5rem;
  border: 1px solid ${props => props.notReady ? 'black' : 'green'};
  font-family: Futura;
  font-weight: bold;
  margin-top: 10px;
`;

const Icon = styled(FontAwesomeIcon)`
  position: absolute;
  right: 5%;
  bottom: 10px;
  &:hover {
    cursor: pointer;
  }
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
  margin: 1rem 1rem 2rem 1rem;
  background: darkkhaki;
`;

const SignUp = ({ modalDismiss, handleSignUpCallback, signUpError }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const notReady = name.length <= 3 || password.length <= 3 || !email.match(/^[^@\s]+@[^@\s.]+.[^@.\s]+$/);
  const ready = !notReady;

  return (
    <ToggleContent
      toggle={show => <SignUpText onClick={show}>Sign Up</SignUpText>}
      content={hide => (
        <MyModal override={modalDismiss} hide={hide} modalDismissedCallback={() => console.log('done')}>
          <div>
            <Form className="Form" onSubmit={handleSignUpCallback}>
              <Title>Sign up</Title>
              <label htmlFor="email">First Name:</label>
              <TextInput notReady={name.length <= 3} type="name" id="name" onChange={handleSetName} value={name} />
              <div style={{ marginTop: '10px' }}>
              <label htmlFor="email">Email:</label>
              </div>
              <TextInput notReady={!email.match(/^[^@\s]+@[^@\s.]+.[^@.\s]+$/)} type="email" id="email" onChange={handleSetEmail} value={email} />
              <div style={{ marginTop: '10px' }}>
                <label htmlFor="password">Choose a Password:</label>
              </div>
              <TextInput notReady={password.length <= 3} id="password" type={showPassword ? "text" : "password"} onChange={handleSetPassword} value={password} />
              <div style={{position: 'relative'}}>
                <Icon onClick={() => setShowPassword(bool => !bool)} icon={showPassword ? faEye : faEyeSlash} />
              </div>
              {notReady && <Submit className="Submit" onClick={handleSignUp} type="submit" value="Sign Up!" disabled/>}
              {ready && <Submit className="Submit" onClick={handleSignUp} type="submit" value="Sign Up!"/>}
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
