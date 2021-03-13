import React, { useState } from 'react';
import styled from 'styled-components';
import checkmark from './assets/checkmark.png';
import { toSearchString } from './helpers';

const Title = styled.h3`
  margin: 0;
`;

const Button = styled.button`
  border: 1px solid black;
  border-radius: 5px;
  margin-bottom: 10px;
  margin-right: 5px;
  padding: 8px;
  font-size: 0.8em;
  font-family: Futura;
`;

const Delete = styled(Button)`
  background: rgba(255, 228, 225, 0.7);
  margin-right: 10px;
`;

const AddToWatchlist = styled(Button)`
  background: rgba(179, 197, 192, 0.7);
`;

const PosterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  flex-basis: 1 1 45%;
  margin: 0 10px 0 10px;
  &:hover, &:focus, &:active {
    .overlay {
      opacity: 1;
    }
    .poster {
      filter: brightness(70%);
    }
  }
`;

const Poster = styled.img`
  display: block;
  transition: 0.5s ease;
`;

const Overlay = styled.div`
  position: absolute;
  top: 100px;
  background: rgba(0, 0, 0, 0.5); /* Black see-through */
  width: 100%;
  transition: 0.5s ease;
  opacity: 0;
  color: white;
  font-size: 16px;
  padding: 20px;
  text-align: center;
`;

const WatchTrailerText = styled.p`
  text-decoration: underline;
`;

const YouTubeLink = styled.a`
  text-decoration: none;
  color: black;
`;

const Ellipses = styled.button`
  cursor: pointer;
  border: 1px solid black;
  border-radius: 5px;
  padding: 1px 5px 1px 5px;
  background-color: inherit;
  margin-left: 5px;
`

const FIRST_PLOT_STRING_OFFSET = 75;

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
  id,
  onDeleteMovieCallback,
  onAddToWatchlistCallback,
  onRemoveFromWatchlistCallback,
  isSignedIn,
  isModal,
}) => {

  const [plotStringOffset, setPlotStringOffset] = useState(FIRST_PLOT_STRING_OFFSET);

  function createYoutubeSearchLink() {
    const releaseYear = year.substr(-4, 4);
    let detailSearchString = toSearchString(title);
    if (director !== 'N/A') {
      detailSearchString += `+${toSearchString(director)}`;
    } else {
      detailSearchString += `+${toSearchString(actors)}`;
    }
    let link = `https://www.youtube.com/results?search_query=${detailSearchString}+${releaseYear}+english+trailer`;
    return link;
  }

  const addToWatchlist = !isModal && (
    <AddToWatchlist data-testid="addButton" onClick={() => onAddToWatchlistCallback({ title, id })}>
      Add To Watchlist
    </AddToWatchlist>
  );

  const deleteButton = isModal ? (
    <Delete data-testid="removeButton" onClick={() => onRemoveFromWatchlistCallback({ title, id })}>
      Remove From Watchlist
    </Delete>
  ) : (
    isSignedIn &&
    (currUser === 'Andrew' || currUser === creator) && (
      <Delete data-testid="deleteButton" onClick={() => onDeleteMovieCallback({ title, id })}>
        Delete Movie
      </Delete>
    )
  );

  const genreDisplay = genre !== 'N/A' ? <li>{genre}</li> : null;
  const directorDisplay = director !== 'N/A' ? <li>{director}</li> : null;
  const actorsDisplay = actors !== 'N/A' ? <li>{actors}</li> : null;

  const posterImg =
    poster !== 'N/A' ? (
      <YouTubeLink href={createYoutubeSearchLink()}>
        <PosterContainer>
          <Poster className="poster" alt={title} src={poster} width="180" />
          <Overlay className="overlay">Watch trailer</Overlay>
          <WatchTrailerText>Watch trailer</WatchTrailerText>
        </PosterContainer>
      </YouTubeLink>
    ) : null;

  const truncatedPlot = 
    plot
    .split(' ')
    .splice(0,plotStringOffset)
    .join(' ');
  
  let ellipses = null;
  const isExpanded = plot.length !== FIRST_PLOT_STRING_OFFSET && plotStringOffset === plot.length;

  if (truncatedPlot.length < plot.length || isExpanded) {
    const newOffset = isExpanded ? FIRST_PLOT_STRING_OFFSET : plot.length;
    const chars = isExpanded ? "^^^" : "...";
    ellipses = <Ellipses isExpanded={isExpanded} onClick={() => setPlotStringOffset(newOffset)}><span>{chars}</span></Ellipses>
  }

  return (
    <div className={className}>
      <div style={{ flex: '1 1 55%' }}>
        <div style={{ display: 'flex' }}>
          {deleteButton}
          {addToWatchlist}
        </div>
        <Title>{title}</Title>
        <ul>
          <li>{year}</li>
          {genreDisplay}
          {directorDisplay}
          {actorsDisplay}
        </ul>
        <section>
          {truncatedPlot}
          {ellipses}
        </section>
        <div
          style={{
            fontStyle: 'italic',
            fontSize: '0.9em',
            width: '200px',
            marginTop: '1em',
            marginBottom: '1em',
          }}
        >
          {ratings.map((rating) => {
            if (rating.Source === 'Internet Movie Database') {
              rating.Source = 'IMDb';
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
              display: 'flex',
              alignItems: 'center',
              fontStyle: 'normal',
              fontSize: '0.9em',
            }}
          >
            <img alt="checkmark" src={checkmark} style={{ width: '20px' }} />
            &nbsp;Recommended by {creator}
          </div>
        </div>
      </div>
      {posterImg}
    </div>
  );
};

export default styled(Movie)`
  border: 1px solid gray;
  box-shadow: 3px 4px 10px -6px rgba(0, 0, 0, 0.66);
  padding: 2rem;
  border-radius: 8px;
  background: papayawhip;
  margin: 1rem 0 1rem 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;
