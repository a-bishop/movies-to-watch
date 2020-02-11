import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import App from '../App.js';

it('renders the title and menu', async () => {
  const { getByTestId } = render(<App />);
  const title = await waitForElement(() => getByTestId('title'));
  await expect(title.textContent).toContain('Movies to watch!');

  const selectMenu = await waitForElement(() =>
    getByTestId('editorsPicksTitle')
  );
  await expect(selectMenu.textContent).toContain("Editors' Picks:");

  const sortMenu = await waitForElement(() => getByTestId('sortTitle'));
  await expect(sortMenu.textContent).toContain('Sort by:');
});

// it('', () => {
//   const { queryByLabelText, getByLabelText } = render(
//     <CheckboxWithLabel labelOn="On" labelOff="Off" />
//   );

//   expect(queryByLabelText(/off/i)).toBeTruthy();

//   fireEvent.click(getByLabelText(/off/i));

//   expect(queryByLabelText(/on/i)).toBeTruthy();
// });
