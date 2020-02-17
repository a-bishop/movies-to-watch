import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom';
import Movie from '../Movie.js';

const getMovieData = () => {
  return {
    title: 'Foo',
    year: '1980',
    genre: 'drama',
    director: 'Foo Bar',
    actors: 'Bar Baz',
    plot: 'Stuff and things.',
    ratings: [
      { Source: 'foo', Value: 10 },
      { Source: 'bar', Value: 7 },
      { Source: 'baz', Value: 6 }
    ],
    creator: 'Joe',
    currUser: 'Joe',
    poster: 'http://example.com',
    id: 1,
    key: 1,
    onDeleteMovieCallback: () => {},
    onAddToWatchlistCallback: () => {},
    onRemoveFromWatchlistCallback: () => {}
  };
};

it('renders the movie component', async () => {
  const { container } = render(<Movie {...getMovieData()}></Movie>);
  expect(container).toBeVisible();
});

it('displays the add to watchlist button when the user is not signed in', async () => {
  const { getByTestId } = render(
    <Movie {...getMovieData()} isSignedIn={false}></Movie>
  );
  const addButton = await waitForElement(() => getByTestId('addButton'));
  expect(addButton.textContent).toContain('Add To Watchlist');
});

it('displays the delete movie button when the user is signed in', async () => {
  const { getByTestId } = render(
    <Movie {...getMovieData()} isSignedIn={true}></Movie>
  );
  const delButton = await waitForElement(() => getByTestId('deleteButton'));
  expect(delButton.textContent).toContain('Delete Movie');
});

it('displays the remove from watchlist button when the movie is rendered in modal', async () => {
  const { getByTestId } = render(
    <Movie {...getMovieData()} isModal={true}></Movie>
  );
  const delButton = await waitForElement(() => getByTestId('removeButton'));
  expect(delButton.textContent).toContain('Remove From Watchlist');
});
