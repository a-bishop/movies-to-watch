/* eslint-disable no-unused-expressions */
import React from "react";
import styled from "styled-components";
import checkmark from "./assets/checkmark.png";

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
  creator,
  currUser,
  poster,
  filter,
  id,
  onDeleteMovieCallback,
  isSignedIn
}) => {
  let deleteButton = null;

  if (filter !== "" && creator !== filter) {
    return null;
  }

  if (isSignedIn && (currUser === "Andrew" || currUser === creator)) {
    deleteButton = (
      <Delete onClick={() => onDeleteMovieCallback({ title, id })}>
        Delete Movie
      </Delete>
    );
  }
  let genreDisplay = null;
  if (genre !== "N/A") {
    genreDisplay = <li>{genre}</li>;
  }
  let directorDisplay = null;
  if (director !== "N/A") {
    directorDisplay = <li>Directed by {director}</li>;
  }
  let actorsDisplay = null;
  if (actors !== "N/A") {
    actorsDisplay = <li>Starring {actors}</li>;
  }
  let posterImg = null;
  if (poster !== "N/A") {
    posterImg = (
      <div style={{ flexBasis: "1 1 45%", padding: "0 10px 0 10px" }}>
        <img alt={title} src={poster} width="180" />
      </div>
    );
  }
  return (
    <div className={className}>
      <div style={{ flex: "1 1 55%" }}>
        {deleteButton}
        <Title>{title}</Title>
        <ul>
          <li>{year}</li>
          {genreDisplay}
          {directorDisplay}
          {actorsDisplay}
        </ul>
        <section>{plot}</section>
        <div
          style={{
            fontStyle: "italic",
            fontSize: "0.9em",
            width: "200px",
            marginTop: "1em",
            marginBottom: "1em"
          }}
        >
          {ratings.map(rating => {
            if (rating.Source === "Internet Movie Database") {
              rating.Source = "IMDb";
            }
            return (
              <div key={rating.Source}>
                {rating.Source} – {rating.Value}
              </div>
            );
          })}
          <br />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontStyle: "normal",
              fontSize: "0.9em"
            }}
          >
            <img alt="checkmark" src={checkmark} style={{ width: "20px" }} />
            &nbsp;Recommended by {creator}
          </div>
        </div>
      </div>
      {posterImg}
    </div>
  );
};

export default styled(Movie)`
  border: 2px solid black;
  padding: 2rem;
  background: ${props => (props.isDragging ? "#e5d7bf" : "papayawhip")};
  margin: 1rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;
