import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import { LoginForm } from './Login';

describe('LoginForm Component', () => {
  // render
  it('renders LoginForm component', () => {
    const { getByText } = render(
      <Router>
        <LoginForm />
      </Router>
    );
    expect(getByText('Welcome to Airbrb!')).toBeInTheDocument();
  });

  // input
  it('allows entering email and password', () => {
    const { getByLabelText } = render(
      <Router>
        <LoginForm />
      </Router>
    );
    const emailInput = getByLabelText(/Email/i);
    const passwordInput = getByLabelText('Password');
    fireEvent.change(emailInput, { target: { value: '111@icloud.com' } });
    fireEvent.change(passwordInput, { target: { value: '11111' } });
    expect(emailInput.value).toBe('111@icloud.com');
    expect(passwordInput.value).toBe('11111');
  });

  // password visibility
  it('toggles password visibility', () => {
    const { getByLabelText, getByRole } = render(
      <Router>
        <LoginForm />
      </Router>
    );
    const passwordInput = getByLabelText('Password');
    const toggleButton = getByRole('button', {
      name: /toggle password visibility/i,
    });
    expect(passwordInput.type).toBe('password');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
  });

  // submit button
  it('renders a submit button', () => {
    const { getByRole } = render(
      <Router>
        <LoginForm />
      </Router>
    );
    const submitButton = getByRole('button', { name: /Submit/i });
    expect(submitButton).toBeInTheDocument();
  });
});
