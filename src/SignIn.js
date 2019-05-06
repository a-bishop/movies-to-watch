import React, { useState } from "react";
import styled from "styled-components";

const Submit = styled.input`
  border: 1px solid black;
  border-radius: 5px;
  background: cornflowerBlue;
  margin-top: 20px;
  padding: 8px;
  font-size: 1em;
  font-weight: bold;
`;

const TextInput = styled.input`
  height: 2em;
  border: 1px solid black;
  font-family: Futura;
  font-weight: bold;
  margin-top: 10px;
`;

const SignIn = ({ className, handleSignInCallback, signInError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <form onSubmit={handleSignInCallback} className={className}>
      <label htmlFor="email">Email:</label>
      <TextInput
        type="email"
        id="email"
        onChange={handleSetEmail}
        value={email}
      />
      <div style={{ marginTop: "10px" }}>
        <label htmlFor="password">Password:</label>
        <TextInput
          type="password"
          id="password"
          onChange={handleSetPassword}
          value={password}
        />
      </div>
      <Submit onClick={handleSignIn} type="submit" value="Sign In" />
      <br />
      {signInError}
    </form>
  );
};

export default styled(SignIn)`
  border: 2px solid black;
  padding: 2rem;
  margin: 1rem;
  background: lavender;
  width: 160px;
`;
