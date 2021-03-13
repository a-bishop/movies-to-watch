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
  width: 100px;
`;

const TextInput = styled.input`
  margin-left: 1rem;
  height: 35px;
  padding: 0.5rem;
  border: 1px solid black;
  font-family: Futura;
  font-weight: bold;
`;

const Form = styled.form`
  border: 1px solid black;
  padding: 1rem;
  background: lavender;
  max-width: 400px;
  display: grid;
  grid-gap: 10px;
`;

const Error = styled.p`
  margin: 1rem;
  color: red;
`;

const FlexChild = styled.div`
  display: grid;
  grid-template-columns: 40% 60%;
`

const Label = styled.label`
  /* width: 600px; */
`

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
        <FlexChild>
        <Label htmlFor="addMovie">Add Movie:</Label>
        <TextInput
          type="text"
          id="addMovie"
          onChange={handleSetMovie}
          value={movie}
        />
        </FlexChild>
        <FlexChild >
          <Label htmlFor="year">Year (optional):</Label>
          <TextInput
            type="text"
            id="year"
            onChange={handleSetYear}
            value={year}
          />
        </FlexChild>
        <FlexChild >
        <Submit type="submit" value="Submit" />
        </FlexChild>
    </Form>
    <div>
    {error}
    </div>
    </>
  );
};

export default AddMovie;
