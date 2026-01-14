import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// A simple component to test
const SimpleComponent = ({ message }) => {
  return <div>{message}</div>;
};

describe('SimpleTest', () => {
  it('should pass a basic math test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should render the component correctly', () => {
    render(<SimpleComponent message="Hello Vitest!" />);
    expect(screen.getByText('Hello Vitest!')).toBeInTheDocument();
  });
});

// // Run tests in watch mode:
// Run tests in watch mode:

// npm test
// This will run all tests and re-run them whenever you save changes to a file.

// Run tests with UI:

// npm run test:ui
// This opens a web interface where you can visualize your tests and their results.
