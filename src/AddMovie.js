import React, { useState } from "react";
import styled from "styled-components";

const Submit = styled.input`
  border: 1px solid black;
  border-radius: 5px;
  background: cornflowerBlue;
  padding: 8px;
  font-size: 1em;
  font-family: Futura;
  font-weight: bold;
`;

const TextInput = styled.input`
  margin-left: 1rem;
  height: 3em;
  padding: 0.5rem;
  border: 1px solid black;
  font-family: Futura;
  font-weight: bold;
`;

const Form = styled.form`
  max-width: 800px;
  border: 1px solid black;
  padding: 1rem;
  margin: 1rem; 
  background: lavender;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
`;

const Error = styled.p`
  margin: 1rem;
  color: red;
`;

const AddMovie = ({ handleAddMovieCallback, notFound, alreadyAdded }) => {
  const [movie, setMovie] = useState("");
  const [year, setYear] = useState("");
  const [inputError, setInputError] = useState(false);

  function handleSetMovie(e) {
    setMovie(e.target.value);
  }

  function handleSetYear(e) {
    setYear(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (movie === "") {
      setInputError(true);
      setTimeout(() => setInputError(false), 1500);
    } else {
      handleAddMovieCallback([movie.toLowerCase(), year]);
    }
  }

  let error = null;
  if (inputError) {
    error = <Error>Movie name required</Error>;
  } else if (notFound) {
    error = <Error>Movie not found!</Error>;
  } else if (alreadyAdded) {
    error = <Error>Movie already added!</Error>;
  } else {
    error = null;
  }

  return (
    <>
    <Form onSubmit={handleSubmit}>
        <div>
        <label htmlFor="addMovie">Add Movie:</label>
        <TextInput
          type="text"
          id="addMovie"
          onChange={handleSetMovie}
          value={movie}
        />
        </div>
        <div >
          <label htmlFor="year">Year (optional):</label>
          <TextInput
            type="text"
            id="year"
            onChange={handleSetYear}
            value={year}
          />
        </div>
        <div>
        <Submit type="submit" value="Submit" />
        <br />
        </div>
    </Form>
    <div>
    {error}
    </div>
    </>
  );
};

export default AddMovie;
