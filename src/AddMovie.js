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

const SignOut = styled.button`
  border: 1px solid black;
  border-radius: 5px;
  background: mistyRose;
  margin-top: 10px;
  padding: 8px;
  font-weight: bold;
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
    error = <p>Movie not found!</p>;
  } else if (alreadyAdded) {
    error = <p>Movie already added!</p>;
  } else {
    error = null;
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <label htmlFor="name">Add Movie:</label>
      <TextInput
        type="text"
        id="addMovie"
        onChange={handleSetMovie}
        value={movie}
      />
      <Submit type="submit" value="Submit" />
      <br />
      <SignOut onClick={handleSignOut}>Sign Out</SignOut>
      {error}
    </form>
  );
};

export default styled(AddMovie)`
  border: 2px solid black;
  padding: 2rem;
  margin: 1rem;
  background: lavender;
  width: 160px;
`;
