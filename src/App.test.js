import React from 'react';

import ReactDOM from 'react-dom';
import App from './App';

import { useAuth0 } from './react-auth0-wrapper';

jest.mock('./react-auth0-wrapper');

describe('App', () => {
  beforeEach(() => {
    useAuth0.mockReturnValue({
      loading: false
    });
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
})
