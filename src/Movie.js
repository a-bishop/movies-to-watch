/* eslint-disable no-unused-expressions */
import React from "react";
import styled from "styled-components";

const Poster = styled.img`
  margin-left: 20px;
`;

const Title = styled.h3`
  margin-top: 0px;
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
  poster
}) => {
  return (
    <div className={className}>
      <div>
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
  justify-content: space-between;
`;
