import React from 'react';
import styled from 'styled-components';
import checkmark from './assets/checkmark.png';

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
  position: relative;
  flex-basis: 1 1 45%;
  padding: 0 10px 0 10px;
  &:hover {
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
  width: 70%;
  transition: 0.5s ease;
  opacity: 0;
  color: white;
  font-size: 16px;
  padding: 20px;
  text-align: center;
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
  id,
  onDeleteMovieCallback,
  onAddToWatchlistCallback,
  onRemoveFromWatchlistCallback,
  isSignedIn,
  isModal
}) => {
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

  function toSearchString(string) {
    return string.replace(/ /g, '+');
  }

  let addToWatchlist = !isModal && (
    <AddToWatchlist onClick={() => onAddToWatchlistCallback({ title, id })}>
      Add To Watchlist
    </AddToWatchlist>
  );

  let deleteButton = null;

  deleteButton = isSignedIn &&
    (currUser === 'Andrew' || currUser === creator) &&
    !isModal && (
      <Delete onClick={() => onDeleteMovieCallback({ title, id })}>
        Delete Movie
      </Delete>
    );

  if (isModal)
    deleteButton = (
      <Delete onClick={() => onRemoveFromWatchlistCallback({ title, id })}>
        Remove From Watchlist
      </Delete>
    );

  const genreDisplay = genre !== 'N/A' ? <li>{genre}</li> : null;
  const directorDisplay = director !== 'N/A' ? <li>{director}</li> : null;
  const actorsDisplay = actors !== 'N/A' ? <li>{actors}</li> : null;

  const posterImg =
    poster !== 'N/A' ? (
      <PosterContainer>
        <a href={createYoutubeSearchLink()}>
          <Poster className="poster" alt={title} src={poster} width="180" />
          <Overlay className="overlay">Watch trailer</Overlay>
        </a>
      </PosterContainer>
    ) : null;

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
        <section>{plot}</section>
        <div
          style={{
            fontStyle: 'italic',
            fontSize: '0.9em',
            width: '200px',
            marginTop: '1em',
            marginBottom: '1em'
          }}
        >
          {ratings.map(rating => {
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
              fontSize: '0.9em'
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
  border: 2px solid black;
  padding: 2rem;
  background: papayawhip;
  margin: 1rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;
