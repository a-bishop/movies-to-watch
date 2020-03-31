import React from 'react';
import styled from 'styled-components';

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

const EmailAndPasswordInputs = props => (
  <>
    <label htmlFor="email">Email:</label>
    <TextInput type="email" id="email" onChange={props.setEmail} value={props.email} />
    <div style={{ marginTop: '10px' }}>
      <label htmlFor="password">Password:</label>
      <TextInput type="password" id="password" onChange={props.setPassword} value={props.password} />
    </div>
    <Submit className="Submit" onClick={props.signUpOrSignIn} type="submit" value={props.text} />
    <br />
    <Error>{props.error}</Error>
  </>
);

export default EmailAndPasswordInputs;
