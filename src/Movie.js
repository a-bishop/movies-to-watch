/* eslint-disable no-unused-expressions */
import React from "react";
import styled from "styled-components";

const Title = styled.h3`
  margin: 0;
`;

const Delete = styled.button`
  border: 1px solid black;
  border-radius: 5px;
  background: mistyRose;
  margin-bottom: 10px;
  padding: 8px;
  font-size: 0.8em;
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
  avgRating,
  poster,
  id,
  onDeleteMovieCallback,
  isSignedIn
}) => {
  let deleteButton = null;

  if (isSignedIn) {
    deleteButton = (
      <Delete onClick={() => onDeleteMovieCallback({ title, id })}>
        Delete Movie
      </Delete>
    );
  }
  return (
    <div className={className}>
      <div style={{ flex: "1 1 55%" }}>
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
      <div style={{ flexBasis: "1 1 45%", padding: "0 10px 0 10px" }}>
        <img alt={title} src={poster} width="180" />
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
  justify-content: center;
  flex-wrap: wrap;
`;
