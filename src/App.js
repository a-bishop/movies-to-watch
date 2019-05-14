import React, { useEffect, useState } from "react";
import "./App.css";
import Movie from "./Movie";
import AddMovie from "./AddMovie";
import SignIn from "./SignIn";
import config from "./config";
import { SyncLoader } from "react-spinners";
import styled from "styled-components";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const FIREBASE = config.FIREBASE;
firebase.initializeApp(FIREBASE);
const db = firebase.firestore();
const API_KEY = config.IMDB_KEY;

const Main = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  margin-left: 1rem;
  margin-bottom: 5px;
`;

const Sort = styled.div`
  margin-left: 20px;
  width: 260px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Select = styled.select`
  background: lightGray;
  background-image: none;
  padding: 5px 10px 5px 10px;
  height: 100%;
  font-family: Futura;
  font-size: 1em;
  cursor: pointer;
  border: 1px solid black;
  border-radius: 5px;
  flex-basis: 65%;
`;

const SignOut = styled.button`
  border: 1px solid black;
  border-radius: 5px;
  background: mistyRose;
  margin-top: 10px;
  margin-left: 20px;
  padding: 8px;
  width: 90px;
  font-size: 0.8em;
  font-family: Futura;
`;

const App = () => {
  const [titles, setTitles] = useState([]);
  const [movieData, setMovieData] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [newMovieAdded, setNewMovieAdded] = useState("");
  const [movieToDelete, setMovieToDelete] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signInError, setSignInError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [sortSelected, setSortSelected] = React.useState("");

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
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
    let data = [];
    let titles = [];
    async function getMovies() {
      await db
        .collection("movies")
        .orderBy("created", "desc")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const docData = doc.data();
            const id = doc.id;
            const avgRating = getAvgRatings(docData.ratings);
            const allData = { ...docData, id, avgRating };
            data.push(allData);
            titles.push(doc.data().title);
          });
        });
      await setMovieData(data);
      await setTitles(titles);
    }
    getMovies().catch(error => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAvgRatings = ratings => {
    let ratingTotal = 0;
    let numRatings = ratings.length;
    for (const rating of ratings) {
      let doubleVal = parseFloat(rating.Value);
      if (doubleVal <= 10) {
        doubleVal *= 10;
      }
      ratingTotal += doubleVal;
    }
    let avgRating = (ratingTotal / numRatings).toFixed(2);
    return avgRating;
  };

  useEffect(() => {
    if (newMovieAdded !== "") {
      const {
        title,
        year,
        genre,
        director,
        actors,
        plot,
        ratings,
        poster,
        created
      } = newMovieAdded;
      db.collection("movies")
        .add({
          title,
          year,
          genre,
          director,
          actors,
          plot,
          ratings,
          poster,
          created
        })
        .then(function(docRef) {
          console.log("Document written!", docRef.id);
          newMovieAdded.id = docRef.id;
          newMovieAdded.avgRating = getAvgRatings(newMovieAdded.ratings);
          setMovieData(movieData => [newMovieAdded, ...movieData]);
          setActionMessage("Movie Added!");
          setTimeout(() => setActionMessage(""), 1500);
        })
        .catch(function(error) {
          console.error("Error adding document: ", error);
        });
    }
  }, [newMovieAdded]);

  useEffect(() => {
    if (movieToDelete !== "") {
      console.log(movieToDelete);
      db.collection("movies")
        .doc(movieToDelete.id)
        .delete()
        .then(function() {
          handleDeleteMovie(movieToDelete);
          setActionMessage("Movie successfully deleted!");
          setTimeout(() => setActionMessage(""), 1500);
          console.log("Movie successfully deleted!");
        })
        .catch(function(error) {
          setActionMessage("Error removing movie: ", error);
          setTimeout(() => setActionMessage(""), 1500);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieToDelete]);

  function handleTryDeleteMovie(movie) {
    setMovieToDelete(movie);
  }

  function handleDeleteMovie(movie) {
    const updatedMovies = movieData.filter(
      eachMovie => eachMovie.id !== movie.id
    );
    const updatedTitles = titles.filter(eachTitle => eachTitle !== movie.title);
    setTitles(updatedTitles);
    setMovieData(updatedMovies);
  }

  function handleAddMovie([movie, year]) {
    setAlreadyAdded(false);
    setNotFound(false);
    movie = movie.trim();
    const movieCapitalized = capitalize(movie);
    const movieSearchString = movie.replace(" ", "+");
    if (!titles.includes(movieCapitalized)) {
      const url = `https://www.omdbapi.com/?t=${movieSearchString}&y=${year}&plot=full&apikey=${API_KEY}`;
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
              poster: json.Poster,
              created: firebase.firestore.Timestamp.now()
            };
            setTitles(titles => [newMovie.title, ...titles]);
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

  function capitalize(string) {
    return string.replace(/\b\w/g, l => l.toUpperCase());
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

  useEffect(() => {
    let newData = [...movieData];
    switch (sortSelected) {
      case "dateAdded":
        newData.sort((a, b) => (a.created > b.created ? -1 : 1));
        setMovieData(newData);
        break;
      case "releaseYear":
        newData.sort((a, b) => (a.year > b.year ? -1 : 1));
        setMovieData(newData);
        break;
      case "title":
        newData.sort((a, b) => (a.title > b.title ? 1 : -1));
        setMovieData(newData);
        break;
      case "avgRating":
        newData.sort((a, b) =>
          parseFloat(a.avgRating) > parseFloat(b.avgRating) ? -1 : 1
        );
        setMovieData(newData);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortSelected]);

  let main = (
    <div style={{ padding: "50px 0 0 50px" }}>
      <SyncLoader sizeUnit={"px"} size={40} color={"darkKhaki"} />
    </div>
  );
  if (!isLoading) {
    main = (
      <div>
        {movieData.map((movie, i) => {
          return (
            <Movie
              key={movie.id}
              title={movie.title}
              year={movie.year}
              genre={movie.genre}
              director={movie.director}
              actors={movie.actors}
              plot={movie.plot}
              ratings={movie.ratings}
              poster={movie.poster}
              id={movie.id}
              avgRating={movie.avgRating}
              onDeleteMovieCallback={handleTryDeleteMovie}
              isSignedIn={isSignedIn}
            />
          );
        })}
      </div>
    );
  }

  let message = <p style={{ margin: "0 0 0 20px" }}>{actionMessage}</p>;

  let addMovie = (
    <div>
      <SignIn handleSignInCallback={handleSignIn} signInError={signInError}>
        Sign In
      </SignIn>
    </div>
  );
  let signOut = null;
  if (isSignedIn) {
    addMovie = (
      <div>
        <AddMovie
          handleAddMovieCallback={handleAddMovie}
          alreadyAdded={alreadyAdded}
          notFound={notFound}
        />
      </div>
    );
    signOut = <SignOut onClick={handleSignOut}>Sign Out</SignOut>;
  }

  return (
    <div className="App">
      {/* <style
        contentEditable
        style={{ display: "block" }}
        dangerouslySetInnerHTML={{
          __html: `
          .Submit { margin-top: 1.5em; } 
    `
        }}
      /> */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start"
        }}
      >
        <Title>Movies to watch!</Title>
        {signOut}
      </div>
      <Main>
        {addMovie}
        <div style={{ flex: "1 1 70%" }}>
          <Sort>
            <h4>Sort by:</h4>
            <Select onChange={e => setSortSelected(e.target.value)}>
              <option value="dateAdded">Recently Added</option>
              <option value="avgRating">Top Rated</option>
              <option value="releaseYear">Release Year</option>
              <option value="title">Titles A-Z</option>
            </Select>
          </Sort>
          {message}
          {main}
        </div>
      </Main>
    </div>
  );
};

export default App;
