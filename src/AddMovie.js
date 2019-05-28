import React, { useState } from "react";
import styled from "styled-components";

const Submit = styled.input`
  border: 1px solid black;
  border-radius: 5px;
  background: cornflowerBlue;
  margin-top: 20px;
  padding: 8px;
  font-size: 1em;
  font-family: Futura;
  font-weight: bold;
`;

const TextInput = styled.input`
  height: 3em;
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

const Error = styled.p`
  margin-top: 10px;
  color: red;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 250px;
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
    <Container className="Container">
      <Form onSubmit={handleSubmit}>
        <label htmlFor="addMovie">Add Movie:</label>
        <TextInput
          type="text"
          id="addMovie"
          onChange={handleSetMovie}
          value={movie}
        />
        <div style={{ marginTop: "10px" }}>
          <label htmlFor="year">Year (optional):</label>
          <TextInput
            type="text"
            id="year"
            onChange={handleSetYear}
            value={year}
          />
        </div>
        <Submit type="submit" value="Submit" />
        <br />
        {error}
      </Form>
    </Container>
  );
};

export default AddMovie;
