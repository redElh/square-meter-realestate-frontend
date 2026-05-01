import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the site brand', () => {
  render(<App />);
  const brandElements = screen.getAllByText(/square meter/i);
  expect(brandElements.length).toBeGreaterThan(0);
});
