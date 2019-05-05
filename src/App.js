import React, { useEffect, useState } from "react";
import "./App.css";
import Movie from "./Movie";
import AddMovie from "./AddMovie";
import movies from "./movies";
import config from "./config";

const App = () => {
  const [titles, setTitles] = useState(movies);
  const [movieData, setMovieData] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const API_KEY = config.IMDB_KEY;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const key = "titles";
    if (localStorage.hasOwnProperty(key)) {
      // get the key's value from localStorage
      let value = localStorage.getItem(key);
      // parse the localStorage string and setState
      try {
        value = JSON.parse(value);
        setTitles(value);
      } catch (e) {
        // handle empty string
        setTitles(value);
      }
    }
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchData() {
      let data = [];
      for (let title of titles) {
        try {
          title = title.trim();
          const movieSearchString = title.replace(" ", "+");
          const url = `http://www.omdbapi.com/?t=${movieSearchString}&plot=full&apikey=${API_KEY}`;
          const res = await fetch(url);
          const json = await res.json();
          if (json.Response === "True") {
            await data.push(json);
          }
          console.log(json);
        } catch (error) {
          console.log(error);
        }
      }
      setMovieData(data);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    localStorage.setItem("titles", JSON.stringify(titles));
  }, [titles]);

  function handleAddMovie(movie) {
    setAlreadyAdded(false);
    setNotFound(false);
    movie = movie.trim();
    const movieCapitalized = capitalize(movie);
    const movieSearchString = movie.replace(" ", "+");
    if (!titles.includes(movieCapitalized)) {
      const url = `http://www.omdbapi.com/?t=${movieSearchString}&plot=full&apikey=${API_KEY}`;
      fetch(url)
        .then(res => res.json())
        .then(json => {
          if (json.Response === "True") {
            setTitles([json.Title, ...titles]);
            setMovieData([json, ...movieData]);
            console.log(titles);
          } else setNotFound(true);
        });
    } else {
      setAlreadyAdded(true);
    }
  }

  return (
    <div className="App">
      <h2 className="title">Movies to watch!</h2>
      <div className="mainContainer">
        <div>
          <AddMovie
            handleAddMovieCallback={handleAddMovie}
            alreadyAdded={alreadyAdded}
            notFound={notFound}
          />
        </div>
        <div>
          {movieData.map(movie => (
            <Movie
              key={movie.imdbID}
              title={movie.Title}
              year={movie.Year}
              genre={movie.Genre}
              director={movie.Director}
              actors={movie.Actors}
              plot={movie.Plot}
              ratings={movie.Ratings}
              poster={movie.Poster}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
