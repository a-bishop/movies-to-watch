import React, { useEffect, useState } from 'react';
import './App.css';

import Movie from './Movie';
import AddMovie from './AddMovie';
import SignIn from './SignIn';
import ToggleContent from './ToggleContent';
import MyModal from './MyModal';
import { SyncLoader } from 'react-spinners';
import styled, { css, keyframes } from 'styled-components';
import firebase from 'firebase/app';
import config from './config';
import 'firebase/firestore';
import 'firebase/auth';

// const config = {
//   IMDB_KEY: process.env.REACT_APP_imdbApiKey,
//   FIREBASE: {
//     apiKey: process.env.REACT_APP_firebaseApiKey,
//     authDomain: process.env.REACT_APP_firebaseAuthDomain,
//     databaseURL: process.env.REACT_APP_firebaseDatabaseUrl,
//     projectId: process.env.REACT_APP_firebaseProjectId,
//     storageBucket: process.env.REACT_APP_firebaseStorageBucket,
//     messagingSenderId: process.env.REACT_APP_firebaseMessagingSenderId,
//     appId: process.env.REACT_APP_firebaseAppId
//   }
// };

const FIREBASE = config.FIREBASE;
firebase.initializeApp(FIREBASE);
const db = firebase.firestore();
const API_KEY = config.IMDB_KEY;

const Main = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 1em;
`;

const Title = styled.h2`
  margin: 0;
`;

const Sort = styled.div`
  margin-left: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding-top: 0
  width: 300px;
  display: flex;
  align-items: center;
`;

const Select = styled.select`
  height: 35px;
  background: lightGray;
  background-image: none;
  padding: 5px 10px 5px 10px;
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
  padding: 8px;
  width: 90px;
  font-size: 0.8em;
  font-family: Futura;
`;

const LoadMore = styled.div`
  background: darkKhaki;
  border: 2px solid black;
  text-align: center;
  margin: 1rem;
  padding: 1rem;
  cursor: pointer;
`;

const SelectMenuTitle = styled.h4`
  width: 90px;
  margin: 0;
`;

const rotateLeft = keyframes`
  from {
    transform: rotate(45deg);
  }
  to {
    transform: rotate(135deg);
  }
`;

const DownArrow = styled.i`
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  ${props => {
    if (props.animate)
      return css`
        animation: ${rotateLeft} 0.25s linear;
        animation-fill-mode: forwards;
      `;
  }}
`;

const WatchListContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 130px;
  cursor: pointer;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MessageContainer = styled.div`
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  border-radius: 5px;
  z-index: 3;
  ${props => {
    let color = [];
    if (!props.type) return;
    else {
      switch (props.type) {
        case 'error':
          color = 'rgba(255, 218, 224, 0.7)';
          break;
        case 'warn':
          color = 'rgba(229,229,116,0.7)';
          break;
        case 'alert':
        default:
          color = 'rgba(201, 226, 222, 0.9)';
          break;
      }
      return css`
        padding: 10px;
        background-color: ${color};
      `;
    }
  }}
  @media only screen and (max-width: 500px) {
    width: 80%;
  }
`;

const NoWatchListMsg = styled.h4`
  padding: 0 2em 1em 2em;
`;

const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin: -10px 0;

  > * {
    margin: 10px 0;
  }
`;

const Search = styled.input`
  margin-right: 2em;
  font-family: Futura;
  min-width: 200px;
  border: 1px solid black;
  height: 2.5em;
`;

