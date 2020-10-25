import React, { useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import styled, { css, keyframes } from 'styled-components';
// import testData from './test-data';
import firebase from 'firebase/app';
import config from './config';
import 'firebase/firestore';
import 'firebase/auth';

import './App.css';
import Movie from './Movie';
import AddMovie from './AddMovie';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import ToggleContent from './ToggleContent';
import MyModal from './MyModal';
import { capitalize, toSearchString, regEx } from './helpers';
// import { useInView } from 'react-hook-inview';

firebase.initializeApp(config.FIREBASE);
const db = firebase.firestore();

const Main = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const Title = styled.h1`
  margin: 0 1rem 0 0;
`;

const Sort = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  padding-top: 0;
  width: 300px;
  display: flex;
  align-items: center;

  @media (max-width: 700px) {
    width: 100%;
  }
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
  flex-grow: 2;
`;

const SignOut = styled.button`
  flex: 1;
  border: 1px solid black;
  border-radius: 5px;
  background: mistyRose;
  padding: 8px;
  width: 90px;
  font-size: 0.8em;
  font-family: Futura;
`;

const SignInSignUpWrapper = styled.div`
  display: flex;
`

// const LoadMore = styled.div`
//   background: darkKhaki;
//   border: 2px solid black;
//   text-align: center;
//   margin: 1rem;
//   padding: 1rem;
//   cursor: pointer;
// `;

const SelectMenuTitle = styled.h4`
  width: 90px;
  margin: 0 0 0 1em;
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
  ${(props) => {
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
  ${(props) => {
    let color = 'rgba(201, 226, 222, 0.9)';
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
          break;
      }
      return css`
        padding: 10px;
        background-color: ${color};
      `;
    }
  }}
  @media only screen and (max-width: 700px) {
    width: 80%;
  }
`;

const NoWatchListMsg = styled.h4`
  padding: 0 2em 1em 2em;
  height: 100px;
`;

const Flex = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const SortFlex = styled(Flex)`
  justify-content: flex-end;
  flex: 1.5;
`;

const FlexHeader = styled(Flex)`
  width: 100%;
  margin: 0 0 1rem 0;
`;

const Search = styled.input`
  flex: 0.8;
  padding-left: 0.5em;
  font-family: Futura;
  border: 1px solid black;
  height: 2.5rem;
  /* margin-left: auto; */
  /* @media only screen and (min-width: 700px) {
    max-width: 600px;
  } */
`;

const WelcomeMsg = styled.span`
  font-weight: 'normal';
  white-space: 'nowrap';
  margin-right: 10px;
`;

// let renderCount = 0;
const env = process.env.NODE_ENV;
const isDev = env === 'development';

const App = () => {
  const [titles, setTitles] = useState([]);
  const [movieData, setMovieData] = useState([]); //env === 'development' ? testData :
  const [notFound, setNotFound] = useState(false);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [newMovieAdded, setNewMovieAdded] = useState('');
  const [movieToDelete, setMovieToDelete] = useState('');
  const [isLoading, setIsLoading] = useState(true); // env === 'development' ? false :
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signInError, setSignInError] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [passwordResetError, setPasswordResetError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [messageType, setMessageType] = useState(null);
  const [sortSelected, setSortSelected] = useState('');
  const [currUser, setCurrUser] = useState('');
  const [filterSelected, setFilterSelected] = useState('');
  // const [limit, setLimit] = useState(10);
  const [users, setUsers] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const [movieAddedToWatchList, setMovieAddedToWatchList] = useState(false);
  const [shouldArrowAnimate, setShouldArrowAnimate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [shouldDismissModal, setShouldDismissModal] = useState(false);
  const [firebaseUserId, setFirebaseUserId] = useState(null);
  const [moviesLastUpdatedAt, setMoviesLastUpdatedAt] = useState(null);
  const [shouldFetchMovies, setShouldFetchMovies] = useState(false);
  const [finishedStorageCheck, setFinishedStorageCheck] = useState(false);
  const [hasRetrievedInitialMovieData, setHasRetrievedInitialMovieData] = useState(false);

  // const [loadMoreRef] = useInView({
  //   onEnter: () => setTimeout(() => setLimit((limit) => (limit += 10)), 300),
  //   threshold: 1,
  // });

  if (isDev) {
    // renderCount +=1;
    // console.log('render count', renderCount);
  }

  firebase.auth().onAuthStateChanged((user) => {
    const currentUser = firebase.auth().currentUser;
    if (user && user.emailVerified) {
      setIsSignedIn(true);
      setCurrUser(currentUser.displayName);
    } else {
      setIsSignedIn(false);
      setCurrUser('Guest');
    }
  });

  useEffect(() => {
    async function checkFBLastUpdated() {
      let firebaseMoviesLastUpdated;
      const storageMoviesLastUpdated = localStorage.getItem('moviesLastUpdatedAt');
      await db
        .collection('meta')
        .doc('lastUpdated')
        .get()
        .then((doc) => {
          const lastUpdated = doc.data();
          firebaseMoviesLastUpdated = lastUpdated.movies;
        })
        .catch((e) => {
          console.error(e);
          return;
        });
      if (!storageMoviesLastUpdated || firebaseMoviesLastUpdated > storageMoviesLastUpdated) {
        setShouldFetchMovies(true);
      }
      setMoviesLastUpdatedAt(firebaseMoviesLastUpdated);
      setFinishedStorageCheck(true);
    }
    checkFBLastUpdated();
  }, []);

  useEffect(() => {
    if (moviesLastUpdatedAt)
      localStorage.setItem('moviesLastUpdatedAt', JSON.stringify(moviesLastUpdatedAt));
    if (movieData && movieData.length) localStorage.setItem('movieData', JSON.stringify(movieData));
    if (!isLoading && movieAddedToWatchList)
      localStorage.setItem('watchList', JSON.stringify(watchList));
  }, [movieData, moviesLastUpdatedAt, isLoading, watchList, movieAddedToWatchList]);

  useEffect(() => {
    if (finishedStorageCheck) {
      if (shouldFetchMovies) {
        async function getMovies() {
          if (isDev) console.log('getting from remote');
          db.collection('movies')
            .orderBy('created', 'desc')
            .get()
            .then((querySnapshot) => {
              let data = [];
              let movieTitles = [];
              if (!querySnapshot) console.log('error getting movies');
              else {
                querySnapshot.forEach((doc) => {
                  const docData = doc.data();
                  const id = doc.id;
                  const avgRating = getAvgRatings(docData.ratings);
                  const allData = { ...docData, id, avgRating };
                  data.push(allData);
                  movieTitles.push(docData.title);
                });
                setMovieData(data);
              }
            })
            .catch((e) => {
              console.error(e);
            });
        }

        getMovies()
          .then(setHasRetrievedInitialMovieData(true))
          .catch((error) => console.log('Error retrieving movie data', error));
      } else {
        if (isDev) console.log('getting from storage');
        setMovieData(JSON.parse(localStorage.getItem('movieData')));
        setSortSelected('dateAdded');
        setHasRetrievedInitialMovieData(true);
      }
    }
  }, [shouldFetchMovies, finishedStorageCheck]);

  useEffect(() => {
    if (movieData && movieData.length) {
      setTitles(movieData.map((movie) => movie.title));
    }
  }, [movieData]);

  useEffect(() => {
    if (
      firebaseUserId &&
      movieData &&
      currUser !== 'Guest' &&
      movieData.filter((movie) => movie.creator === currUser).length <= 1
    ) {
      const isActive = movieData.filter((movie) => movie.creator === currUser).length !== 0;
      db.collection('users')
        .doc(firebaseUserId)
        .update({ isActive })
        .then(() => {
          let newUsers;
          if (isActive) newUsers = [currUser, ...users];
          else newUsers = users.filter((user) => user !== currUser);
          setUsers(newUsers);
        })
        .catch(function (error) {
          console.log('Error updating user active: ', error);
        });
    }
  }, [users, firebaseUserId, currUser, hasRetrievedInitialMovieData, movieData]);

  useEffect(() => {
    if (isLoading && currUser && hasRetrievedInitialMovieData) {
      async function getUsersAndWatchList() {
        let activeUsers = [];
        let watchListData = [];
        if (currUser === 'Guest') {
          watchListData = JSON.parse(localStorage.getItem('watchList')) || [];
        }
        await db
          .collection('users')
          .get()
          .then(async (querySnapshot) => {
            await querySnapshot.forEach((user) => {
              const data = user.data();
              if (data.isActive) activeUsers.push(data.displayName);
              if (currUser === data.displayName) {
                if (data.watchList) {
                  data.watchList.forEach((movie) => watchListData.push(movie));
                }
              }
            });
            setUsers(activeUsers);
            setWatchList(watchListData);
          });
      }
      getUsersAndWatchList().catch((error) => console.log('Error retrieving user data', error));
      setIsLoading(false);
    }
  }, [currUser, isLoading, hasRetrievedInitialMovieData]);

  // Gets the average rating from ratings systems
  // ie. IMdB, Rotten Tomatoes and Metacritic
  const getAvgRatings = (ratings) => {
    let ratingTotal = 0;
    let numRatings = ratings.length;
    for (const rating of ratings) {
      let doubleVal = parseFloat(rating.Value);
      if (doubleVal <= 10) doubleVal *= 10;
      ratingTotal += doubleVal;
    }
    return (ratingTotal / numRatings).toFixed(2);
  };

  const setMoviesLastUpdated = () => {
    const now = Date.now();
    db.collection('meta')
      .doc('lastUpdated')
      .set({ movies: now })
      .catch((e) => console.log(e));
    setMoviesLastUpdatedAt(now);
  };

  useEffect(() => {
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
      creator,
    } = newMovieAdded;
    if (newMovieAdded !== '' && currUser) {
      setNewMovieAdded('');
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
          creator,
        })
        .then((doc) => {
          handleSetActionMessage('Movie Added!', 'alert');
          const id = doc.id;
          const avgRating = getAvgRatings(newMovieAdded.ratings);
          const newMovie = { ...newMovieAdded, id, avgRating };
          const newData = [newMovie, ...movieData];
          setMovieData(newData);
          setMoviesLastUpdated();
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    }
  }, [newMovieAdded, currUser, movieData]);

  useEffect(() => {
    if (movieToDelete !== '') {
      db.collection('movies')
        .doc(movieToDelete.id)
        .delete()
        .then(() => {
          setMovieToDelete('');
          handleSetActionMessage('Movie successfully deleted!', 'alert');
          const newData = movieData.filter((movie) => movie.title !== movieToDelete.title);
          setMovieData(newData);
          setMoviesLastUpdated();
        })
        .catch(function (error) {
          handleSetActionMessage(`Error removing movie: ${error}`, 'error');
        });
    }
  }, [movieToDelete, movieData]);

  function handleAddMovie([movie, year]) {
    setAlreadyAdded(false);
    setNotFound(false);
    if (!titles.includes(capitalize(movie))) {
      const url = `https://www.omdbapi.com/?t=${toSearchString(movie)}&y=${year}&plot=full&apikey=${
        config.OMDB_KEY
      }`;
      fetch(url)
        .then((res) => res.json())
        .then((json) => {
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
              creator: currUser,
            };
            setNewMovieAdded(newMovie);
          } else {
            setNotFound(true);
            setTimeout(() => setNotFound(false), 2500);
          }
        })
        .catch((error) => {
          console.log(error);
          setNotFound(true);
          setTimeout(() => setNotFound(false), 2500);
        });
    } else {
      setAlreadyAdded(true);
      setTimeout(() => setAlreadyAdded(false), 2500);
    }
  }

  function handleSetActionMessage(msg, type, timer = 2500) {
    setMessageType(type);
    setActionMessage(msg);
    setTimeout(() => {
      setActionMessage('');
      setMessageType(null);
    }, timer);
  }

  async function updateFirebaseWatchList(id, movies) {
    await db
      .collection('users')
      .doc(id)
      .set({ watchList: movies })
      .catch(function (error) {
        console.log('Error updating watchList: ', error);
      });
  }

  async function handleAddToWatchlist(event) {
    if (!watchList.includes(event.title)) {
      const newWatchList = watchList;
      newWatchList.push(event.title);
      setWatchList(newWatchList);
      localStorage.setItem('watchList', JSON.stringify(newWatchList));
      setMovieAddedToWatchList(true);
      handleSetActionMessage(`${event.title} was added to your watchlist!`, 'alert');
      if (currUser !== 'Guest') {
        await updateFirebaseWatchList(firebaseUserId, newWatchList);
      }
    } else {
      handleSetActionMessage(`${event.title} is already in your watchlist!`, 'warn');
    }
  }

  async function handleRemoveFromWatchList(event) {
    const watchListCopy = watchList;
    const movies = watchListCopy.filter((movie) => movie !== event.title);
    setWatchList(movies);
    localStorage.setItem('watchList', JSON.stringify(movies));
    if (currUser !== 'Guest') {
      await updateFirebaseWatchList(firebaseUserId, movies);
      localStorage.setItem('watchList', JSON.stringify(watchList));
    }
  }

  async function handleSignUp(name, email, password) {
    let userNameExists = false;
    if (name.length < 3) {
      setSignUpError(`Your name needs to be at least three letters`);
      setTimeout(() => setSignUpError(''), 2500);
      return;
    }
    await db
      .collection('users')
      .where('displayName', '==', name)
      .limit(1)
      .get()
      .then(function (snap) {
        snap.forEach((doc) => {
          if (doc.exists) {
            userNameExists = true;
            setSignUpError(
              `Please add your last initial to your name. A user with your name already exists!`
            );
            setTimeout(() => setSignUpError(''), 2500);
          }
        });
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
    if (userNameExists) return;
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function (error) {
        setSignUpError(`There was an error signing up: ${error}`);
        setTimeout(() => setSignUpError(''), 2500);
      });
    const user = firebase.auth().currentUser;
    if (user) {
      user
        .updateProfile({
          displayName: name,
        })
        .then(function () {
          console.log('success');
        });
      user
        .sendEmailVerification()
        .then(function () {
          handleSetActionMessage("Welcome! We've sent you an email confirmation!", 'alert', 5000);
          setShouldDismissModal(true);
          setShouldDismissModal(false);
        })
        .catch(function (error) {
          setSignUpError(`There was an error signing up: ${error}`);
          setTimeout(() => setSignUpError(''), 2500);
        });
    }

    handleSignOut();
  }

  function handleSendPasswordReset(email) {
    var auth = firebase.auth();

    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        handleSetActionMessage("We've sent you a password reset email", 'alert', 5000);
        setShouldDismissModal(true);
        setShouldDismissModal(false);
      })
      .catch(function (error) {
        setPasswordResetError(`There was an error sending the email: ${error}`);
        setTimeout(() => setPasswordResetError(''), 2500);
      });
  }

  async function handleSignIn(email, password) {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        setSignInError('There was an error with these credentials');
        setTimeout(() => setSignInError(''), 2500);
      });
    const user = firebase.auth().currentUser;
    if (user && user.emailVerified) {
      await db
        .collection('users')
        .where('displayName', '==', user.displayName)
        .limit(1)
        .get()
        .then(function (snap) {
          console.log('snap', snap);
          if (snap.empty) {
            db.collection('users')
              .add({ displayName: user.displayName, isActive: false })
              .then((docRef) => {
                setFirebaseUserId(docRef.id);
                console.log('fbuid', firebaseUserId);
              })
              .catch((e) => console.log(e));
          } else {
            setFirebaseUserId(snap.docs[0].id);
          }
        })
        .catch((e) => console.log(e));
      // close the sign in modal
      setShouldDismissModal(true);
      setShouldDismissModal(false);
      setCurrUser(user.displayName);
    } else if (user && !user.emailVerified) {
      setSignInError('You need to confirm your email before you can sign in');
      setTimeout(() => setSignInError(''), 2500);
    }
  }

  async function handleSignOut() {
    await firebase
      .auth()
      .signOut()
      .then(function () {
        console.log('signed out');
      })
      .catch(function (error) {
        console.log('Error with sign out', error);
      });
    setCurrUser(null);
  }

  useEffect(() => {
    if (movieData && movieData.length) {
      let movieDataCopy = [...movieData];
      switch (sortSelected) {
        case 'dateAdded':
          movieDataCopy.sort((a, b) => (a.created.seconds > b.created.seconds ? -1 : 1));
          setMovieData(movieDataCopy);
          break;
        case 'releaseYear':
          movieDataCopy.sort((a, b) => (a.year > b.year ? -1 : 1));
          setMovieData(movieDataCopy);
          break;
        case 'title':
          movieDataCopy.sort((a, b) => (a.title > b.title ? 1 : -1));
          setMovieData(movieDataCopy);
          break;
        case 'avgRating':
          movieDataCopy.sort((a, b) =>
            parseFloat(a.avgRating) > parseFloat(b.avgRating) ? -1 : 1
          );
          setMovieData(movieDataCopy);
          break;
        default:
          break;
      }
      setSortSelected('');
    }
  }, [movieData, sortSelected]);

  const mainData = isLoading
    ? null
    : movieData.filter(
        (movie) =>
          regEx(searchTerm).test(movie.title) &&
          (filterSelected === '' || movie.creator === filterSelected)
      );

  const currentlyViewing = isLoading ? (
    <div style={{ padding: '50px 0 0 50px' }}>
      <SyncLoader sizeUnit={'px'} size={30} color={'darkKhaki'} />
    </div>
  ) : (
    !mainData.length ? <div style={{fontStyle: 'italic'}}>No movies found!</div>
    : mainData.map((movie) => {
      return (
        <Movie
          key={movie.id}
          {...movie}
          currUser={currUser}
          onDeleteMovieCallback={() => setMovieToDelete(movie)}
          onAddToWatchlistCallback={handleAddToWatchlist}
          isSignedIn={isSignedIn}
          isModal={false}
        />
      );
    })
  );

  // const loadMoreButton =
  //   !isLoading && limit <= movieData.length && mainData.length > 10 ? (
  //     <LoadMore ref={loadMoreRef}>Loading More ...</LoadMore>
  //   ) : null;

  const message = (
    <MessageContainer type={messageType}>
      <span>{actionMessage}</span>
    </MessageContainer>
  );

  const searchInput = (
    <Search
      type="text"
      name="Search"
      placeholder="Search for a title"
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  )

  const signInSignUpSignOutSearch = isSignedIn ? (
    <React.Fragment>
    <SignInSignUpWrapper>
      <SignOut onClick={handleSignOut}>Sign Out</SignOut>
    </SignInSignUpWrapper>
      {searchInput}
    </React.Fragment>
  ) : (
    <React.Fragment>
    <SignInSignUpWrapper>
      <SignInForm
        passwordReset={handleSendPasswordReset}
        passwordResetError={passwordResetError}
        handleSignInCallback={handleSignIn}
        signInError={signInError}
        modalDismiss={shouldDismissModal}
      />
      or
      <SignUpForm
        modalDismiss={shouldDismissModal}
        handleSignUpCallback={handleSignUp}
        signUpError={signUpError}
      />
      </SignInSignUpWrapper>
      {searchInput}
      </React.Fragment>
  );

  const addMovie = isSignedIn && (
    <AddMovie
      handleAddMovieCallback={handleAddMovie}
      alreadyAdded={alreadyAdded}
      notFound={notFound}
    />
  );

  const displayUser =
    currUser && currUser !== 'Guest' ? <WelcomeMsg>&nbsp;Hello, {currUser}</WelcomeMsg> : null;

  let modalContent = (
    <NoWatchListMsg>You have not yet added any movies to your watchlist.</NoWatchListMsg>
  );
  if (watchList && watchList.length > 0) {
    const watchListData = movieData.filter((movie) => watchList.includes(movie.title));
    modalContent = watchListData.map((movie) => (
      <Movie
        key={movie.id}
        {...movie}
        currUser={currUser}
        filter={filterSelected}
        onDeleteMovieCallback={() => setMovieToDelete(movie)}
        onRemoveFromWatchlistCallback={handleRemoveFromWatchList}
        isSignedIn={isSignedIn}
        isModal={true}
      ></Movie>
    ));
  }

  const watchlist = (
    <ToggleContent
      toggle={(show) => (
        <div onClick={() => setShouldArrowAnimate(true)}>
          <WatchListContainer onClick={show}>
            <h4 style={{ margin: '0' }}>My watchlist</h4>
            <p>
              <DownArrow animate={shouldArrowAnimate}></DownArrow>
            </p>
          </WatchListContainer>
        </div>
      )}
      content={(hide) => (
        <MyModal
          modalDismissedCallback={() => setShouldArrowAnimate(false)}
          hide={hide}
          override={shouldDismissModal}
        >
          <ModalContainer>{modalContent}</ModalContainer>
        </MyModal>
      )}
    />
  );

  return (
    <div className="App">
      {message}
      <TitleContainer className="titleContainer">
        <FlexHeader>
          {signInSignUpSignOutSearch}
          {displayUser}
          {watchlist}
        </FlexHeader>
        <FlexHeader>
          <Flex>
            <Title data-testid="title">Movies to watch</Title>
          <SortFlex>
            <Sort>
              <SelectMenuTitle data-testid="editorsPicksTitle">Editors' Picks:</SelectMenuTitle>
              <Select onChange={(e) => setFilterSelected(e.target.value)}>
                <option value="">All</option>
                {users.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </Select>
            </Sort>
            <Sort>
              <SelectMenuTitle data-testid="sortTitle">Sort by:</SelectMenuTitle>
              <Select onChange={(e) => setSortSelected(e.target.value)}>
                <option value="dateAdded">Recently Added</option>
                <option value="avgRating">Top Rated</option>
                <option value="releaseYear">Release Year</option>
                <option value="title">Titles A-Z</option>
              </Select>
            </Sort>
          </SortFlex>
          </Flex>
        </FlexHeader>
      </TitleContainer>
      <Main data-testid="main">
        {addMovie}
        {currentlyViewing}
      </Main>
    </div>
  );
};

export default App;
