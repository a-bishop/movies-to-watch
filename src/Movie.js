import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import checkmark from './assets/checkmark.png';
import config from './config';

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
      opacity: ${p => (p.trailerLink ? 1 : 0)};
    }
    .poster {
      filter: brightness(${p => (p.trailerLink ? 70 : 100)}%);
    }
  }
`;

const Poster = styled.img`
  display: block;
  transition: 0.5s ease;
`;

const Overlay = styled.div`
  position: absolute;
  top: 100;
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
  const [trailerLink, setTrailerLink] = useState('');

  useEffect(() => {
    async function fetchYoutubeLink() {
      const data = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${
          config.TMDB_KEY
        }&primary_release_year=${year}&query=${encodeURI(
          title
        )}&append_to_response=videos`
      );
      const json = await data.json();
      console.log(title, '\n\n');
      let tmdbId = null;
      let link = `https://www.youtube.com/results?search_query=${title.replace(
        ' ',
        '+'
      )}+${year}+trailer`;
      if (json.results[0]) tmdbId = json.results[0].id;
      if (tmdbId) {
        const trailerData = await fetch(
          `http://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${config.TMDB_KEY}`
        );
        const videos = await trailerData.json();
        if (videos.results) {
          videos.results.forEach(video => {
            if (video.type === 'Trailer') {
              link = `https://www.youtube.com/watch?v=${video.key}`;
            }
          });
        }
      }
      return link;
    }
    fetchYoutubeLink()
      .then(link => {
        setTrailerLink(link);
      })
      .catch(error => console.log('Error retrieving youtube trailer', error));
  });

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
      <PosterContainer trailerLink={trailerLink}>
        <a href={trailerLink}>
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
