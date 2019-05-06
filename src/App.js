import React, { useEffect, useState } from "react";
import "./App.css";
import Movie from "./Movie";
import AddMovie from "./AddMovie";
import SignIn from "./SignIn";
import config from "./config";
import { SyncLoader } from "react-spinners";
import styled from "styled-components";
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
const FIREBASE = config.FIREBASE;
firebase.initializeApp(FIREBASE);
const db = firebase.firestore();
const API_KEY = config.IMDB_KEY;

const Main = styled.div`
  display: flex;
  flex-direction: ${window.innerWidth > 500 ? "row" : "column"};
`;

const App = () => {
  const [titles, setTitles] = useState([]);
  const [movieData, setMovieData] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [newMovieAdded, setNewMovieAdded] = useState("");
  const [movieDeleted, setMovieDeleted] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signInError, setSignInError] = useState("");

  console.log(window.innerWidth);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      setIsSignedIn(true);
    } else {
      // No user is signed in.
      setIsSignedIn(false);
    }
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let data = [];
    let titles = [];
    db.collection("movies")
      .orderBy("created", "desc")
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          data.push(doc.data());
          titles.push(doc.data().title);
        });
      });
    setMovieData(data);
    setTitles(titles);
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

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
          poster: newMovieAdded.poster,
          created: firebase.firestore.Timestamp.now()
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
    if (movieDeleted !== "") {
      db.collection("movies")
        .doc(movieDeleted)
        .delete()
        .then(function() {
          console.log("Movie successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing movie: ", error);
        });
    }
  }, [movieDeleted]);

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
          } else {
            setNotFound(true);
            setTimeout(() => setNotFound(false), 2500);
          }
        })
        .catch(error => {
          console.log(error);
          setNotFound(true);
          setTimeout(() => setNotFound(false), 2500);
        });
    } else {
      setAlreadyAdded(true);
      setTimeout(() => setAlreadyAdded(false), 2500);
    }
  }

  function handleDeleteMovie(title) {
    const updatedMovies = movieData.filter(
      eachMovie => eachMovie.title !== title
    );
    const updatedTitles = titles.filter(eachTitle => eachTitle !== title);
    setTitles(updatedTitles);
    setMovieData(updatedMovies);
    setMovieDeleted(title);
  }

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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
            handleDeleteMovieCallback={handleDeleteMovie}
            isSignedIn={isSignedIn}
          />
        ))}
      </div>
    );
  }

  function handleSignOut() {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
        console.log("signed out");
      })
      .catch(function(error) {
        // An error happened.
        console.log(error);
      });
  }

  function handleSignIn(email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        // Handle Errors here.
        console.log(error.code);
        setSignInError("There was an error with these credentials");
        setTimeout(() => setSignInError(""), 2500);
      });
  }

  let addMovie = (
    <div>
      <SignIn handleSignInCallback={handleSignIn} signInError={signInError}>
        Sign In
      </SignIn>
    </div>
  );
  if (isSignedIn) {
    addMovie = (
      <div>
        <AddMovie
          handleAddMovieCallback={handleAddMovie}
          handleSignOutCallback={handleSignOut}
          alreadyAdded={alreadyAdded}
          notFound={notFound}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <h2 className="title">Movies to watch!</h2>
      <Main>
        {addMovie}
        {main}
      </Main>
    </div>
  );
};

export default App;
