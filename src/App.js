import React, { useEffect, useState } from "react";
import "./App.css";
import Movie from "./Movie";
import AddMovie from "./AddMovie";
import config from "./config";
import { SyncLoader } from "react-spinners";
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const FIREBASE = config.FIREBASE;
firebase.initializeApp(FIREBASE);
const db = firebase.firestore();
const API_KEY = config.IMDB_KEY;

const App = () => {
  const [titles, setTitles] = useState([]);
  const [movieData, setMovieData] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [newMovieAdded, setNewMovieAdded] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let data = [];
    let titles = [];
    db.collection("movies")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          data.push(doc.data());
          titles.push(doc.id);
          console.log(doc.id, " => ", doc.data());
        });
      });

    // const key = "titles";
    // if (localStorage.hasOwnProperty(key)) {
    //   // get the key's value from localStorage
    //   let value = localStorage.getItem(key);
    //   // parse the localStorage string and setState
    //   try {
    //     value = JSON.parse(value);
    //     setTitles(value);
    //   } catch (e) {
    //     // handle empty string
    //     setTitles(value);
    //   }
    // }
    setMovieData(data);
    setTimeout(() => setIsLoading(false), 1500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   async function fetchData() {
  //     let data = [];
  //     for (let title of titles) {
  //       try {
  //         title = title.trim();
  //         const movieSearchString = title.replace(" ", "+");
  //         const url = `https://www.omdbapi.com/?t=${movieSearchString}&plot=full&apikey=${API_KEY}`;
  //         const res = await fetch(url);
  //         const json = await res.json();
  //         if (json.Response === "True") {
  //           // add to firebase
  //           await data.push(json);
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //     setMovieData(data);
  //   }
  //   setTimeout(() => setIsLoading(false), 1500);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isHydrated]);

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    if (newMovieAdded !== "") {
      db.collection("movies")
        .doc(newMovieAdded.title)
        .set({
          title: newMovieAdded.title,
          year: newMovieAdded.year,
          genre: newMovieAdded.genre,
          director: newMovieAdded.director,
          actors: newMovieAdded.actors,
          plot: newMovieAdded.plot,
          ratings: newMovieAdded.ratings,
          poster: newMovieAdded.poster
        })
        .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
    }
  }, [newMovieAdded]);

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
      const url = `https://www.omdbapi.com/?t=${movieSearchString}&plot=full&apikey=${API_KEY}`;
      fetch(url)
        .then(res => res.json())
        .then(json => {
          if (json.Response === "True") {
            const newMovie = {
              title: json.Title,
              year: json.Year,
              genre: json.Genre,
              director: json.Director,
              actors: json.Actors,
              plot: json.Plot,
              ratings: json.Ratings,
              poster: json.Poster
            };
            setTitles([newMovie.title, ...titles]);
            setMovieData([newMovie, ...movieData]);
            setNewMovieAdded(newMovie);
          } else setNotFound(true);
        })
        .catch(error => {
          console.log(error);
          setNotFound(true);
        });
    } else {
      setAlreadyAdded(true);
    }
  }

  let main = (
    <div style={{ padding: "50px 0 0 50px" }}>
      <SyncLoader sizeUnit={"px"} size={40} color={"darkKhaki"} />
    </div>
  );
  if (!isLoading) {
    main = (
      <div>
        {movieData.map(movie => (
          <Movie
            key={movie.title}
            title={movie.title}
            year={movie.year}
            genre={movie.genre}
            director={movie.director}
            actors={movie.actors}
            plot={movie.plot}
            ratings={movie.ratings}
            poster={movie.poster}
          />
        ))}
      </div>
    );
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
        {main}
      </div>
    </div>
  );
};

export default App;
