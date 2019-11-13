import React, { useState } from 'react';
import styled from 'styled-components';

const Title = styled.h4`
  margin-top: 0;
  margin-bottom: 0;
`;

const Submit = styled.input`
  border: 1px solid black;
  border-radius: 5px;
  width: 50%;
  background: cornflowerBlue;
  padding: 8px;
  font-size: 1em;
  font-weight: bold;
  margin-top: 1.7em;
`;

const TextInput = styled.input`
  height: 3em;
  width: 100%;
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
  background: lavender;
  width: 165px;

  @media (max-width: 700px) {
    width: 210px;
  }
`;

const SignIn = ({ handleSignInCallback, signInError }) => {
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
    <Form className="Form" onSubmit={handleSignInCallback}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}
      >
        <Title>Sign in to edit</Title>
        <span style={{ fontSize: '0.8em', marginBottom: '1.3em' }}>
          or <a href="mailto:andrew.bishop53@gmail.com">request an invite</a>
        </span>
      </div>
      <label htmlFor="email">Email:</label>
      <TextInput
        type="email"
        id="email"
        onChange={handleSetEmail}
        value={email}
      />
      <div style={{ marginTop: '10px' }}>
        <label htmlFor="password">Password:</label>
        <TextInput
          type="password"
          id="password"
          onChange={handleSetPassword}
          value={password}
        />
      </div>
      <Submit
        className="Submit"
        onClick={handleSignIn}
        type="submit"
        value="Sign In"
      />
      <br />
      <Error>{signInError}</Error>
    </Form>
  );
};

export default SignIn;
