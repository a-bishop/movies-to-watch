import React, { useState } from 'react';
import ToggleContent from './ToggleContent';
import MyModal from './MyModal';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Title = styled.h4`
  margin-top: 0;
  margin-bottom: 0.8em;
`;

const SignUpText = styled.div`
  margin: 0 0 0 0.5rem;
  text-decoration: underline;
  cursor: pointer;
`;

const Submit = styled.button`
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
  border: 1px solid ${(props: { invalid: boolean }) => (props.invalid ? 'black' : 'green')};
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

interface Props {
  modalDismiss: boolean;
  handleSignUpCallback: (name: string, email: string, password: string) => void;
  signUpError: string;
}

const SignUp = ({ modalDismiss, handleSignUpCallback, signUpError }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');

  const invalid = name.length <= 3 || name === 'Guest' || password.length <= 3 || !email.match(/^[^@\s]+@[^@\s.]+.[^@.\s]+$/);

  function handleSetEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handleSetName(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function handleSetPassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  function handleSignUp(e: React.ChangeEvent<any>) {
    e.preventDefault();
    if (!invalid) handleSignUpCallback(name, email, password);
  }

  return (
    <ToggleContent
      toggle={(show) => <SignUpText onClick={show}>Sign Up</SignUpText>}
      content={(hide) => (
        <MyModal override={modalDismiss} hide={hide} modalDismissedCallback={() => console.log('done')}>
          <div>
            <Form className="Form">
              <Title>Sign up</Title>
              <label htmlFor="email">First Name:</label>
              <TextInput invalid={name.length <= 3} type="name" id="name" onChange={handleSetName} value={name} />
              <div style={{ marginTop: '10px' }}>
                <label htmlFor="email">Email:</label>
              </div>
              <TextInput invalid={!email.match(/^[^@\s]+@[^@\s.]+.[^@.\s]+$/)} type="email" id="email" onChange={handleSetEmail} value={email} />
              <div style={{ marginTop: '10px' }}>
                <label htmlFor="password">Choose a Password:</label>
              </div>
              <TextInput
                invalid={password.length <= 3}
                id="password"
                type={showPassword ? 'text' : 'password'}
                onChange={handleSetPassword}
                value={password}
              />
              <div style={{ position: 'relative' }}>
                <Icon onClick={() => setShowPassword((bool) => !bool)} icon={showPassword ? faEye : faEyeSlash} />
              </div>
              <Submit className="Submit" onClick={handleSignUp} type="submit" disabled={invalid}>
                Sign Up!
              </Submit>
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
