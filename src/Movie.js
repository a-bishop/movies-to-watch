/* eslint-disable no-unused-expressions */
import React from "react";
import styled from "styled-components";

const Poster = styled.img`
  margin-left: 20px;
`;

const Title = styled.h3`
  margin: 0;
`;

const Delete = styled.button`
  border: 1px solid black;
  border-radius: 5px;
  background: mistyRose;
  margin-bottom: 10px;
  padding: 8px;
  font-size: 1em;
  font-family: Futura;
`;

const Movie = ({
  className,
  title,
  year,
  genre,
  director,
  actors,
  plot,
  ratings,
  poster,
  handleDeleteMovieCallback,
  isSignedIn
}) => {
  let deleteButton = null;
  if (isSignedIn) {
    deleteButton = (
      <Delete onClick={() => handleDeleteMovieCallback(title)}>
        Delete Movie
      </Delete>
    );
  }
  return (
    <div className={className}>
      <div>
        {deleteButton}
        <Title>{title}</Title>
        <ul>
          <li>{year}</li>
          <li>{genre}</li>
          <li>Directed by {director}</li>
          <li>Starring {actors}</li>
        </ul>
        <section>{plot}</section>
        {ratings.map(rating => (
          <div key={rating.Source}>
            <p>
              {rating.Source} – {rating.Value}
            </p>
          </div>
        ))}
      </div>
      <div>
        <Poster alt={title} src={poster} width="200" />
      </div>
    </div>
  );
};

export default styled(Movie)`
  border: 2px solid black;
  padding: 2rem;
  background: papayawhip;
  margin: 1rem;
  display: flex;
`;
