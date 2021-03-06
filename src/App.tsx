import React, { useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import styled, { css, keyframes } from 'styled-components';
import * as storage from './storage';
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
import ScrollArrow from './ScrollArrow';
import { testUserData, testMovieData } from './test-data';
import { capitalize, toSearchString, regEx } from './helpers';
import { IMovie } from './Types';

if (!firebase?.apps?.length) {
  firebase.initializeApp(config.FIREBASE);
} else {
  firebase.app(); // if already initialized, use that one
}
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

const Title = styled.h2`
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
`;

const SelectMenuTitle = styled.h4`
  width: 90px;
  margin: 0;
  @media only screen and (min-width: 700px) {
    margin: 0 0 0 1em;
  }
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
  ${({ animate }: { animate: boolean }) => {
    if (animate)
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
  ${(props: { type: 'error' | 'warn' | 'alert' }) => {
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
  margin: 0 0 0.5rem 0;
`;

const Search = styled.input`
  flex: 1;
  padding-left: 0.5em;
  font-family: Futura;
  border: 1px solid grey;
  border-radius: 8px;
  height: 2.5rem;
  margin: 0 0 0 10px;
  @media only screen and (min-width: 700px) {
    max-width: 600px;
    margin: 0 5px 0 5px;
  }
`;

const WelcomeMsg = styled.span`
  font-weight: 'normal';
  white-space: 'nowrap';
  margin-right: 10px;
`;

// let renderCount = 0;
const useTestData = false; // set to true to prevent any fetching from firebase
const isDev = process.env.NODE_ENV === 'development';

const initialMovies = isDev && useTestData ? testMovieData : [];
const initialUsers = isDev && useTestData ? testUserData : [];

const App = () => {
  // main data
  const [movieData, setMovieData] = useState<IMovie[]>(initialMovies);
  const [users, setUsers] = useState<string[]>(initialUsers);
  const [watchList, setWatchList] = useState<string[]>([]);
  const [currUser, setCurrUser] = useState<string>('Guest');
  const [firebaseUserId, setFirebaseUserId] = useState<string>('');

  // input state
  const [newMovieAdded, setNewMovieAdded] = useState<IMovie | null>(null);
  const [movieToDelete, setMovieToDelete] = useState<IMovie | null>(null);
  const [sortSelected, setSortSelected] = useState('');
  const [filterSelected, setFilterSelected] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [shouldArrowAnimate, setShouldArrowAnimate] = useState(false);
  const [shouldDismissModal, setShouldDismissModal] = useState(false);

  // messaging and errors
  const [actionMessage, setActionMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'warn' | 'alert' | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const [signInError, setSignInError] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [passwordResetError, setPasswordResetError] = useState('');

  // if (isDev) {
  //   renderCount += 1;
  //   console.log('render count', renderCount);
  // }

  const isSignedIn = currUser !== 'Guest' && firebaseUserId !== '';
  const titles = movieData.map((d) => d.title);
  const isLoading = movieData.length === 0 || users.length === 0;

  firebase.auth().onAuthStateChanged(async () => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser && currentUser.emailVerified) {
      const displayName = currentUser?.displayName ?? '';
      setCurrUser(displayName);
    }
  });

  useEffect(() => {
    async function syncUserTable() {
      await db
        .collection('users')
        .where('displayName', '==', currUser)
        .limit(1)
        .get()
        .then(function (snap) {
          console.log('snap', snap);
          if (snap.empty) {
            db.collection('users')
              .add({ displayName: currUser, isActive: false })
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
    }

    if (firebaseUserId === '' && currUser !== '' && currUser !== 'Guest') syncUserTable();
  }, [currUser, firebaseUserId]);

  // Get Movies
  useEffect(() => {
    async function checkFreshnessAndFetchMovies() {
      const oldestPossibleTime = new Date(0).getTime();
      const latestPossibleTime = new Date().getTime();

      let storageLastUpdated = JSON.parse(storage.local.getItem('moviesLastUpdatedAt') ?? JSON.stringify(oldestPossibleTime));
      let fbMoviesLastUpdated = latestPossibleTime;
      await db
        .collection('meta')
        .doc('lastUpdated')
        .get()
        .then((doc) => (fbMoviesLastUpdated = doc.data()?.movies ?? latestPossibleTime))
        .catch((e) => console.error(e));
      // typecheck is for backwards compatibility for users with old timestamp type
      if (typeof fbMoviesLastUpdated !== typeof storageLastUpdated || fbMoviesLastUpdated > storageLastUpdated) {
        if (isDev) console.log('getting from remote');
        await db
          .collection('movies')
          .orderBy('created', 'desc')
          .get()
          .then((res) => {
            let data: IMovie[] = [];
            res?.forEach((doc) => {
              const docData = doc.data();
              const id = doc.id;
              const avgRating = getAvgRating(docData.ratings);
              const allData: any = { ...docData, id, avgRating };
              data.push(allData);
            });
            setMovieData(data);
            storage.local.setItem('moviesLastUpdatedAt', JSON.stringify(fbMoviesLastUpdated));
          })
          .catch((e) => console.error(e));
      } else {
        const md = storage.local.getItem('movieData');
        md && setMovieData([...JSON.parse(md)]);
      }
    }

    checkFreshnessAndFetchMovies().catch((e) => console.error(e));
  }, []);

  // Get Users and Watchlist
  useEffect(() => {
    async function fetchUsers() {
      console.log('getting users');
      let activeUsers: string[] = [];
      let watchListData: string[] = [];
      if (!isSignedIn) {
        const data = storage.local.getItem('watchList');
        if (data) watchListData = [...JSON.parse(data)];
      }
      await db
        .collection('users')
        .get()
        .then(async (querySnapshot) => {
          await querySnapshot.forEach((user) => {
            const { displayName, watchList, isActive } = user.data();
            if (isActive && displayName) activeUsers.push(displayName);
            if (currUser === displayName && watchList?.length) {
              watchList.forEach((title: string) => watchListData.push(title));
            }
          });
        })
        .catch((e) => console.error(e));

      setUsers(activeUsers);
      setWatchList(watchListData);
    }

    if (!users.length) fetchUsers().catch((e) => console.error(e));
  }, [currUser, isSignedIn, users]);

  useEffect(() => {
    movieData?.length && storage.local.setItem('movieData', JSON.stringify(movieData));
  }, [movieData]);

  useEffect(() => {
    shouldDismissModal && setShouldDismissModal(false);
  }, [shouldDismissModal]);

  useEffect(() => {
    signInError && setTimeout(() => setSignInError(''), 4000);
  }, [signInError]);

  useEffect(() => {
    signUpError && setTimeout(() => setSignUpError(''), 4000);
  }, [signUpError]);

  useEffect(() => {
    passwordResetError && setTimeout(() => setPasswordResetError(''), 4000);
  }, [passwordResetError]);

  useEffect(() => {
    async function updateLocalStorageAndFirebase() {
      const now = new Date().getTime();
      let success = await db
        .collection('meta')
        .doc('lastUpdated')
        .set({ movies: now })
        .then(() => true)
        .catch((e) => console.log(e));
      console.log({ success });
      success && storage.local.setItem('moviesLastUpdatedAt', JSON.stringify(now));
    }
    newMovieAdded && updateLocalStorageAndFirebase();
  }, [newMovieAdded]);

  useEffect(() => {
    async function updateLocalStorageAndFirebase() {
      storage.local.setItem('watchList', JSON.stringify(watchList));
      if (isSignedIn) {
        await await db
          .collection('users')
          .doc(firebaseUserId)
          .update({ watchList })
          .catch((e) => console.log(e));
      }
    }
    !isLoading && updateLocalStorageAndFirebase();
  }, [watchList, firebaseUserId, isSignedIn]);

  // TODO:
  // Add users array to local storage and set lastUpdated in firebase on every user update

  useEffect(() => {
    if (movieData && isSignedIn && firebaseUserId && movieData.filter((movie) => movie.creator === currUser).length <= 1) {
      // set the user to active or inactive in firebase depending on whether they are
      // adding their first film or removing their last film
      const isActive = movieData.filter((movie) => movie.creator === currUser).length !== 0;
      db.collection('users')
        .doc(firebaseUserId)
        .update({ isActive })
        .then(() => {
          const newUsers = isActive ? [currUser, ...users] : users.filter((user) => user !== currUser);
          setUsers(newUsers);
        })
        .catch((e) => console.error(e));
    }
  }, [movieData, currUser, firebaseUserId, isSignedIn, users]);

  // Gets the average rating from ratings systems
  // ie. IMdB, Rotten Tomatoes and Metacritic
  const getAvgRating = (ratings: { Value: string }[] | undefined) => {
    if (!ratings) return null;
    let ratingTotal = 0;
    let numRatings = ratings.length;
    for (const rating of ratings) {
      let doubleVal = parseFloat(rating.Value);
      if (doubleVal <= 10) doubleVal *= 10;
      ratingTotal += doubleVal;
    }
    return (ratingTotal / numRatings).toFixed(2);
  };

  useEffect(() => {
    if (newMovieAdded && currUser) {
      const { title, year, genre, director, actors, plot, ratings, poster, created, creator } = newMovieAdded;
      setNewMovieAdded(null);
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
          const avgRating = getAvgRating(ratings);
          const newMovie = {
            ...newMovieAdded,
            id,
            ...(avgRating && { avgRating }),
          };
          const newData = [newMovie, ...movieData];
          setMovieData(newData);
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
        });
    }
  }, [newMovieAdded, currUser, movieData]);

  useEffect(() => {
    if (movieToDelete) {
      db.collection('movies')
        .doc(movieToDelete.id)
        .delete()
        .then(() => {
          setMovieToDelete(null);
          handleSetActionMessage('Movie successfully deleted!', 'alert');
          const newData = movieData.filter((movie) => movie.title !== movieToDelete.title);
          setMovieData(newData);
        })
        .catch(function (error) {
          handleSetActionMessage(`Error removing movie: ${error}`, 'error');
        });
    }
  }, [movieToDelete, movieData]);

  function handleAddMovie(title: string, year: string) {
    setAlreadyAdded(false);
    setNotFound(false);
    if (!titles.includes(capitalize(title))) {
      const url = `https://www.omdbapi.com/?t=${toSearchString(title)}&y=${year}&plot=full&apikey=${config.OMDB_KEY}`;
      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          if (json.Response === 'True') {
            const newMovie: IMovie = {
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

  function handleSetActionMessage(msg: string, type: 'error' | 'warn' | 'alert', timer = 2500) {
    setMessageType(type);
    setActionMessage(msg);
    setTimeout(() => {
      setActionMessage('');
      setMessageType(null);
    }, timer);
  }

  async function handleAddToWatchlist(title: string) {
    if (watchList.includes(title)) {
      handleSetActionMessage(`${title} is already in your watchlist!`, 'warn');
      return;
    }
    const newWatchList = [...watchList];
    newWatchList.push(title);
    setWatchList(newWatchList);
    handleSetActionMessage(`${title} was added to your watchlist!`, 'alert');
  }

  async function handleRemoveFromWatchList(title: string) {
    const watchListCopy = [...watchList];
    const movies = watchListCopy.filter((movie) => movie !== title);
    setWatchList(movies);
  }

  async function handleSignUp(name: string, email: string, password: string) {
    let userNameExists = false;
    if (name.length < 3) {
      setSignUpError(`Your name needs to be at least three letters`);
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
            setSignUpError(`Please add your last initial to your name. A user with your name already exists!`);
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
        })
        .catch(function (error) {
          setSignUpError(`There was an error signing up: ${error}`);
        });
    }

    handleSignOut();
  }

  function handleSendPasswordReset(email: string) {
    let auth = firebase.auth();

    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        handleSetActionMessage("We've sent you a password reset email", 'alert', 5000);
        setShouldDismissModal(true);
      })
      .catch(function (error) {
        setPasswordResetError(`There was an error sending the email: ${error}`);
      });
  }

  async function handleSignIn(email: string, password: string) {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        console.log(error);
        setSignInError('There was an error with these credentials');
      });
    const user = firebase.auth().currentUser;
    if (user && user.emailVerified) {
      // close the sign in modal
      setShouldDismissModal(true);
      setCurrUser(user?.displayName ?? 'Guest');
    } else if (user && !user.emailVerified) {
      setSignInError('You need to confirm your email before you can sign in');
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
    setCurrUser('Guest');
  }

  useEffect(() => {
    if (movieData.length) {
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
          movieDataCopy.sort((a, b) => (parseFloat(a?.avgRating ?? '0.0') > parseFloat(b?.avgRating ?? '0.0') ? -1 : 1));
          setMovieData(movieDataCopy);
          break;
        default:
          break;
      }
      setSortSelected('');
    }
  }, [sortSelected, movieData]);

  const mainData = isLoading
    ? []
    : movieData.filter((movie) => regEx(searchTerm).test(movie.title) && (filterSelected === '' || movie.creator === filterSelected));

  let modalContent: any = <NoWatchListMsg>You have not yet added any movies to your watchlist.</NoWatchListMsg>;
  if (watchList.length) {
    const watchListData = movieData.filter((movie) => watchList.includes(movie.title));
    modalContent = watchListData.map((movie) => (
      <Movie
        key={movie.id}
        {...movie}
        currUser={currUser}
        onDeleteMovieCallback={() => setMovieToDelete(movie)}
        onRemoveFromWatchlistCallback={() => handleRemoveFromWatchList(movie.title)}
        isSignedIn={isSignedIn}
        isModal={true}
      ></Movie>
    ));
  }

  return (
    <div className="App">
      {actionMessage && (
        <MessageContainer type={messageType ?? 'alert'}>
          <span>{actionMessage}</span>
        </MessageContainer>
      )}
      <TitleContainer className="titleContainer">
        <FlexHeader>
          {isSignedIn && (
            <SignInSignUpWrapper>
              <SignOut onClick={handleSignOut}>Sign Out</SignOut>
            </SignInSignUpWrapper>
          )}

          {!isSignedIn && (
            <SignInSignUpWrapper>
              <SignInForm
                passwordReset={handleSendPasswordReset}
                passwordResetError={passwordResetError}
                handleSignInCallback={handleSignIn}
                signInError={signInError}
                modalDismiss={shouldDismissModal}
              />
              or
              <SignUpForm modalDismiss={shouldDismissModal} handleSignUpCallback={handleSignUp} signUpError={signUpError} />
            </SignInSignUpWrapper>
          )}
          <Search
            type="text"
            name="Search"
            placeholder="Search for a title"
            value={searchTerm}
            onChange={(e) => {
              // prevent regex failures by removing '\' chars
              const s = (e.target.value ?? '').replaceAll('\\', '');
              setSearchTerm(s);
            }}
          />
          <WelcomeMsg>&nbsp;Hello, {currUser}</WelcomeMsg>
          <ToggleContent
            toggle={(show: () => void) => (
              <div onClick={() => setShouldArrowAnimate(true)}>
                <WatchListContainer onClick={show}>
                  <h4 style={{ margin: '0 0.5rem 0 0' }}>My watchlist</h4>
                  <p>
                    <DownArrow animate={shouldArrowAnimate}></DownArrow>
                  </p>
                </WatchListContainer>
              </div>
            )}
            content={(hide: () => void) => (
              <MyModal modalDismissedCallback={() => setShouldArrowAnimate(false)} hide={hide} override={shouldDismissModal}>
                <ModalContainer>{modalContent}</ModalContainer>
              </MyModal>
            )}
          />
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
        {isSignedIn && <AddMovie handleAddMovieCallback={handleAddMovie} alreadyAdded={alreadyAdded} notFound={notFound} />}

        {isLoading && (
          <div style={{ padding: '50px 0 0 50px' }}>
            <SyncLoader size={30} color={'darkKhaki'} />
          </div>
        )}

        {!isLoading && mainData.length === 0 && <div style={{ fontStyle: 'italic' }}>No movies found!</div>}

        {!isLoading &&
          mainData.length > 0 &&
          mainData.map((movie) => {
            return (
              <Movie
                key={movie.id}
                {...movie}
                currUser={currUser}
                onDeleteMovieCallback={() => setMovieToDelete(movie)}
                onAddToWatchlistCallback={() => handleAddToWatchlist(movie.title)}
                isSignedIn={isSignedIn}
              />
            );
          })}
        <ScrollArrow />
      </Main>
    </div>
  );
};

export default App;