const App = () => {
  const [titles, setTitles] = useState([]);
  const [movieData, setMovieData] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [newMovieAdded, setNewMovieAdded] = useState('');
  const [movieToDelete, setMovieToDelete] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signInError, setSignInError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [messageType, setMessageType] = useState(null);
  const [sortSelected, setSortSelected] = useState('');
  const [currUser, setCurrUser] = useState('');
  const [filterSelected, setFilterSelected] = useState('');
  const [limit, setLimit] = useState(10);
  const [users, setUsers] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const [shouldArrowAnimate, setShouldArrowAnimate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // function usePrevious(value) {
  //   const ref = useRef();
  //   useEffect(() => {
  //     ref.current = value;
  //   }, [value]);
  //   return ref.current;
  // }

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      setIsSignedIn(true);
      setCurrUser(firebase.auth().currentUser.displayName);
    } else {
      setIsSignedIn(false);
      setCurrUser('Guest');
    }
  });

  // const prevWatchList = usePrevious(watchList);
  // const prevMovieData = usePrevious(movieData);
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('watchList', JSON.stringify(watchList));
      localStorage.setItem('movieData', JSON.stringify(movieData));
    }
  });

  useEffect(() => {
    let data = [];
    let titles = [];
    async function getMovies() {
      const moviesStored = JSON.parse(localStorage.getItem('movieData'));
      if (moviesStored) {
        setMovieData(moviesStored);
        titles = moviesStored.map(movie => movie.title);
        setTitles(titles);
        return;
      }
      await db
        .collection('movies')
        .orderBy('created', 'desc')
        .get()
        .then(querySnapshot => {
          if (!querySnapshot) console.log('error getting movies');
          querySnapshot.forEach(doc => {
            const docData = doc.data();
            const id = doc.id;
            const avgRating = getAvgRatings(docData.ratings);
            const allData = { ...docData, id, avgRating };
            data.push(allData);
            titles.push(docData.title);
          });
          setTitles(titles);
          setMovieData(data);
        });
    }

    async function getUsersAndWatchList() {
      if (currUser) {
        let watchListData = [];
        if (currUser === 'Guest') {
          try {
            watchListData = JSON.parse(localStorage.getItem('watchList'));
          } catch (e) {
            console.log(e);
          }
        }
        let users = [];
        await db
          .collection('users')
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(user => {
              const data = user.data();
              users.push(data.displayName);
              if (currUser === data.displayName) {
                if (data.watchList) {
                  data.watchList.forEach(movie => watchListData.push(movie));
                }
              }
            });
            setUsers(users);
            setWatchList(watchListData);
          });
      }
    }

    getMovies()
      .then(getUsersAndWatchList())
      .then(setIsLoading(false))
      .catch(error =>
        console.log('Error retrieving movies or user data', error)
      );
  }, [currUser]);

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
    if (newMovieAdded !== '' && currUser) {
      const {
        title,
        year,
        genre,
        director,
        actors,
        plot,
        ratings,
        poster,
        created,
        creator
      } = newMovieAdded;
      db.collection('movies')
        .add({
          title,
          year,
          genre,
          director,
          actors,
          plot,
          ratings,
          poster,
          created,
          creator
        })
        .then(docRef => {
          // add the id and avg rating to the movie object client-side
          newMovieAdded.id = docRef.id;
          newMovieAdded.avgRating = getAvgRatings(newMovieAdded.ratings);
          setMovieData(movieData => [newMovieAdded, ...movieData]);
          handleSetActionMessage('Movie Added!', 'alert');
        })
        .catch(error => {
          console.error('Error adding document: ', error);
        });
    }
  }, [newMovieAdded, currUser]);

  function handleTryDeleteMovie(movie) {
    setMovieToDelete(movie);
  }

  useEffect(() => {
    if (movieToDelete !== '') {
      db.collection('movies')
        .doc(movieToDelete.id)
        .delete()
        .then(function() {
          handleDeleteMovie(movieToDelete);
          handleSetActionMessage('Movie successfully deleted!', 'alert');
        })
        .catch(function(error) {
          handleSetActionMessage(`Error removing movie: ${error}`, 'error');
        });
    }
    function handleDeleteMovie(movie) {
      const updatedMovies = movieData.filter(
        eachMovie => eachMovie.id !== movie.id
      );
      const updatedTitles = titles.filter(
        eachTitle => eachTitle !== movie.title
      );
      setTitles(updatedTitles);
      setMovieData(updatedMovies);
      setMovieToDelete('');
    }
  }, [movieData, movieToDelete, titles]);

  function handleAddMovie([movie, year]) {
    setAlreadyAdded(false);
    setNotFound(false);
    const movieSearchString = movie.trim().replace(' ', '+');
    const movieCapitalized = capitalize(movie);
    if (!titles.includes(movieCapitalized)) {
      const url = `https://www.omdbapi.com/?t=${movieSearchString}&y=${year}&plot=full&apikey=${API_KEY}`;
      fetch(url)
        .then(res => res.json())
        .then(json => {
          if (json.Response === 'True') {
            const newMovie = {
              title: json.Title,
              year: json.Year,
              genre: json.Genre,
              director: json.Director,
              actors: json.Actors,
              plot: json.Plot,
              ratings: json.Ratings,
              poster: json.Poster,
              created: firebase.firestore.Timestamp.now(),
              creator: currUser
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

  function handleSetActionMessage(msg, type) {
    setMessageType(type);
    setActionMessage(msg);
    setTimeout(() => {
      setActionMessage('');
      setMessageType(null);
    }, 2500);
  }

  async function getFirebaseUserDocId() {
    let id;
    await db
      .collection('users')
      .where('displayName', '==', currUser)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          id = doc.id;
        });
      })
      .catch(function(error) {
        console.log('Error getting id: ', error);
      });
    return id;
  }

  async function updateFirebaseWatchList(id, movies) {
    await db
      .collection('users')
      .doc(id)
      .update({ watchList: movies })
      .catch(function(error) {
        console.log('Error updating watchList: ', error);
      });
  }

  async function handleAddToWatchlist(event) {
    if (!watchList.includes(event.title)) {
      const newWatchList = watchList;
      newWatchList.push(event.title);
      setWatchList(newWatchList);
      handleSetActionMessage(
        `${event.title} was added to your watchlist!`,
        'alert'
      );
      if (currUser !== 'Guest') {
        const id = await getFirebaseUserDocId();
        await updateFirebaseWatchList(id, newWatchList);
      }
    } else {
      handleSetActionMessage(
        `${event.title} is already in your watchlist!`,
        'warn'
      );
    }
  }

  async function handleRemoveFromWatchList(event) {
    const watchListCopy = watchList;
    const movies = watchListCopy.filter(movie => movie !== event.title);
    setWatchList(movies);
    handleSetActionMessage(
      `${event.title} has been removed from your watchlist!`,
      'warn'
    );
    if (currUser !== 'Guest') {
      const id = await getFirebaseUserDocId();
      await updateFirebaseWatchList(id, movies);
    }
  }

  function capitalize(string) {
    return string.replace(/\b\w/g, l => l.toUpperCase());
  }

  async function handleSignIn(email, password) {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        console.log(error.code);
        setSignInError('There was an error with these credentials');
        setTimeout(() => setSignInError(''), 2500);
      });
    const user = firebase.auth().currentUser;
    if (user) setCurrUser(user.displayName);
  }

  async function handleSignOut() {
    await firebase
      .auth()
      .signOut()
      .then(function() {
        console.log('signed out');
      })
      .catch(function(error) {
        console.log('Error with sign out', error);
      });
    setCurrUser(null);
  }

  useEffect(() => {
    let newData = [...movieData];
    switch (sortSelected) {
      case 'dateAdded':
        newData.sort((a, b) => (a.created > b.created ? -1 : 1));
        setMovieData(newData);
        break;
      case 'releaseYear':
        newData.sort((a, b) => (a.year > b.year ? -1 : 1));
        setMovieData(newData);
        break;
      case 'title':
        newData.sort((a, b) => (a.title > b.title ? 1 : -1));
        setMovieData(newData);
        break;
      case 'avgRating':
        newData.sort((a, b) =>
          parseFloat(a.avgRating) > parseFloat(b.avgRating) ? -1 : 1
        );
        setMovieData(newData);
        break;
      default:
        break;
    }
    setSortSelected('');
  }, [movieData, sortSelected]);

  function handleShouldArrowAnimate() {
    setShouldArrowAnimate(true);
  }

  let mainData = null;
  let currentlyViewing = (
    <div style={{ padding: '50px 0 0 50px' }}>
      <SyncLoader sizeUnit={'px'} size={30} color={'darkKhaki'} />
    </div>
  );
  if (!isLoading) {
    const re = new RegExp(searchTerm, 'i');
    mainData = movieData.filter(
      movie =>
        re.test(movie.title) &&
        (filterSelected === '' || movie.creator === filterSelected)
    );

    currentlyViewing = mainData.slice(0, limit).map(movie => {
      return (
        <Movie
          key={movie.id}
          {...movie}
          currUser={currUser}
          onDeleteMovieCallback={handleTryDeleteMovie}
          onAddToWatchlistCallback={handleAddToWatchlist}
          isSignedIn={isSignedIn}
          isModal={false}
        />
      );
    });
  }

  let loadMoreButton;
  if (!isLoading && limit <= movieData.length && mainData.length > 10) {
    loadMoreButton = (
      <LoadMore onClick={() => setLimit(limit => limit + 10)}>
        Load More ...
      </LoadMore>
    );
  }

  let message = (
    <MessageContainer type={messageType}>
      <span>{actionMessage}</span>
    </MessageContainer>
  );

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

  let displayUser = null;
  if (currUser) {
    displayUser = (
      <span
        style={{ fontSize: '.7em', fontWeight: 'normal', whiteSpace: 'nowrap' }}
      >
        &nbsp;Hello, {currUser}
      </span>
    );
  }

  let modalContent = (
    <NoWatchListMsg>
      You have not yet added any movies to your watchlist.
    </NoWatchListMsg>
  );
  if (watchList && watchList.length > 0) {
    const watchListData = movieData.filter(movie =>
      watchList.includes(movie.title)
    );
    modalContent = watchListData.map(movie => (
      <Movie
        key={movie.id}
        {...movie}
        currUser={currUser}
        filter={filterSelected}
        onDeleteMovieCallback={handleTryDeleteMovie}
        onRemoveFromWatchlistCallback={handleRemoveFromWatchList}
        isSignedIn={isSignedIn}
        isModal={true}
      ></Movie>
    ));
  }

  return (
    <div className="App">
      {message}
      <TitleContainer>
        <FlexContainer>
          <Flex>
            <Title>Movies to watch! {displayUser}</Title>
          </Flex>
          <Flex>
            <Search
              type="text"
              name="Search"
              placeholder="Search for a movie"
              onChange={e => setSearchTerm(e.target.value)}
            />
            <ToggleContent
              toggle={show => (
                <div onClick={handleShouldArrowAnimate}>
                  <WatchListContainer onClick={show}>
                    <h4 style={{ margin: '0' }}>My watchlist</h4>
                    <p>
                      <DownArrow animate={shouldArrowAnimate}></DownArrow>
                    </p>
                  </WatchListContainer>
                </div>
              )}
              content={hide => (
                <MyModal
                  modalDismissedCallback={() => setShouldArrowAnimate(false)}
                  hide={hide}
                >
                  <ModalContainer>{modalContent}</ModalContainer>
                </MyModal>
              )}
            />
          </Flex>
        </FlexContainer>
        {signOut}
      </TitleContainer>
      <Main>
        {addMovie}
        <div style={{ flex: '1 1 70%' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap'
            }}
          >
            <Sort>
              <SelectMenuTitle>Editors' Picks:</SelectMenuTitle>
              <Select onChange={e => setFilterSelected(e.target.value)}>
                <option value="">All</option>
                {users.map(user => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </Select>
            </Sort>
            <Sort>
              <SelectMenuTitle>Sort by:</SelectMenuTitle>
              <Select onChange={e => setSortSelected(e.target.value)}>
                <option value="dateAdded">Recently Added</option>
                <option value="avgRating">Top Rated</option>
                <option value="releaseYear">Release Year</option>
                <option value="title">Titles A-Z</option>
              </Select>
            </Sort>
          </div>
          {currentlyViewing}
          {loadMoreButton}
        </div>
      </Main>
    </div>
  );
};

export default App;
