import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const typeText = screen.getByText(/Type/);
  const effectText = screen.getByText(/Effect/);
  const wonderGuardText = screen.getByText(/Wonder Guard/i);
  expect(typeText).toBeInTheDocument();
  expect(effectText).toBeInTheDocument();
  expect(wonderGuardText).toBeInTheDocument();
});
