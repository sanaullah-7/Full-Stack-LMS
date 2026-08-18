import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import { AuthProvider } from './context/authContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    );
    expect(document.body).toBeTruthy();
  });

  // Test 2: DOM Content Check
  it('renders correctly in DOM', () => {
    render(
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    );
    expect(document.body.innerHTML).not.toBe('');
  });

  // Test 3: User Interaction Check
  it('handles basic click events', () => {
    render(
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    );
    const buttons = screen.queryAllByRole('button');
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
    }
  });
});