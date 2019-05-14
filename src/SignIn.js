import React, { useState } from "react";
import styled from "styled-components";

const Title = styled.h4`
  margin-top: 0;
`;

const Submit = styled.input`
  border: 1px solid black;
  border-radius: 5px;
  background: cornflowerBlue;
  margin-top: 1.7em;
  padding: 8px;
  font-size: 1em;
  font-weight: bold;
`;

const TextInput = styled.input`
  height: 3em;
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
  border: 2px solid black;
  padding: 2em 2em 1em 2em;
  margin: 1em 0 1em 1em;
  background: lavender;
  width: 165px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 250px;
`;

const SignIn = ({ handleSignInCallback, signInError }) => {
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
    <Container>
      <Form className="Form" onSubmit={handleSignInCallback}>
        <Title>Sign in to edit</Title>
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
        <Submit
          className="Submit"
          onClick={handleSignIn}
          type="submit"
          value="Sign In"
        />
        <br />
        <Error>{signInError}</Error>
      </Form>
    </Container>
  );
};

export default SignIn;
