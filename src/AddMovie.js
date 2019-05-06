import React, { useState } from "react";
import styled from "styled-components";

const Submit = styled.input`
  border: 1px solid black;
  border-radius: 5px;
  background: cornflowerBlue;
  margin-top: 10px;
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

const Form = styled.form`
  border: 2px solid black;
  padding: 2rem;
  margin: 1rem 0 1rem 1rem;
  background: lavender;
  width: 160px;
`;

const SignOut = styled.button`
  border: 1px solid black;
  border-radius: 5px;
  background: mistyRose;
  margin-top: 10px;
  margin-left: 20px;
  padding: 8px;
  align-self: flex-start;
  font-size: 1em;
  font-family: Futura;
`;

const Error = styled.p`
  margin-top: 10px;
  color: red;
`;

const AddMovie = ({
  className,
  handleAddMovieCallback,
  handleSignOutCallback,
  notFound,
  alreadyAdded
}) => {
  const [movie, setMovie] = useState("");

  function handleSetMovie(e) {
    setMovie(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleAddMovieCallback(movie.toLowerCase());
  }

  function handleSignOut(e) {
    handleSignOutCallback();
  }

  let error;
  if (notFound) {
    error = <Error>Movie not found!</Error>;
  } else if (alreadyAdded) {
    error = <Error>Movie already added!</Error>;
  } else {
    error = null;
  }

  return (
    <div className={className}>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="name">Add Movie:</label>
        <TextInput
          type="text"
          id="addMovie"
          onChange={handleSetMovie}
          value={movie}
        />
        <Submit type="submit" value="Submit" />
        <br />
        {error}
      </Form>
      <SignOut onClick={handleSignOut}>Sign Out</SignOut>
    </div>
  );
};

export default styled(AddMovie)`
  display: flex;
  flex-direction: column;
  max-width: 250px;
`;
